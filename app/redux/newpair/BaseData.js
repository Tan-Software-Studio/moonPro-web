

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
