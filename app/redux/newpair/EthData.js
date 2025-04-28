"use client";
import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const query = `
  
  query pairs($min_count: String, $network: evm_network, $time_10min_ago: DateTime, $time_1h_ago: DateTime, $time_3h_ago: DateTime, $time_ago: DateTime, $eth: String!, $weth: String!, $usdc: String!, $usdt: String!) {
  EVM(network: $network) {
    DEXTradeByTokens(
      where: {Block: {Time: {since: $time_ago}}, any: [{Trade: {Side: {Currency: {SmartContract: {is: $eth}}}}}, {Trade: {Side: {Currency: {SmartContract: {is: $usdt}}}, Currency: {SmartContract: {notIn: [$eth]}}}}, {Trade: {Side: {Currency: {SmartContract: {is: $usdc}}}, Currency: {SmartContract: {notIn: [$eth, $usdt]}}}}, {Trade: {Side: {Currency: {SmartContract: {is: $weth}}}, Currency: {SmartContract: {notIn: [$eth, $usdc, $usdt]}}}}, {Trade: {Side: {Currency: {SmartContract: {notIn: [$usdc, $usdt, $weth, $eth]}}}, Currency: {SmartContract: {notIn: [$usdc, $usdt, $weth, $eth]}}}}]}
      orderBy: {descendingByField: "usd"}
      limit: {count: 100}
    ) {
      Trade {
        Currency {
          Symbol
          Name
          SmartContract
          ProtocolName
                      Decimals

        }
        Side {
          Currency {
            Symbol
            Name
            SmartContract
            ProtocolName
                        Decimals

          }
        }
        price_last: PriceInUSD(maximum: Block_Number)
        price_10min_ago: PriceInUSD(
          maximum: Block_Number
          if: {Block: {Time: {before: $time_10min_ago}}}
        )
        price_1h_ago: PriceInUSD(
          maximum: Block_Number
          if: {Block: {Time: {before: $time_1h_ago}}}
        )
        price_3h_ago: PriceInUSD(
          maximum: Block_Number
          if: {Block: {Time: {before: $time_3h_ago}}}
        )
      }
      dexes: uniq(of: Trade_Dex_OwnerAddress)
      amount: sum(of: Trade_Side_Amount)
      usd: sum(of: Trade_Side_AmountInUSD)
      sellers: uniq(of: Trade_Seller)
      buyers: uniq(of: Trade_Buyer)
      count(selectWhere: {ge: $min_count})
    }
  }
}

`;
export const fetchnewPairEthData = createAsyncThunk(
  "fetchnewPairEthData",
  async () => {
    try {
      const response = await axios.post(
        "https://streaming.bitquery.io/graphql",
        {
          query,
          variables: {
            network: "eth",
            time_10min_ago: "2024-11-12T08:41:46Z",
            time_1h_ago: "2024-11-12T07:51:46Z",
            time_3h_ago: "2024-11-12T05:51:46Z",
            time_ago: "2024-11-09T08:51:46Z",
            usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            usdt: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            weth: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            eth: "0x",
            min_count: "100",
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STREAM_BITQUERY_API}`
          },
        }
      );

      return response.data.data.EVM.DEXTradeByTokens;
    } catch (err) {
      throw err;
    }
  }
);

const allNewPairEthData = createSlice({
  name: "allNewPairEthData",
  initialState: {
    Newdata: [],
    initialLoading: true,
    refreshLoading: false, // For refreshing data every 6 seconds
    error: null,
  },
  reducers: {
    addWebSocketData: (state, action) => {
      state.Newdata = [action.payload, ...state.Newdata];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchnewPairEthData.pending, (state, action) => {
        if (state.Newdata.length === 0) {
          state.initialLoading = true;
        } else {
          state.refreshLoading = true;
        }
      })
      .addCase(fetchnewPairEthData.fulfilled, (state, { payload }) => {
        state.Newdata = payload;
        state.initialLoading = false;
        state.refreshLoading = false;
      })
      .addCase(fetchnewPairEthData.rejected, (state, { error }) => {
        state.error = error.message;
        state.initialLoading = false;
        state.refreshLoading = false;
      });
  },
});

// Export the new action
export const { addWebSocketData } = allNewPairEthData.actions;

export default allNewPairEthData.reducer;
