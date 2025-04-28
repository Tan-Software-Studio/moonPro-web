import axios from "axios";
import { bq_apikey } from "./constant";

const endpoint = "https://streaming.bitquery.io/eap";
const TOKEN_DETAILS = `query ($token: String, $dataset: dataset_arg_enum, $time_ago: DateTime, $interval: Int) {
  Solana(dataset: $dataset) {
    DEXTradeByTokens(
      orderBy: {ascendingByField: "Block_Time"}
      where: {Trade: {Currency: {MintAddress: {is: $token}}, Side: {Currency: {MintAddress: {in: ["11111111111111111111111111111111", "So11111111111111111111111111111111111111112", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"]}}}}, Block: {Time: {after: $time_ago}}, Transaction: {Result: {Success: true}}}
    ) {
      Block {
        Time(interval: {count: $interval, in: minutes})
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
  const { from, to, countBack } = periodParams;
  // console.log("🚀 ~ fetchHistoricalData ~ countBack:", countBack);
  const requiredBars = 20000;
  const timeFromTv = new Date(from * 1000).toISOString();
  // console.log("🚀 ~ fetchHistoricalData ~ timeFromTv:", timeFromTv);
  const finalInterval = resolution == "1D" ? 1440 : Number(resolution);
  try {
    const response = await axios.post(
      endpoint,
      {
        query: TOKEN_DETAILS,
        variables: {
          token: token,
          time_ago: timeFromTv,
          interval: finalInterval || 1,
          dataset: "combined",
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
        volume: trade?.volume || 0,
      };
    });
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
    bars = await Array.from(
      new Map(bars.map((bar) => [bar.time, bar])).values()
    );
    await bars.sort((a, b) => a.time - b.time);
    return bars;
  } catch (err) {
    console.error("Error fetching historical data:", err?.message);
    throw err;
  }
}
