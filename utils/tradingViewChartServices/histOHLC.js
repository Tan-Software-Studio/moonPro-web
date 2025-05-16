import axios from "axios";
import { bq_apikey } from "./constant";

const endpoint = "https://streaming.bitquery.io/eap";
const TOKEN_DETAILS = `query TradingView($token: String, $dataset: dataset_arg_enum,$from: DateTime, $to: DateTime, $interval: Int) {
  Solana(dataset: $dataset, aggregates: no) {
    DEXTradeByTokens(
      orderBy: {ascendingByField: "Block_Time"}
      where: {Trade: {Currency: {MintAddress: {is: $token}}, Side: {Currency: {MintAddress: {in: ["11111111111111111111111111111111", "So11111111111111111111111111111111111111112", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"]}}}}, Block: {Time: {since: $from, till: $to}}, Transaction: {Result: {Success: true}}}
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
      volume: sum(of: Trade_Side_AmountInUSD)
    }
  }
}`;

export async function fetchHistoricalData(periodParams, resolution, token) {
  console.log("🚀 ~ fetchHistoricalData ~ resolution:", resolution);
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
    const trades = response.data.data.Solana.DEXTradeByTokens;
    console.log("🚀 ~ fetchHistoricalData ~ trades:", trades?.length);

    // Preprocess the bars data
    let bars = trades?.map((trade) => {
      // Parse and convert Block Timefield to Unix timestamp in milliseconds
      const blockTime = new Date(trade.Block.Time).getTime();

      return {
        time: blockTime,
        open: trade?.open?.PriceInUSD || 0,
        high: trade?.high || 0,
        low: trade?.low || 0,
        close: trade?.close?.PriceInUSD || 0,
        volume: Number(trade?.volume) || 0,
      };
    });

    // If resolution is in seconds, adjust candlestick data by comparing open/close
    if (resolution?.toString()?.slice(-1) == "S") {
      bars = bars.map((bar, index, arr) => {
        if (index === 0) return bar; // First bar remains unchanged

        const prevBar = arr[index - 1];
        let newOpen = bar.open;
        let newClose = bar.close;

        // Compare previous close with current open to simulate candlestick movement
        if (prevBar.close > bar.open) {
          // Bearish: open at previous close, adjust close if needed
          newOpen = prevBar.close;
          newClose = bar.close < prevBar.close ? bar.close : prevBar.close;
        } else if (prevBar.close < bar.open) {
          // Bullish: open at previous close, adjust close if needed
          newOpen = prevBar.close;
          newClose = bar.close > prevBar.close ? bar.close : prevBar.close;
        }

        return {
          ...bar,
          open: newOpen,
          close: newClose,
          high: Math.max(newOpen, newClose, bar.high),
          low: Math.min(newOpen, newClose, bar.low),
        };
      });
    }

    // console.log('remaining bars before filter', bars.length);
    // ✅ Filter out flat or no-activity bars
    bars = bars.filter((bar) => {
      const isPriceChanged = bar.open !== bar.close;
      return isPriceChanged;
    });
    // console.log('remaining bars after filter', bars.length);

    // Handle missing bars
    if (bars.length < requiredBars) {
      const earliestTime = bars[0]?.time;
      const missingBarsCount = requiredBars - bars.length;

      // Generate missing bars before the earliest returned bar
      for (let i = 1; i <= missingBarsCount; i++) {
        bars.unshift({
          time: earliestTime - i * 60000, // Assuming 1-minute bars (60000 ms)
          open: 0,
          high: 0,
          low: 0,
          close: 0,
          volume: 0,
        });
      }
    }

    // Remove duplicates and sort
    bars = await Array.from(
      new Map(bars.map((bar) => [bar.time, bar])).values()
    );
    await bars.sort((a, b) => a.time - b.time);
    // console.log("bars", bars);
    return bars;
  } catch (err) {
    console.error("Error fetching historical data:", err?.message);
    throw err;
  }
}