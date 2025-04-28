// "use client";
// import axios from "axios";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// const query = `
//  query pairs($min_count: String, $network: evm_network, $time_10min_ago: DateTime, $time_1h_ago: DateTime, $time_3h_ago: DateTime, $time_ago: DateTime, $eth: String!, $weth: String!, $usdc: String!, $usdt: String!) {
//   EVM(network: $network) {
//     DEXTradeByTokens(
//       where: {Block: {Time: {since: $time_ago}}, any: [{Trade: {Side: {Currency: {SmartContract: {is: $eth}}}}}, {Trade: {Side: {Currency: {SmartContract: {is: $usdt}}}, Currency: {SmartContract: {notIn: [$eth]}}}}, {Trade: {Side: {Currency: {SmartContract: {is: $usdc}}}, Currency: {SmartContract: {notIn: [$eth, $usdt]}}}}, {Trade: {Side: {Currency: {SmartContract: {is: $weth}}}, Currency: {SmartContract: {notIn: [$eth, $usdc, $usdt]}}}}, {Trade: {Side: {Currency: {SmartContract: {notIn: [$usdc, $usdt, $weth, $eth]}}}, Currency: {SmartContract: {notIn: [$usdc, $usdt, $weth, $eth]}}}}]}
//       orderBy: {descendingByField: "usd"}
//       limit: {count: 100}
//     ) {
//       Trade {
//         Currency {
//           Symbol
//           Name
//           SmartContract
//           ProtocolName
//                       Decimals

//         }
//         Side {
//           Currency {
//             Symbol
//             Name
//             SmartContract
//             ProtocolName
//                         Decimals

//           }
//         }
//         price_last: PriceInUSD(maximum: Block_Number)
//         price_10min_ago: PriceInUSD(
//           maximum: Block_Number
//           if: {Block: {Time: {before: $time_10min_ago}}}
//         )
//         price_1h_ago: PriceInUSD(
//           maximum: Block_Number
//           if: {Block: {Time: {before: $time_1h_ago}}}
//         )
//         price_3h_ago: PriceInUSD(
//           maximum: Block_Number
//           if: {Block: {Time: {before: $time_3h_ago}}}
//         )
//       }
//       dexes: uniq(of: Trade_Dex_OwnerAddress)
//       amount: sum(of: Trade_Side_Amount)
//       usd: sum(of: Trade_Side_AmountInUSD)
//       sellers: uniq(of: Trade_Seller)
//       buyers: uniq(of: Trade_Buyer)
//       count(selectWhere: {ge: $min_count})
//     }
//   }
// }

// `;
// export const fetchnewPairBaseData = createAsyncThunk(
//   "fetchnewPairBaseData",
//   async () => {
//     try {
//       const response = await axios.post(
//         "https://streaming.bitquery.io/graphql",
//         {
//           query,
//           variables: {
//             network: "base",
//             time_10min_ago: "2024-11-12T09:31:16Z",
//             time_1h_ago: "2024-11-12T08:41:16Z",
//             time_3h_ago: "2024-11-12T06:41:16Z",
//             time_ago: "2024-11-09T09:41:16Z",
//             usdc: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
//             usdt: "0xfde4c96c8593536e31f229ea8f37b2ada2699bb2",
//             weth: "0x4200000000000000000000000000000000000006",
//             eth: "0x",
//             min_count: "100",
//           },
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "X-API-KEY": process.env.NEXT_PUBLIC_NORMAL_BITQUERY_API,
//           },
//         }
//       );

//       return response.data.data.EVM.DEXTradeByTokens;
//     } catch (err) {
//       throw err;
//     }
//   }
// );

// const allNewPairBaseData = createSlice({
//   name: "allNewPairBaseData",
//   initialState: {
//     Newdata: [],
//     initialLoading: true,
//     refreshLoading: false, // For refreshing data every 6 seconds
//     error: null,
//   },
//   reducers: {
//     addWebSocketData: (state, action) => {
//       state.Newdata = [action.payload, ...state.Newdata];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchnewPairBaseData.pending, (state, action) => {
//         if (state.Newdata.length === 0) {
//           state.initialLoading = true;
//         } else {
//           state.refreshLoading = true;
//         }
//       })
//       .addCase(fetchnewPairBaseData.fulfilled, (state, { payload }) => {
//         state.Newdata = payload;
//         state.initialLoading = false;
//         state.refreshLoading = false;
//       })
//       .addCase(fetchnewPairBaseData.rejected, (state, { error }) => {
//         state.error = error.message;
//         state.initialLoading = false;
//         state.refreshLoading = false;
//       });
//   },
// });

// // Export the new action
// export const { addWebSocketData } = allNewPairBaseData.actions;

// export default allNewPairBaseData.reducer;

"use client";
import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const query = `query LatestCoins {
  EVM(network: base) {
    Calls(
      where: {Call: {Create: true}, Arguments: {length: {ne: 0}}, Receipt: {ContractAddress: {not: "0x0000000000000000000000000000000000000000"}}}
      orderBy: {descending: Block_Time}
    ) {
      Arguments {
        Name
        Value {
          ... on EVM_ABI_Boolean_Value_Arg {
            bool
          }
          ... on EVM_ABI_Bytes_Value_Arg {
            hex
          }
          ... on EVM_ABI_BigInt_Value_Arg {
            bigInteger
          }
          ... on EVM_ABI_Integer_Value_Arg {
            integer
          }
          ... on EVM_ABI_String_Value_Arg {
            string
          }
          ... on EVM_ABI_Address_Value_Arg {
            address
          }
        }
      }
      Transaction {
        Hash
      }
      Receipt {
        ContractAddress
      }
      Block {
        Time
      }
    }
  }
}`;
export const fetchnewPairBaseData = createAsyncThunk(
  "fetchnewPairBaseData",
  async () => {
    try {
      const response = await axios.post(
        "https://streaming.bitquery.io/graphql",{query},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STREAM_BITQUERY_API}`,
          },
        }
      );

      return response?.data?.data?.EVM?.Calls;
    } catch (err) {
      console.log("🚀 ~ fetchnewPairBaseData err:", err?.message)
    }
  }
);

const allNewPairBaseData = createSlice({
  name: "allNewPairBaseData",
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
      .addCase(fetchnewPairBaseData.pending, (state, action) => {
        if (state.Newdata.length === 0) {
          state.initialLoading = true;
        } else {
          state.refreshLoading = true;
        }
      })
      .addCase(fetchnewPairBaseData.fulfilled, (state, { payload }) => {
        state.Newdata = payload;
        state.initialLoading = false;
        state.refreshLoading = false;
      })
      .addCase(fetchnewPairBaseData.rejected, (state, { error }) => {
        state.error = error.message;
        state.initialLoading = false;
        state.refreshLoading = false;
      });
  },
});

// Export the new action
export const { addWebSocketData } = allNewPairBaseData.actions;

export default allNewPairBaseData.reducer;
