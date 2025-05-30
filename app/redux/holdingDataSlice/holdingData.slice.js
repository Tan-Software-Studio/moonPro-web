import axios from "axios";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

export const fetchPNLData = createAsyncThunk(
  "PnlData",
  async (solWalletAddress) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${baseUrl}transactions/PNLSolana/${solWalletAddress}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res?.data?.data?.pnl;
    } catch (err) {
      throw err;
    }
  }
);

const holdingData = createSlice({
  name: "PnlData",
  initialState: {
    PnlData: [],
    initialLoading: false,
    isDataLoaded: false,
    hasAttemptedLoad: false,
    error: null,
    pnlTableData: "profile",
  },
  reducers: {
    setPnlData: (state, { payload }) => {
      state.PnlData = payload;
    },
    updatePnlTableData: (state, { payload }) => {
      state.pnlTableData = payload;
    },
    updatePnlDataPriceOnly: (state, { payload }) => {
      if (state.PnlData?.length > 0) {
        if (payload?.length > 0) {
          for (const element of payload) {
            const findTokenIndex = state?.PnlData?.findIndex(
              (item) => item?.token == element?.Trade?.Currency?.MintAddress
            );
            if (findTokenIndex >= 0) {
              if (element?.Trade?.PriceInUSD) {
                state.PnlData[findTokenIndex].current_price =
                  element?.Trade?.PriceInUSD;
              }
            }
          }
        }
      }
    },
    resetPnlDataState: (state) => {
      state.initialLoading = false;
      state.isDataLoaded = false;
      state.hasAttemptedLoad = false; // Reset this too
      state.PnlData = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPNLData.pending, (state) => {
        state.initialLoading = true;
        state.isDataLoaded = false;
        state.hasAttemptedLoad = true; 
        state.error = null;
      })
      .addCase(fetchPNLData.fulfilled, (state, { payload }) => {
        state.initialLoading = false;
        state.isDataLoaded = true;
        state.hasAttemptedLoad = true;
        state.PnlData = payload || [];
        state.error = null;
      })
      .addCase(fetchPNLData.rejected, (state, { payload }) => {
        state.initialLoading = false;
        state.isDataLoaded = true;
        state.hasAttemptedLoad = true;
        state.PnlData = [];
        state.error = payload;
      });
  },
});

export const { setPnlData, updatePnlDataPriceOnly, updatePnlTableData, resetPnlDataState  } =
  holdingData.actions;

export default holdingData.reducer;
