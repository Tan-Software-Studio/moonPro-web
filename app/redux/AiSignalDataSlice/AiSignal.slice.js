import { calculatePercentageDifference } from "@/utils/basicFunctions";
import axios from "axios";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

export const fetchAiSignalData = createAsyncThunk(
  "fetchAiSignalData",
  async () => {
    try {
      const res = await axios.get(`${baseUrl}aiSignal/aiSignalTokens`);
      return res?.data?.data?.aiSignleTokens;
    } catch (err) {
      throw err;
    }
  }
);

const aiSignalSlice = createSlice({
  name: "aiSignalSlice",
  initialState: {
    aiSignalData: {},
    initialLoading: true,
  },
  reducers: {
    setAiSignalData: (state, { payload }) => {
      state.aiSignalData = payload;
    },
    setAiSignalLiveDataUpdate: (state, { payload }) => {
      if (payload?.length > 0 && state.aiSignalData?.length > 0) {
        for (const element of payload) {
          if (element?.Trade?.PriceInUSD) {
            const programAddress = element?.Trade?.Dex?.ProgramAddress;
            if (state?.aiSignalData?.[element?.Trade?.Currency?.MintAddress]) {
              const existingData =
                state?.aiSignalData[element?.Trade?.Currency?.MintAddress];
              const totalTradedValue =
                element?.Trade?.Amount * element?.Trade?.PriceInUSD;
              const newMKC =
                existingData?.totalsupply * element?.Trade?.PriceInUSD;
              const updateAiSignleData = {
                ...existingData,
                ...(programAddress ? { programAddress } : {}),
                current_price: element?.Trade?.PriceInUSD,
                traded_volume: existingData?.traded_volume + totalTradedValue,
                Percentage: calculatePercentageDifference(
                  newMKC,
                  existingData.marketCap
                ),
                marketCap: newMKC,
              };
              if (element?.Trade?.Side?.Type == "buy") {
                updateAiSignleData.buys++;
                updateAiSignleData.liquidity =
                  existingData?.liquidity + totalTradedValue;
              } else {
                updateAiSignleData.sells++;
                updateAiSignleData.liquidity = Math.max(
                  existingData.liquidity - totalTradedValue,
                  0
                );
              }
              state.aiSignalData[element?.Trade?.Currency?.MintAddress] =
                updateAiSignleData;
            }
          }
        }
      }
    },
    updateAiSignalTokenRedis: (state, { payload }) => {
      try {
        for (const element of payload) {
          if (state.aiSignalData[element?.token?.address]) {
            state.aiSignalData[element?.token?.address] = element?.token;
          }
        }
      } catch (error) {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAiSignalData.fulfilled, (state, { payload }) => {
        state.aiSignalData = payload;
        state.initialLoading = false;
      })
      .addCase(fetchAiSignalData.rejected, (state) => {
        state.initialLoading = false;
      });
  },
});

export const {
  setAiSignalData,
  setAiSignalLiveDataUpdate,
  updateAiSignalTokenRedis,
} = aiSignalSlice.actions;

export default aiSignalSlice.reducer;
