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
      volume: sum(of: Trade_Side_AmountInUSD)
      sol_volume: sum(of: Trade_Side_Amount)
      Trade {
        high: PriceInUSD(maximum: Trade_PriceInUSD)
        low: PriceInUSD(minimum: Trade_PriceInUSD)
        open: PriceInUSD(minimum: Block_Slot)
        close: PriceInUSD(maximum: Block_Slot)
        
        # Solana prices (in SOL)
        highSOL: Price(maximum: Trade_Price)
        lowSOL: Price(minimum: Trade_Price)
        openSOL: Price(minimum: Block_Slot)
        closeSOL: Price(maximum: Block_Slot)
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

      sol_low: quantile(of: Trade_Price, level: 0.05)
      sol_high: quantile(of: Trade_Price, level: 0.80)
      sol_close: Trade {
        Price(maximum: Block_Slot)
      }
      sol_open: Trade {
        Price(minimum: Block_Slot)
      }
      sol_volume: sum(of: Trade_Side_Amount)
    }
  }
}`;

export async function fetchHistoricalData(periodParams, resolution, token, isUsdActive, isMarketCapActive, supply, offset) {
  // console.log("🚀 ~ fetchHistoricalData ~ resolution:", resolution);
  supply = supply ? Number(supply) === 0 ? 1_000_000_000 : Number(supply) : 1_000_000_000;
  // const { from, to, countBack } = periodParams;
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
    console.log(response);
    // console.log("🚀 ~ fetchHistoricalData ~ response:", response.data.data)
    // console.log("API called");
    const trades = response.data.data.Solana.DEXTradeByTokens;
    // console.log('trades', trades);

    // Preprocess the bars data
    let bars = trades
      ?.filter(trade => {
        const usdOpen = isUsdActive 
          ? (trade?.Trade?.open || trade?.open?.PriceInUSD) ?? 0
          : (trade?.Trade?.openSOL || trade?.sol_open?.Price) ?? 0;
        const open = isMarketCapActive ? usdOpen * (supply || 1) : usdOpen;

        const usdClose = isUsdActive
          ? (trade?.Trade?.close || trade?.close?.PriceInUSD) ?? 0
          : (trade?.Trade?.closeSOL || trade?.sol_close?.Price) ?? 0;
        const close = isMarketCapActive ? usdClose * (supply || 1) : usdClose;
        if (trade?.Trade?.close === 0 && trade?.Trade?.open === 0) {
          return;
        }
        return open !== 0 && close !== 0; // Keep trades where both open and close are non-zero
      })
      .map(trade => {
        const blockTime = new Date(trade.Block.Timefield || trade.Block.Time).getTime();
        if (isNaN(blockTime)) return null; // Skip invalid dates

        const usdOpen = isUsdActive
          ? (trade?.Trade?.open || trade?.open?.PriceInUSD) ?? 0
          : (trade?.Trade?.openSOL || trade?.sol_open?.Price) ?? 0;
        const open = isMarketCapActive ? usdOpen * (supply || 1) : usdOpen;

        const usdClose = isUsdActive
          ? (trade?.Trade?.close || trade?.close?.PriceInUSD) ?? 0
          : (trade?.Trade?.closeSOL || trade?.sol_close?.Price) ?? 0;
        const close = isMarketCapActive ? usdClose * (supply || 1) : usdClose;

        const usdSolHigh = isUsdActive ? (trade?.Trade?.high || trade?.high) ?? 0 : (trade?.Trade?.highSOL || trade?.sol_high) ?? 0;
        const high = isMarketCapActive ? usdSolHigh * (supply || 1) : usdSolHigh;

        const usdSolLow = isUsdActive ? (trade?.Trade?.low || trade?.low) ?? 0 : (trade?.Trade?.lowSOL || trade?.sol_low) ?? 0;
        const low = isMarketCapActive ? usdSolLow * (supply || 1) : usdSolLow;

        return {
          time: blockTime,
          open,
          high,
          low,
          close,
          volume: isUsdActive ? Number(trade?.volume) : Number(trade?.sol_volume) ,
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

  // Calculate percentage changes and identify spikes
  const barsWithMetrics = bars.map((bar, index, arr) => {
    if (index === 0) {
      lastValidClose = bar.close;
      return { ...bar, percentageChange: 0 };
    }

    const newOpen = lastValidClose;
    const newClose = bar.close;
    const absoluteChange = Math.abs(newClose - newOpen);
    const referencePrice = Math.min(Math.abs(newOpen), Math.abs(newClose));
    const percentageChange = referencePrice === 0 ? 0 : (absoluteChange / referencePrice) * 100;

    lastValidClose = newClose;

    return {
      ...bar,
      open: newOpen,
      close: newClose,
      percentageChange,
      originalIndex: index // Store original index for reference
    };
  });

  // Detect and remove spikes
  const filteredBars = barsWithMetrics.filter((bar, index, arr) => {
    const isSpike = bar.percentageChange > 3; // Spike threshold: >3% change
    if (!isSpike) return true; // Keep non-spike bars

    // Check 4 candles before and after
    const lookback = 4;
    const lookahead = 4;
    const normalThreshold = 7; // Normalization threshold: <10% change

    // Collect percentage changes of surrounding candles
    const prevChanges = [];
    const nextChanges = [];

    // Look back
    for (let i = 1; i <= lookback; i++) {
      if (index - i >= 0) {
        prevChanges.push(arr[index - i].percentageChange);
      }
    }

    // Look forward
    for (let i = 1; i <= lookahead; i++) {
      if (index + i < arr.length) {
        nextChanges.push(arr[index + i].percentageChange);
      }
    }

    // Check if surrounding candles are "normal" (most have <5% change)
    const normalPrev = prevChanges.length > 0 
      ? prevChanges.filter(change => change < normalThreshold).length >= prevChanges.length * 0.75
      : true; // Consider normal if not enough previous candles
    const normalNext = nextChanges.length > 0 
      ? nextChanges.filter(change => change < normalThreshold).length >= nextChanges.length * 0.75
      : true; // Consider normal if not enough next candles

    // If both surrounding sets are mostly normal, consider this a spike to remove
    return !(normalPrev && normalNext);
  });

  // Reconstruct bars with clamped high/low and reconnect open prices
  bars = filteredBars.map((bar, index, arr) => {
    // Use previous bar's close as open for all bars except the first
    const newOpen = index === 0 ? bar.open : arr[index - 1].close;

    const bodyTop = Math.max(newOpen, bar.close);
    const bodyBottom = Math.min(newOpen, bar.close);
    const candleSize = Math.abs(newOpen - bar.close);

    const maxHigh = bodyTop + candleSize;
    const minLow = bodyBottom - candleSize;

    return {
      time: bar.time,
      open: newOpen,
      close: bar.close,
      high: Math.min(bar.high, maxHigh),
      low: Math.max(bar.low, minLow),
      volume: bar.volume
    };
  });
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