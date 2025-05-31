import axios from "axios";
import { bq_apikey } from "./constant";
import { addMark } from "./mark";

const endpoint = "https://streaming.bitquery.io/eap";
const TOKEN_DETAILS = `query TradingView($token: String, $dataset: dataset_arg_enum, $from: DateTime, $to: DateTime, $interval: Int, $walletsToMark: [String!] = []) {
  Solana(dataset: $dataset, aggregates: no) {
    
    # 1. OHLC aggregated data
    ohlcData: DEXTradeByTokens(
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
        Block: {Time: {since: $from, till: $to}}, 
        Transaction: {Result: {Success: true}}
      }
    ) {
      Block {
        Time(interval: {count: $interval, in: seconds})
      }
      low: quantile(of: Trade_PriceInUSD, level: 0.20)
      high: quantile(of: Trade_PriceInUSD, level: 0.80)
      close: Trade {
        PriceInUSD(maximum: Block_Slot)
      }
      open: Trade {
        PriceInUSD(minimum: Block_Slot)
      }
      volume: sum(of: Trade_Side_AmountInUSD)
    }

    # 2. Raw trade info (e.g. to check signer + side)
    creatorTransactions: DEXTradeByTokens(
      orderBy: {descending: Block_Time}
      limit: {count: 1000}
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
        Block: {Time: {since: $from, till: $to}}, 
        Transaction: {
          Result: {Success: true}, 
          Signer: {in: $walletsToMark}
        }
      }
    ) {
      Block {
        Time
      }
      Transaction {
        Signer
      }
      Trade {
        Amount
        PriceInUSD
        Side {
          Type
          AmountInUSD
        }
      }
    }

  }
}`;

export async function fetchHistoricalData(periodParams, resolution, token, isUsdActive, isMarketCapActive, supply, solPrice, tokenCreator, userWallet) {
  // console.log("🚀 ~ fetchHistoricalData ~ resolution:", resolution);
  supply = supply ? Number(supply) === 0 ? 1_000_000_000 : Number(supply) : 1_000_000_000;
  solPrice = solPrice ? Number(solPrice) === 0 ? 1 : Number(solPrice) : 1; 
  const isSecondsResolution = resolution.endsWith("S");
  const { from, to, countBack } = periodParams;
  const walletsToMark = [];
  if (tokenCreator != 0) {
    walletsToMark.push(tokenCreator);
  }
  if (userWallet !== null) {
    walletsToMark.push(userWallet);
  } 

  // console.log("🚀 ~ fetchHistoricalData ~ countBack:", countBack);
  const requiredBars = 20000;
  const timeFromTv = new Date(from * 1000).toISOString();
  const timeToTv = new Date(to * 1000).toISOString();
  const oneDay = 86400;

  // console.log("🚀 ~ fetchHistoricalData ~ timeFromTv:", timeFromTv);
  let finalInterval = 60;

  if (resolution?.toString()?.slice(-1) == "S") {
    finalInterval = Number(resolution?.toString()?.slice(0, 1));
  } else if (resolution?.toString()?.slice(-1) == "D") {
    finalInterval = Number(resolution?.toString()?.slice(0, 1)) * oneDay;
  } else {
    finalInterval = resolution * 60;
  }

  try {
    const response = await axios.post(
      endpoint,
      {
        query: TOKEN_DETAILS,
        variables: {
          token: token,
          from: timeFromTv,
          to: timeToTv,
          interval: finalInterval || 1,
          dataset: "realtime",
          walletsToMark
        },
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
    const trades = response.data.data.Solana.ohlcData;
    const creatorTransactions = response.data.data.Solana.creatorTransactions;
    // console.log('trades', trades);
    // console.log('creatorTransactions', creatorTransactions);
    // Preprocess the bars data
    let bars = trades
      ?.filter(trade => {
        const usdOpen = isUsdActive
          ? trade?.open?.PriceInUSD ?? 0
          : (trade?.open?.PriceInUSD ?? 0) / (solPrice || 1);
        const open = isMarketCapActive ? usdOpen * (supply || 1) : usdOpen;

        const usdClose = isUsdActive
          ? trade?.close?.PriceInUSD ?? 0
          : (trade?.close?.PriceInUSD ?? 0) / (solPrice || 1);
        const close = isMarketCapActive ? usdClose * (supply || 1) : usdClose;

        return open !== 0 && close !== 0; // Keep trades where both open and close are non-zero
      })
      .map(trade => {
        const blockTime = new Date(trade.Block.Time).getTime();
        if (isNaN(blockTime)) return null; // Skip invalid dates

        const usdOpen = isUsdActive
          ? trade?.open?.PriceInUSD ?? 0
          : (trade?.open?.PriceInUSD ?? 0) / (solPrice || 1);
        const open = isMarketCapActive ? usdOpen * (supply || 1) : usdOpen;

        const usdClose = isUsdActive
          ? trade?.close?.PriceInUSD ?? 0
          : (trade?.close?.PriceInUSD ?? 0) / (solPrice || 1);
        const close = isMarketCapActive ? usdClose * (supply || 1) : usdClose;

        const usdSolHigh = isUsdActive ? trade?.high ?? 0 : (trade?.high ?? 0) / (solPrice || 1);
        const high = isMarketCapActive ? usdSolHigh * (supply || 1) : usdSolHigh;

        const usdSolLow = isUsdActive ? trade?.low ?? 0 : (trade?.low ?? 0) / (solPrice || 1);
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

    if (creatorTransactions?.length > 0) {
      for (let i = 0; i < creatorTransactions.length; i++) {
        const creatorTransaction = creatorTransactions[i];
        const blockTime = new Date(creatorTransaction?.Block?.Time).getTime() / 1000;
        const isBuy = creatorTransaction?.Trade?.Side?.Type === 'buy';
        const tokenAmount = Number(creatorTransaction?.Trade?.Amount);

        const usdTraded = Number(creatorTransaction?.Trade?.Side?.AmountInUSD);

        const usdPrice = Number(creatorTransaction?.Trade?.PriceInUSD);
        const usdSolPrice = isUsdActive ? usdPrice : usdPrice / solPrice;
        const atPrice = isMarketCapActive ? usdSolPrice * supply : usdSolPrice;

        if (creatorTransaction?.Transaction?.Signer === tokenCreator) {
          await addMark(blockTime, isBuy, usdTraded, atPrice, tokenAmount, isUsdActive, isMarketCapActive, "dev");
        } else if (creatorTransaction?.Transaction?.Signer === userWallet) {
          await addMark(blockTime, isBuy,  usdTraded,atPrice, tokenAmount, isUsdActive, isMarketCapActive, "user");
        }
      }
    }

    if (bars?.length > 0) {
      bars = bars.map((bar, index, arr) => {
      if (index === 0) return bar; // Skip the first bar
      
      const prevBar = arr[index - 1];
      const newOpen = prevBar.close;
      const newClose = bar.close;

      const bodyTop = Math.max(newOpen, newClose);
      const bodyBottom = Math.min(newOpen, newClose);
      const candleSize = Math.abs(newOpen - newClose);

      const maxHigh = bodyTop + candleSize;
      const minLow = bodyBottom - candleSize;
      
      const clampedHigh = Math.min(bar.high, maxHigh);
      const clampedLow = Math.max(bar.low, minLow);
      if (clampedLow <= 0) {
        console.log({
          ...bar,
          newClose,
          newOpen,
          clampedHigh,
          clampedLow,
          bodyTop,
          bodyBottom,
          candleSize,
          maxHigh,
          minLow
        })
      }

      return {
        ...bar,
        open: newOpen,
        close: newClose,
        high: clampedHigh,
        low: clampedLow
        };
      });
    }

    // console.log('remaining bars before filter', bars.length);
    // ✅ Filter out flat or no-activity bars
    if (bars?.length > 0) {
      bars = bars?.filter((bar) => {
        const isPriceChanged = bar.open !== bar.close;
        return isPriceChanged;
      });
    }
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
    // console.log("bars", bars);
    return bars;
  } catch (err) {
    console.error("Error fetching historical data:", err?.message);
    throw err;
  }
}