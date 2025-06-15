import axios from "axios";
import { bq_apikey } from "./constant";

const endpoint = "https://streaming.bitquery.io/eap";
const TOKEN_DETAILS = (resolution, offset) => `query TradingView($token: String, $interval: Int) {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      orderBy: {descendingByField: "Block_Timefield"}
      where: {Trade: {Currency: {MintAddress: {is: $token}}, PriceAsymmetry: {lt: 0.1}}}
      limit: {count: 500, offset: ${offset}}

      ) {
      Block {
        Timefield: Time(interval: {in: ${resolution}, count: $interval})
      }
      volume: sum(of: Trade_Amount)
      Trade {
        high: PriceInUSD(maximum: Trade_PriceInUSD)
        low: PriceInUSD(minimum: Trade_PriceInUSD)
        open: PriceInUSD(minimum: Block_Slot)
        close: PriceInUSD(maximum: Block_Slot)
      }
      count
    }
  }
}
`;

const TOKEN_SECONDS_DETAILS = () => `
  query TradingView($token: String, $interval: Int) {
  Solana(dataset: realtime, aggregates: no) {
     DEXTradeByTokens(
      orderBy: {ascendingByField: "Block_Time"}
      where: {
        Trade: {
          Currency: {MintAddress: {is: $token}}, 
          Side: {
            Currency: {
              MintAddress: {
                in: [
                  "11111111111111111111111111111111",
                  "So11111111111111111111111111111111111111112",
                  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
                  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
                  "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"
                ]
              }
            }
          }
        }, 
        Transaction: {Result: {Success: true}}
      }
    ) {
      Block {
        Time(interval: {count: $interval, in: seconds})
      }
      low: quantile(of: Trade_PriceInUSD, level: 0.05)
      high: quantile(of: Trade_PriceInUSD, level: 0.80)
      close: Trade {
        PriceInUSD(maximum: Block_Slot)
      }
      open: Trade {
        PriceInUSD(minimum: Block_Slot)
      }
      volume: sum(of: Trade_Side_AmountInUSD)
    }
  }
}`;

export async function fetchHistoricalData(periodParams, resolution, token, isUsdActive, isMarketCapActive, supply, solPrice, tokenCreator, userWallet, offset) {
  // console.log("🚀 ~ fetchHistoricalData ~ resolution:", resolution);
  supply = supply ? Number(supply) === 0 ? 1_000_000_000 : Number(supply) : 1_000_000_000;
  solPrice = solPrice ? Number(solPrice) === 0 ? 1 : Number(solPrice) : 1; 
  const isSecondsResolution = resolution.endsWith("S");
  const { from, to, countBack } = periodParams;

  // console.log("🚀 ~ fetchHistoricalData ~ countBack:", countBack);
  // const requiredBars = 20000;
  // const timeFromTv = new Date(from * 1000).toISOString();
  // const timeToTv = new Date(to * 1000).toISOString();

  // console.log("timeFromTv", timeFromTv);
  // console.log("timeToTv", timeToTv);
  // const oneDay = 86400;

  // console.log("🚀 ~ fetchHistoricalData ~ timeFromTv:", timeFromTv);
  // console.log(resolution);

  const resolutionStr = resolution?.toString() ?? "";
  const lastChar = resolutionStr.slice(-1);
  let resolutionNumber;
  let resolutionFinal;

  // Check if the last character is a letter
  if (/[a-zA-Z]/.test(lastChar)) {
    resolutionNumber = Number(resolutionStr.slice(0, -1));
    
    if (lastChar === "S") {
      resolutionFinal = "seconds";
    } else if (lastChar === "D") {
      resolutionFinal = "days"; // You can replace this with a meaningful value if needed
    } else {
      resolutionFinal = "unknown"; // Or handle unexpected characters
    }
  } else {
    // Check if the last character is a letter
  if (/[a-zA-Z]/.test(lastChar)) {
    resolutionNumber = Number(resolutionStr.slice(0, -1));
    
    if (lastChar === "S") {
      resolutionFinal = "seconds";
    } else if (lastChar === "D") {
      resolutionFinal = "days"; // You can replace this with a meaningful value if needed
    } else {
      resolutionFinal = "unknown"; // Or handle unexpected characters
    }
  } else {
    resolutionNumber = Number(resolutionStr);

    if (resolutionNumber >= 60) {
      const hours = resolutionNumber / 60;
      resolutionNumber = hours;
      resolutionFinal = "hours";
    } else {
      resolutionFinal = "minutes";
    }
  }
}

  try {
    const response = await axios.post(
      endpoint,
      {
        query: resolutionFinal !== "seconds" ? TOKEN_DETAILS(resolutionFinal, offset) : TOKEN_SECONDS_DETAILS(),
        variables: {
          token: token,
          interval: resolutionNumber,
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bq_apikey}`,
        },
      }
    );
    // console.log("🚀 ~ fetchHistoricalData ~ response:", response.data.data)
    // console.log("API called");
    const trades = response.data.data.Solana.DEXTradeByTokens;
    // console.log('trades', trades);

    // Preprocess the bars data
    let bars = trades
      ?.filter(trade => {
        const usdOpen = isUsdActive 
          ? (trade?.Trade?.open || trade?.open?.PriceInUSD) ?? 0
          : ((trade?.Trade?.open || trade?.open?.PriceInUSD) ?? 0) / (solPrice || 1);
        const open = isMarketCapActive ? usdOpen * (supply || 1) : usdOpen;

        const usdClose = isUsdActive
          ? (trade?.Trade?.close || trade?.close?.PriceInUSD) ?? 0
          : ((trade?.Trade?.close || trade?.close?.PriceInUSD) ?? 0) / (solPrice || 1);
        const close = isMarketCapActive ? usdClose * (supply || 1) : usdClose;

        return open !== 0 && close !== 0; // Keep trades where both open and close are non-zero
      })
      .map(trade => {
        const blockTime = new Date(trade.Block.Timefield || trade.Block.Time).getTime();
        if (isNaN(blockTime)) return null; // Skip invalid dates

        const usdOpen = isUsdActive
          ? (trade?.Trade?.open || trade?.open?.PriceInUSD) ?? 0
          : ((trade?.Trade?.open || trade?.open?.PriceInUSD) ?? 0) / (solPrice || 1);
        const open = isMarketCapActive ? usdOpen * (supply || 1) : usdOpen;

        const usdClose = isUsdActive
          ? (trade?.Trade?.close || trade?.close?.PriceInUSD) ?? 0
          : ((trade?.Trade?.close || trade?.close?.PriceInUSD) ?? 0) / (solPrice || 1);
        const close = isMarketCapActive ? usdClose * (supply || 1) : usdClose;

        const usdSolHigh = isUsdActive ? trade?.Trade?.high ?? 0 : (trade?.Trade?.high ?? 0) / (solPrice || 1);
        const high = isMarketCapActive ? usdSolHigh * (supply || 1) : usdSolHigh;

        const usdSolLow = isUsdActive ? trade?.Trade?.low ?? 0 : (trade?.Trade?.low ?? 0) / (solPrice || 1);
        const low = isMarketCapActive ? usdSolLow * (supply || 1) : usdSolLow;

        return {
          time: blockTime,
          open,
          high: isSecondsResolution ? open : high,
          low: isSecondsResolution ? close : low,
          close,
          volume: isNaN(Number(trade?.volume)) ? 0 : Number(trade?.volume),
        };
      })
      .filter(item => item != null);
      
    const deduped = Object.values(
      bars.reduce((acc, bar) => {
        acc[bar.time] = bar; // overwrite any previous one with same time
        return acc;
      }, {})
    );

    bars = deduped.sort((a, b) => a.time - b.time);

    if (bars?.length > 0) {
      let lastValidClose = bars[0].close; // Initialize with first bar's close

      bars = bars
        .map((bar, index, arr) => {
          if (index === 0) {
            lastValidClose = bar.close; // Update for first bar
            return bar;
          }

          // Use the last valid close price for newOpen
          const newOpen = lastValidClose;
          const newClose = bar.close;

          // Calculate absolute percentage change within the candle
          const absoluteChange = Math.abs(newClose - newOpen);
          const referencePrice = Math.min(Math.abs(newOpen), Math.abs(newClose));
          
          // Calculate percentage change
          const percentageChange = referencePrice === 0 ? 0 : (absoluteChange / referencePrice) * 100;
          
          if (percentageChange > 10000) {
            return null;
          }

          // Update lastValidClose for the next bar
          lastValidClose = newClose;

          const bodyTop = Math.max(newOpen, newClose);
          const bodyBottom = Math.min(newOpen, newClose);
          const candleSize = Math.abs(newOpen - newClose);

          const maxHigh = bodyTop + candleSize;
          const minLow = bodyBottom - candleSize;

          const clampedHigh = Math.min(bar.high, maxHigh);
          const clampedLow = Math.max(bar.low, minLow);

          return {
            ...bar,
            open: newOpen,
            close: newClose,
            high: clampedHigh,
            low: clampedLow,
          };
        })
        .filter(bar => bar !== null); // Remove null bars
    }
    // console.log('remaining bars before filter', bars.length);
    // ✅ Filter out flat or no-activity bars
    // if (bars?.length > 0) {
    //   bars = bars?.filter((bar) => {
    //     const isPriceChanged = bar.open !== bar.close;
    //     return isPriceChanged;
    //   });
    // }
    // console.log('remaining bars after filter', bars.length);

    // Handle missing bars
    // if (bars.length < requiredBars) {
    //   const earliestTime = bars[0]?.time;
    //   const missingBarsCount = requiredBars - bars.length;

    //   // Generate missing bars before the earliest returned bar
    //   for (let i = 1; i <= missingBarsCount; i++) {
    //     bars.unshift({
    //       time: earliestTime - i * 60000, // Assuming 1-minute bars (60000 ms)
    //       open: 0,
    //       high: 0,
    //       low: 0,
    //       close: 0,
    //       volume: 0,
    //     });
    //   }
    // }

    // Remove duplicates and sort
    if (bars?.length > 0) {
      bars = await Array.from(
        new Map(bars.map((bar) => [bar.time, bar])).values()
      );
      await bars.sort((a, b) => a.time - b.time);
    }
    
    return {
      bars,
      offset: trades?.length
    }
  } catch (err) {
    console.error("Error fetching historical data:", err?.message);
    throw err;
  }
}