"use client";
import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import SolQuery from "@/components/common/NewPair/SolQuery";

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
    initialLoading: true,
    refreshLoading: false, // For refreshing data every 6 seconds
    error: null,
  },

  reducers: {
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
      const temp = state.newLaunch.slice(0, 30);
      state.newLaunch = [action.payload, ...temp];
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
} = allMemescopeData.actions;

export default allMemescopeData.reducer;
