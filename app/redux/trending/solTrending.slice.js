import { calculatePercentageDifference } from "@/utils/basicFunctions";

const { createSlice } = require("@reduxjs/toolkit");

const solTrendingData = createSlice({
  name: "solTrendingData",
  initialState: {
    filterTime: {
      "1m": [],
      "5m": [],
      "30m": [],
      "1h": [],
    },
    loading: false,
  },

  reducers: {
    setFilterTime: (state, action) => {
      state.filterTime = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateTrendingData: (state, { payload }) => {
      state.filterTime[payload.time] = payload.data;
    },
    updateTrendingLiveData: (state, { payload }) => {
      if (payload?.length > 0) {
        // console.log("🚀 ~ payload:", payload?.length);
        for (const element of payload) {
          if (element?.Trade?.PriceInUSD) {
            // 1m update from node
            if (state.filterTime["1m"].length > 0) {
              const findIndex = state.filterTime["1m"]?.findIndex(
                (item) => item?.address == element?.Trade?.Currency?.MintAddress
              );
              if (findIndex >= 0) {
                const totalTradedValue =
                  element?.Trade?.Amount * element?.Trade?.PriceInUSD;
                state.filterTime["1m"][findIndex].current_price =
                  element?.Trade?.PriceInUSD;
                if (element?.Trade?.Side?.Type == "buy") {
                  state.filterTime["1m"][findIndex].buys += 1;
                  state.filterTime["1m"][findIndex].liquidity +=
                    totalTradedValue;
                } else {
                  state.filterTime["1m"][findIndex].sells += 1;
                  if (
                    state.filterTime["1m"][findIndex].liquidity -
                      totalTradedValue <=
                    0
                  ) {
                    state.filterTime["1m"][findIndex].liquidity = 0;
                  } else {
                    state.filterTime["1m"][findIndex].liquidity -=
                      totalTradedValue;
                  }
                }
                state.filterTime["1m"][findIndex].traded_volume +=
                  totalTradedValue;
                const newMKC =
                  state.filterTime["1m"][findIndex].totalsupply *
                  element?.Trade?.PriceInUSD;
                state.filterTime["1m"][findIndex].Percentage =
                  calculatePercentageDifference(
                    newMKC,
                    state.filterTime["1m"][findIndex].marketCap
                  );
                state.filterTime["1m"][findIndex].marketCap = newMKC;
              }
            }
            // 5m update from node
            if (state.filterTime["5m"].length > 0) {
              const findIndex = state.filterTime["5m"]?.findIndex(
                (item) => item?.address == element?.Trade?.Currency?.MintAddress
              );
              if (findIndex >= 0) {
                const totalTradedValue =
                  element?.Trade?.Amount * element?.Trade?.PriceInUSD;
                state.filterTime["5m"][findIndex].current_price =
                  element?.Trade?.PriceInUSD;
                if (element?.Trade?.Side?.Type == "buy") {
                  state.filterTime["5m"][findIndex].buys += 1;
                  state.filterTime["5m"][findIndex].liquidity +=
                    totalTradedValue;
                } else {
                  state.filterTime["5m"][findIndex].sells += 1;
                  if (
                    state.filterTime["5m"][findIndex].liquidity -
                      totalTradedValue <=
                    0
                  ) {
                    state.filterTime["5m"][findIndex].liquidity = 0;
                  } else {
                    state.filterTime["5m"][findIndex].liquidity -=
                      totalTradedValue;
                  }
                }
                state.filterTime["5m"][findIndex].traded_volume +=
                  totalTradedValue;
                const newMKC =
                  state.filterTime["5m"][findIndex].totalsupply *
                  element?.Trade?.PriceInUSD;
                state.filterTime["5m"][findIndex].Percentage =
                  calculatePercentageDifference(
                    newMKC,
                    state.filterTime["5m"][findIndex].marketCap
                  );
                state.filterTime["5m"][findIndex].marketCap = newMKC;
              }
            }
            // 30m update from node
            if (state.filterTime["30m"].length > 0) {
              const findIndex = state.filterTime["30m"]?.findIndex(
                (item) => item?.address == element?.Trade?.Currency?.MintAddress
              );
              if (findIndex >= 0) {
                const totalTradedValue =
                  element?.Trade?.Amount * element?.Trade?.PriceInUSD;
                state.filterTime["30m"][findIndex].current_price =
                  element?.Trade?.PriceInUSD;
                if (element?.Trade?.Side?.Type == "buy") {
                  state.filterTime["30m"][findIndex].buys += 1;
                  state.filterTime["30m"][findIndex].liquidity +=
                    totalTradedValue;
                } else {
                  state.filterTime["30m"][findIndex].sells += 1;
                  if (
                    state.filterTime["30m"][findIndex].liquidity -
                      totalTradedValue <=
                    0
                  ) {
                    state.filterTime["30m"][findIndex].liquidity = 0;
                  } else {
                    state.filterTime["30m"][findIndex].liquidity -=
                      totalTradedValue;
                  }
                }
                state.filterTime["30m"][findIndex].traded_volume +=
                  totalTradedValue;
                const newMKC =
                  state.filterTime["30m"][findIndex].totalsupply *
                  element?.Trade?.PriceInUSD;
                state.filterTime["30m"][findIndex].Percentage =
                  calculatePercentageDifference(
                    newMKC,
                    state.filterTime["30m"][findIndex].marketCap
                  );
                state.filterTime["30m"][findIndex].marketCap = newMKC;
              }
            }
            // 1h update from node
            if (state.filterTime["1h"].length > 0) {
              const findIndex = state.filterTime["1h"]?.findIndex(
                (item) => item?.address == element?.Trade?.Currency?.MintAddress
              );
              if (findIndex >= 0) {
                const totalTradedValue =
                  element?.Trade?.Amount * element?.Trade?.PriceInUSD;
                state.filterTime["1h"][findIndex].current_price =
                  element?.Trade?.PriceInUSD;
                if (element?.Trade?.Side?.Type == "buy") {
                  state.filterTime["1h"][findIndex].buys += 1;
                  state.filterTime["1h"][findIndex].liquidity +=
                    totalTradedValue;
                } else {
                  state.filterTime["1h"][findIndex].sells += 1;
                  if (
                    state.filterTime["1h"][findIndex].liquidity -
                      totalTradedValue <=
                    0
                  ) {
                    state.filterTime["1h"][findIndex].liquidity = 0;
                  } else {
                    state.filterTime["1h"][findIndex].liquidity -=
                      totalTradedValue;
                  }
                }
                state.filterTime["1h"][findIndex].traded_volume +=
                  totalTradedValue;
                const newMKC =
                  state.filterTime["1h"][findIndex].totalsupply *
                  element?.Trade?.PriceInUSD;
                state.filterTime["1h"][findIndex].Percentage =
                  calculatePercentageDifference(
                    newMKC,
                    state.filterTime["1h"][findIndex].marketCap
                  );
                state.filterTime["1h"][findIndex].marketCap = newMKC;
              }
            }
          }
        }
      }
    },
  },
});

export const {
  setFilterTime,
  setLoading,
  updateTrendingData,
  updateTrendingLiveData,
} = solTrendingData.actions;

export default solTrendingData.reducer;
