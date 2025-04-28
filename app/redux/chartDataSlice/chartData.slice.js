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
          }
          AmountInUSD
          Amount
        }
        Currency {
          MintAddress
          Name
          Symbol
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
const allCharTokenData = createSlice({
  name: "allCharTokenData",
  initialState: {
    latestTrades: [],
    tradesForWalletTracking: [],
  },
  reducers: {
    addNewTransaction: (state, action) => {
      state.latestTrades.unshift(action.payload);
      state.latestTrades = state.latestTrades.slice(0, 50);
    },
    addNewTransactionForWalletTracking: (state, action) => {
      state.tradesForWalletTracking.unshift(...action.payload);
      state.tradesForWalletTracking = state.tradesForWalletTracking.slice(0, 20);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTradesData.fulfilled, (state, { payload }) => {
      state.latestTrades = payload;
    });
  },
});
export const { addNewTransaction, addNewTransactionForWalletTracking } = allCharTokenData.actions;
export default allCharTokenData.reducer;
