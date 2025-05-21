import axios from "axios";
import { bq_apikey } from "./constant";
import { addMark } from "./mark";

const endpoint = "https://streaming.bitquery.io/eap";
const TOKEN_DETAILS = `query TradingView($token: String, $dataset: dataset_arg_enum, $from: DateTime, $to: DateTime, $interval: Int, $tokenCreator: String) {
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
      low: quantile(of: Trade_PriceInUSD, level: 0.05)
      high: quantile(of: Trade_PriceInUSD, level: 0.95)
      close: Trade {
        PriceInUSD(maximum: Block_Slot)
      }
      open: Trade {
        PriceInUSD(minimum: Block_Slot)
      }
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
          Signer: {is: $tokenCreator}
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
        Side {
          Type
        }
      }
    }

  }
}`;

export async function fetchHistoricalData(periodParams, resolution, token, isUsdActive, isMarketCapActive, supply, solPrice, tokenCreator) {
  console.log("🚀 ~ fetchHistoricalData ~ resolution:", resolution);
  supply = supply ? Number(supply) === 0 ? 1_000_000_000 : Number(supply) : 1_000_000_000;
  solPrice = solPrice ? Number(solPrice) === 0 ? 1 : Number(solPrice) : 1; 
  const { from, to, countBack } = periodParams;
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
          tokenCreator
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
    console.log('trades', trades);
    console.log('creatorTransactions', creatorTransactions);
    // Preprocess the bars data
    let bars = trades?.map((trade) => {
      // Parse and convert Block Timefield to Unix timestamp in milliseconds
      const blockTime = new Date(trade.Block.Time).getTime();
      
      const usdOpen = isUsdActive ? trade?.open?.PriceInUSD : trade?.open?.PriceInUSD / solPrice;
      const open = isMarketCapActive ? usdOpen * supply : usdOpen;

      const usdClose = isUsdActive ? trade?.close?.PriceInUSD : trade?.close?.PriceInUSD / solPrice;
      const close = isMarketCapActive ? usdClose * supply : usdClose;

      const usdSolHigh = isUsdActive ? trade?.high : trade?.high / solPrice;
      const high = isMarketCapActive ? usdSolHigh * supply : usdSolHigh;

      const usdSolLow = isUsdActive ? trade?.low : trade?.low / solPrice;
      const low = isMarketCapActive ? usdSolLow * supply: usdSolLow;

      return {
        time: blockTime,
        open,
        high,
        low,
        close,
        volume: Number(trade?.volume) || 0,
      };
    });

    if (creatorTransactions?.length > 0) {
      for (let i = 0; i < creatorTransactions.length; i++) {
        const creatorTransaction = creatorTransactions[i];
        const blockTime = new Date(creatorTransaction?.Block?.Time).getTime() / 1000;
        const isBuy = creatorTransaction?.Trade?.Side?.Type === 'buy';
        addMark(
          i, 
          blockTime, 
          isBuy
        );
      }
    }

    // If resolution is in seconds, adjust candlestick data by comparing open/close
    if (resolution?.toString()?.slice(-1) == "S") {
      if (bars?.length > 0) {
        bars = bars.map((bar, index, arr) => {
        if (index === 0) return bar; // Skip the first bar
  
        const prevBar = arr[index - 1];
        const newOpen = prevBar.close;
        const newClose = bar.close;
  
        return {
          ...bar,
          open: newOpen,
          close: newClose,
          high: Math.max(newOpen, newClose, bar.high, prevBar.close),
          low: Math.min(newOpen, newClose, bar.low, prevBar.close),
          };
        });
      }
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