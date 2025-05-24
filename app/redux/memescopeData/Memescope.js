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
    updateAllDataByNode: (state, { payload }) => {
      // console.log(payload);
      if (
        state.newLaunch.length > 0 &&
        state.MscopeGraduateData.length > 0 &&
        state.MscopeGraduatedData.length
      ) {
        // new launch
        const findTokenFromNewLaunch = state?.newLaunch?.findIndex(
          (item) => item?.address == payload?.mint
        );
        if (findTokenFromNewLaunch >= 0) {
          state.newLaunch[findTokenFromNewLaunch].volume +=
            payload?.price * payload?.amount;
          state.newLaunch[findTokenFromNewLaunch].MKC =
            state.newLaunch[findTokenFromNewLaunch].supply * payload?.price;
          if (payload.holderAction == "add") {
            state.newLaunch[findTokenFromNewLaunch].holders += 1;
          } else if (payload.holderAction == "remove") {
            if (state.newLaunch[findTokenFromNewLaunch].holders > 0) {
              state.newLaunch[findTokenFromNewLaunch].holders -= 1;
            }
          }
        }
        // about to graduate
        const findTokenFromGraduate = state?.MscopeGraduateData?.findIndex(
          (item) => item?.address == payload?.mint
        );
        if (findTokenFromGraduate >= 0) {
          state.MscopeGraduateData[findTokenFromGraduate].volume +=
            payload?.price * payload?.amount;
          state.MscopeGraduateData[findTokenFromGraduate].MKC =
            state.MscopeGraduateData[findTokenFromGraduate].totalsupply *
            payload?.price;
          if (payload.holderAction == "add") {
            state.MscopeGraduateData[findTokenFromGraduate].holders += 1;
          } else if (payload.holderAction == "remove") {
            if (state.MscopeGraduateData[findTokenFromGraduate].holders) {
              state.MscopeGraduateData[findTokenFromGraduate].holders -= 1;
            }
          }
        }

        // graduated
        const findTokenFromGraduated = state?.MscopeGraduatedData?.findIndex(
          (item) => item?.address == payload?.mint
        );

        if (findTokenFromGraduated >= 0) {
          state.MscopeGraduatedData[findTokenFromGraduated].volume +=
            payload?.price * payload?.amount;
          state.MscopeGraduatedData[findTokenFromGraduated].MKC =
            state.MscopeGraduatedData[findTokenFromGraduated].totalsupply *
            payload?.price;
          if (payload.holderAction == "add") {
            state.MscopeGraduatedData[findTokenFromGraduated].holders += 1;
          } else if (payload.holderAction == "remove") {
            if (state.MscopeGraduatedData[findTokenFromGraduated].holders) {
              state.MscopeGraduatedData[findTokenFromGraduated].holders -= 1;
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
} = allMemescopeData.actions;

export default allMemescopeData.reducer;
