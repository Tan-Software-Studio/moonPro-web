import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;
export const fetchPerformanceHistory = createAsyncThunk(
  "fetchPerformanceHistory",
  async (action) => {
    console.log("🚀 ~ action:", action);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}transactions/PNLPerformance/${action}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data?.data?.performance;
    } catch (err) {
      throw err;
    }
  }
);

const performanceData = createSlice({
  name: "performanceData",
  initialState: {
    performance: {},
  },
  reducers: {
    setPerformanceState: (state, action) => {
      state.performance = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPerformanceHistory.fulfilled, (state, { payload }) => {
      state.performance = payload;
    });
  },
});

export const { setPerformanceState } = performanceData.actions;

export default performanceData.reducer;
