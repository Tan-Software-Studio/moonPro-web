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
export const fetchRemovedLiquidity = createAsyncThunk(
  "fetchRemovedLiquidity",
  async (tokenCA) => {
    try {
      const response = await axios.post(
        "https://streaming.bitquery.io/eap",
        {
          query: `query removeLiq($token: String){
  Solana {
    DEXPools(
      where: {Instruction: {Program: {Method: {is: "decreaseLiquidity"}}, Accounts: {includes: {Token: {Mint: {is: $token}}}}}}
      orderBy: {descending: Block_Time}
      limit: {count: 10}
    ) {
      Block {
        Time
      }
      Pool {
        Market {
          MarketAddress
          BaseCurrency {
            MintAddress
            Symbol
            Name
          }
          QuoteCurrency {
            MintAddress
            Symbol
            Name
          }
        }
        Dex {
          ProtocolFamily
          ProtocolName
          ProgramAddress
        }
        Base {
          ChangeAmount
          PostAmount
        }
        Quote {
          ChangeAmount
          PostAmount
          PriceInUSD
          PostAmountInUSD
        }
      }
      Transaction {
        Signature
      }
    }
  }
}`,
          variables: { token: tokenCA },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STREAM_BITQUERY_API}`,
          },
        }
      );
      return response?.data?.data?.Solana?.DEXPools || [];
    } catch (error) {
      console.error("🚀 ~ fetchRemovedLiquidity error:", error?.message);
      return []; // Return empty array on error to keep state predictable
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
    activeChartToken: {},
    removedLiquidity: [],
  },
  reducers: {
    resetChartDataState: (state, action) => {
      state.chartData = {};
    },
    setActiveChartToken: (state, { payload }) => {
      state.activeChartToken = {
        symbol: payload?.symbol,
        img: payload?.img,
        pairAddress: payload?.pairAddress || null,
      };
    },
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
    addRemovedLiquidity: (state, { payload }) => {
      state.removedLiquidity.unshift(...payload);
      state.removedLiquidity = state.removedLiquidity.slice(0, 50);
    },
    resetRemovedLiquidity: (state) => {
      state.removedLiquidity = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTradesData.fulfilled, (state, { payload }) => {
        state.latestTrades = payload;
      })
      .addCase(fetchChartAllData.fulfilled, (state, { payload }) => {
        state.chartData = payload;
        if (
          state.activeChartToken?.symbol == "..." ||
          !state.activeChartToken?.symbol
        ) {
          state.activeChartToken = {
            symbol: payload?.symbol || "Token",
            img: payload?.img || null,
            pairAddress: payload?.pairaddress || null,
          };
        }
      })
      .addCase(fetchRemovedLiquidity.fulfilled, (state, { payload }) => {
        state.removedLiquidity = payload;
      });
  },
});
export const {
  addNewTransaction,
  addNewTransactionForWalletTracking,
  resetChartTokenState,
  resetChartDataState,
  setActiveChartToken,
  addRemovedLiquidity,
  resetRemovedLiquidity, 
} = allCharTokenData.actions;
export default allCharTokenData.reducer;
