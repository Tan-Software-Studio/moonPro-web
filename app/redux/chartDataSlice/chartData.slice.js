import axiosInstance from "@/components/axiosIntance/axiosInstance";
import axios from "axios";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
export const fetchTradesData = createAsyncThunk(
  "fetchTradesData",
  async (tokenCA) => {
    try {
      const date = await new Date();
      const currentTime = await date.toISOString();
      const response = await axios.post(
        "https://streaming.bitquery.io/eap",
        {
          query: `query LatestTrades($token: String, $time_ago: DateTime) {
  Solana {
    DEXTradeByTokens(
      orderBy: {descending: Block_Time}
      limit: {count: 50}
      where: {Trade: {Currency: {MintAddress: {is: $token}}}, Block: {Time: {before: $time_ago}}, Transaction: {Result: {Success: true}}}
    ) {
      Block {
        Time: Time
      }
      Transaction {
        Signer
        Signature
      }
      Trade {
        Market {
          MarketAddress
        }
        Dex {
          ProtocolName
          ProtocolFamily
        }
        AmountInUSD
        PriceInUSD
        Amount
        Side {
          Type
          Currency {
            Symbol
            MintAddress
            Name
            Decimals
          }
          AmountInUSD
          Amount
        }
        Currency {
          MintAddress
          Name
          Symbol
          Decimals
        }
      }
    }
  }
}`,
          variables: {
            token: tokenCA,
            time_ago: currentTime,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STREAM_BITQUERY_API}`,
          },
        }
      );
      return response?.data?.data?.Solana?.DEXTradeByTokens || [];
    } catch (err) {
      console.log("🚀 ~ err:", err?.message);
    }
  }
);
export const fetchChartAllData = createAsyncThunk(
  "fetchChartAllData",
  async ({ tokenaddress, pairAddress, setDataLoaderForChart }) => {
    try {
      const response = await axiosInstance.post("combineData", {
        address: tokenaddress,
        pair: pairAddress || null,
      });
      setDataLoaderForChart(false);
      const tokenData = response?.data?.data;
      localStorage.setItem("currentPairAddress", tokenData?.pairaddress);
      localStorage.setItem("chartSupply", tokenData?.rawsupply || 0);
      localStorage.setItem("solPrice", tokenData?.solPrice || 0);
      localStorage.setItem("chartTokenCreator", tokenData?.tokenCreator || 0);
      return tokenData;
    } catch (error) {
      console.log("🚀 ~ chartTokenDataAPI ~ err:", error?.message);
    }
  }
);
const allCharTokenData = createSlice({
  name: "allCharTokenData",
  initialState: {
    latestTrades: [],
    tradesForWalletTracking: [],
    chartData: {},
  },
  reducers: {
    addNewTransaction: (state, { payload }) => {
      for (const item of payload) {
        const newVolume = item.Trade.Amount * item?.Trade?.PriceInUSD;
        if (item?.Trade?.Side?.Type == "buy") {
          state.chartData.buys_5min += 1;
          state.chartData.buys_1h += 1;
          state.chartData.buys_6h += 1;
          state.chartData.buys_24h += 1;
          state.chartData.buy_volume_5min += Number(newVolume);
          state.chartData.buy_volume_1h += Number(newVolume);
          state.chartData.buy_volume_6h += Number(newVolume);
          state.chartData.buy_volume_24h += Number(newVolume);
        } else {
          state.chartData.sells_5min += 1;
          state.chartData.sells_1h += 1;
          state.chartData.sells_6h += 1;
          state.chartData.sells_24h += 1;
          state.chartData.sell_volume_5min += Number(newVolume);
          state.chartData.sell_volume_1h += Number(newVolume);
          state.chartData.sell_volume_6h += Number(newVolume);
          state.chartData.sell_volume_24h += Number(newVolume);
        }
      }
      state.latestTrades.unshift(...payload);
      state.latestTrades = state.latestTrades.slice(0, 50);
    },
    addNewTransactionForWalletTracking: (state, action) => {
      state.tradesForWalletTracking.unshift(...action.payload);
      state.tradesForWalletTracking = state.tradesForWalletTracking.slice(
        0,
        20
      );
    },
    resetChartTokenState: (state, action) => {
      state.latestTrades = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTradesData.fulfilled, (state, { payload }) => {
        state.latestTrades = payload;
      })
      .addCase(fetchChartAllData.fulfilled, (state, { payload }) => {
        state.chartData = payload;
      });
  },
});
export const {
  addNewTransaction,
  addNewTransactionForWalletTracking,
  resetChartTokenState,
} = allCharTokenData.actions;
export default allCharTokenData.reducer;
