"use client";
import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL = process.env.NEXT_PUBLIC_BASE_URLS;
// Helper function to format large numbers

export const fetchMemescopeData = createAsyncThunk(
  "fetchMemescopeData",
  async () => {
    try {
      const res = await axios.get(`${URL}wavePro/users/findmemescopeData`);
      return res?.data?.data;
    } catch (err) {
      throw err;
    }
  }
);

const allMemescopeData = createSlice({
  name: "allMemescopeData",
  initialState: {
    MscopeGraduateData: [],
    MscopeGraduatedData: [],
    newLaunch: [],
    isChart: true,
    initialLoading: true,
    refreshLoading: false, // For refreshing data every 6 seconds
    error: null,
  },

  reducers: {
    // set is chart hide or not
    setMemescopeChart: (state, { payload }) => {
      localStorage.setItem("isChart", !state.isChart);
      state.isChart = !state.isChart;
    },
    setIsChartByDefault: (state, { payload }) => {
      const isChartLocal = localStorage.getItem("isChart");
      if (isChartLocal === null) {
        state.isChart = true;
        localStorage.setItem("isChart", "true");
      } else {
        state.isChart = isChartLocal === "true";
      }
    },
    //add new token on mscopedata and use in gratuate in memescope page
    addMScopeGraduateSocketData: (state, action) => {
      // Check if the data already exists based on a unique identifier
      const isDuplicate = state.MscopeGraduateData.some(
        (item) => item.address === action.payload.address
      );

      if (!isDuplicate) {
        // Add new data at the top
        state.MscopeGraduateData = [
          action.payload,
          ...state.MscopeGraduateData,
        ];

        // Keep only the first 100 items
        if (state.MscopeGraduateData.length > 20) {
          state.MscopeGraduateData = state.MscopeGraduateData.slice(0, 20);
        }
      }
    },

    //add new token on mscopedata and use in gratuated in memescope page
    addMScopeGraduatedSocketData: (state, action) => {
      // Check if the data already exists based on a unique identifier
      const isDuplicate = state.MscopeGraduatedData.some(
        (item) => item.address === action.payload.address
      );

      if (!isDuplicate) {
        // Add new data at the top
        state.MscopeGraduatedData = [
          action.payload,
          ...state.MscopeGraduatedData,
        ];

        // Keep only the first 100 items
        if (state.MscopeGraduatedData.length > 20) {
          state.MscopeGraduatedData = state.MscopeGraduatedData.slice(0, 20);
        }
      }
    },
    setMemeScopeGraduateData: (state, action) => {
      state.MscopeGraduateData = action.payload;
    },
    setMemeScopeGraduatedData: (state, action) => {
      state.MscopeGraduatedData = action.payload;
    },
    setNewLaunchData: (state, action) => {
      state.newLaunch = Object.fromEntries(
        Object.entries({ ...action.payload, ...state.newLaunch }).slice(0, 30)
      );
    },
    updateAllDataByNode: (state, { payload }) => {
      if (payload?.length > 0) {
        for (const element of payload) {
          if (element?.Trade?.PriceInUSD) {
            const mint = element?.Trade?.Currency?.MintAddress;
            const priceUSD = element?.Trade?.PriceInUSD;
            const amount = element?.Trade?.Amount;
            const volumeDelta = priceUSD * amount;
            const programAddress = element?.Trade?.Dex?.ProgramAddress;
            // new launch
            const newLaunchFind = state?.newLaunch?.[mint];
            if (newLaunchFind) {
              const updateNewLanuchData = {
                ...newLaunchFind,
                current_price: priceUSD,
                volume: newLaunchFind?.volume + volumeDelta,
                MKC: (newLaunchFind?.totalsupply || 0) * priceUSD,
              };
              state.newLaunch[mint] = updateNewLanuchData;
            }
            // about to graduated
            const GraduateData = state?.MscopeGraduateData?.[mint];
            if (GraduateData) {
              const updateGraduateData = {
                ...GraduateData,
                current_price: priceUSD,
                volume: GraduateData?.volume + volumeDelta,
                MKC: (GraduateData?.totalsupply || 0) * priceUSD,
              };
              state.MscopeGraduateData[mint] = updateGraduateData;
              if (
                programAddress != "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
              ) {
                GraduateData.programAddress = programAddress;
                const findIndex = state?.MscopeGraduateData?.findIndex(
                  (item) => item?.address == mint
                );
                if (findIndex > 0) {
                  state?.MscopeGraduateData?.splice(findIndex, 1);
                  state?.MscopeGraduatedData?.unshift(updateGraduateData);
                }
              }
            }
            // graduated
            const GraduatedData = state?.MscopeGraduatedData?.[mint];
            if (GraduatedData) {
              const updateGraduatedData = {
                ...GraduatedData,
                current_price: priceUSD,
                volume: GraduatedData?.volume + volumeDelta,
                MKC: (GraduatedData?.totalsupply || 0) * priceUSD,
              };
              state.MscopeGraduatedData[mint] = updateGraduatedData;
            }
          }
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchMemescopeData.fulfilled, (state, { payload }) => {
        state.initialLoading = false;
        state.refreshLoading = false;
        state.MscopeGraduateData = payload?.graduate;
        state.MscopeGraduatedData = payload?.graduated;
        state.newLaunch = payload?.newLaunch;
      })
      .addCase(fetchMemescopeData.rejected, (state, { error }) => {
        state.error = error.message;
        state.initialLoading = false;
        state.refreshLoading = false;
      });
  },
});

// Export the new action
export const {
  addMScopeGraduateSocketData,
  addMScopeGraduatedSocketData,
  setMemeScopeGraduateData,
  setMemeScopeGraduatedData,
  setNewLaunchData,
  updateAllDataByNode,
  setMemescopeChart,
  setIsChartByDefault,
} = allMemescopeData.actions;

export default allMemescopeData.reducer;
