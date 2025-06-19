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
    aiSignalData: [],
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
            const findIndex = state?.aiSignalData?.findIndex(
              (item) => item?.address == element?.Trade?.Currency?.MintAddress
            );
            if (findIndex >= 0) {
              const existingData = state?.aiSignalData[findIndex];
              const totalTradedValue =
                element?.Trade?.Amount * element?.Trade?.PriceInUSD;
              let buys = 0;
              let sells = 0;
              let liquidity = 0;
              if (element?.Trade?.Side?.Type == "buy") {
                buys = state?.aiSignalData[findIndex]?.buys + 1;
                liquidity = existingData?.liquidity + totalTradedValue;
              } else {
                sells = state?.aiSignalData[findIndex]?.sells + 1;
                liquidity = Math.max(
                  existingData.liquidity - totalTradedValue,
                  0
                );
              }
              const newMKC =
                state.aiSignalData[findIndex].totalsupply *
                element?.Trade?.PriceInUSD;
              const updateAiSignleData = {
                ...existingData,
                ...(programAddress ? { programAddress } : {}),
                current_price: element?.Trade?.PriceInUSD,
                buys: buys,
                sells: sells,
                liquidity: liquidity,
                traded_volume: existingData?.traded_volume + totalTradedValue,
                Percentage: calculatePercentageDifference(
                  newMKC,
                  existingData.marketCap
                ),
                marketCap: newMKC,
              };
              state.aiSignalData[findIndex] = updateAiSignleData;
            }
          }
        }
      }
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

export const { setAiSignalData, setAiSignalLiveDataUpdate } =
  aiSignalSlice.actions;

export default aiSignalSlice.reducer;
