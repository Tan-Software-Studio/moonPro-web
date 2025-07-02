"use client";
import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL = process.env.NEXT_PUBLIC_BASE_URLS;
// Helper function to format large numbers
const formatNumberWithUnits = (num) => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toString();
};

export const fetchnewPairData = createAsyncThunk(
  "fetchnewPairData",
  async () => {
    try {
      const res = await axios.get(`${URL}findAllToken`);
      const records = res?.data?.records;
      return records;
    } catch (err) {
      throw err;
    }
  }
);

const allNewPairData = createSlice({
  name: "allNewPairData",
  initialState: {
    Newdata: [],

    initialLoading: true,
    refreshLoading: false, // For refreshing data every 6 seconds
    error: null,
  },

  reducers: {
    //add new data in newdata and use in newpair solana
    addWebSocketData: (state, action) => {
      // Check if the data already exists based on a unique identifier
      const isDuplicate = state.Newdata.some(
        (item) => item.address === action.payload.address
      );

      if (!isDuplicate) {
        // Add new data at the top
        state.Newdata = [action.payload, ...state.Newdata];

        // Keep only the first 100 items
        if (state.Newdata.length > 100) {
          state.Newdata = state.Newdata.slice(0, 100);
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchnewPairData.pending, (state, action) => {
        if (state.Newdata.length === 0) {
          state.initialLoading = true;
        } else {
          state.refreshLoading = true;
        }
      })
      .addCase(fetchnewPairData.fulfilled, (state, { payload }) => {
        state.initialLoading = false;
        state.refreshLoading = false;
        state.Newdata = payload;
      })
      .addCase(fetchnewPairData.rejected, (state, { error }) => {
        state.error = error.message;
        state.initialLoading = false;
        state.refreshLoading = false;
      });
  },
});

// Export the new action
export const { addWebSocketData } = allNewPairData.actions;

export default allNewPairData.reducer;
