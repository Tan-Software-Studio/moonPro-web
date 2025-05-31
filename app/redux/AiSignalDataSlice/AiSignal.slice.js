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
            const findIndex = state?.aiSignalData?.findIndex(
              (item) => item?.address == element?.Trade?.Currency?.MintAddress
            );
            if (findIndex >= 0) {
              state.aiSignalData[findIndex].current_price =
                element?.Trade?.PriceInUSD;
              if (element?.Trade?.Side?.Type == "buy") {
                state.aiSignalData[findIndex].buys += 1;
                state.aiSignalData[findIndex].liquidity +=
                  element?.Trade?.AmountInUSD;
              } else {
                state.aiSignalData[findIndex].sells += 1;
                state.aiSignalData[findIndex].liquidity -=
                  element?.Trade?.AmountInUSD;
              }
              state.aiSignalData[findIndex].traded_volume +=
                element?.Trade?.AmountInUSD;
              const newMKC =
                state.aiSignalData[findIndex].totalsupply *
                element?.Trade?.PriceInUSD;
              state.aiSignalData[findIndex].Percentage =
                calculatePercentageDifference(
                  newMKC,
                  state.aiSignalData[findIndex].marketCap
                );
              state.aiSignalData[findIndex].marketCap = newMKC;
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
