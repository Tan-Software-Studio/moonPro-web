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
      // 1m update from node
      if (state.filterTime["1m"].length > 0) {
        const findTokenFrom1m = state.filterTime["1m"]?.findIndex(
          (item) => item?.address == payload?.mint
        );
        if (findTokenFrom1m > 0) {
          const totalTradeValue = payload?.price * payload?.amount;
          state.filterTime["1m"][findTokenFrom1m].current_price = payload.price;
          if (payload.type == "buy") {
            state.filterTime["1m"][findTokenFrom1m].buys += 1;
            state.filterTime["1m"][findTokenFrom1m].liquidity +=
              totalTradeValue;
          } else {
            state.filterTime["1m"][findTokenFrom1m].sells += 1;
            const totalLQD = (state.filterTime["1m"][
              findTokenFrom1m
            ].liquidity -= totalTradeValue);
            if (totalLQD < 0) {
              state.filterTime["1m"][findTokenFrom1m].liquidity = 0;
            } else {
              state.filterTime["1m"][findTokenFrom1m].liquidity = totalLQD;
            }
          }
          state.filterTime["1m"][findTokenFrom1m].traded_volume +=
            totalTradeValue;
          const newMKC =
            state.filterTime["1m"][findTokenFrom1m].totalsupply *
            payload?.price;
          state.filterTime["1m"][findTokenFrom1m].Percentage =
            calculatePercentageDifference(
              newMKC,
              state.filterTime["1m"][findTokenFrom1m].marketCap
            );
          state.filterTime["1m"][findTokenFrom1m].marketCap = newMKC;
        }
      }
      // 5m update from node
      if (state.filterTime["5m"].length > 0) {
        const findTokenFrom5m = state.filterTime["5m"]?.findIndex(
          (item) => item?.address == payload?.mint
        );
        if (findTokenFrom5m > 0) {
          const totalTradeValue = payload?.price * payload?.amount;
          state.filterTime["1m"][findTokenFrom5m].current_price = payload.price;
          if (payload.type == "buy") {
            state.filterTime["5m"][findTokenFrom5m].buys += 1;
            state.filterTime["5m"][findTokenFrom5m].liquidity +=
              totalTradeValue;
          } else {
            state.filterTime["5m"][findTokenFrom5m].sells += 1;
            const totalLQD = (state.filterTime["5m"][
              findTokenFrom5m
            ].liquidity -= totalTradeValue);
            if (totalLQD < 0) {
              state.filterTime["5m"][findTokenFrom5m].liquidity = 0;
            } else {
              state.filterTime["5m"][findTokenFrom5m].liquidity = totalLQD;
            }
          }
          state.filterTime["5m"][findTokenFrom5m].traded_volume +=
            totalTradeValue;
          const newMKC =
            state.filterTime["5m"][findTokenFrom5m].totalsupply *
            payload?.price;
          state.filterTime["5m"][findTokenFrom5m].Percentage =
            calculatePercentageDifference(
              newMKC,
              state.filterTime["5m"][findTokenFrom5m].marketCap
            );
          state.filterTime["5m"][findTokenFrom5m].marketCap = newMKC;
        }
      }
      // 30m update from node
      if (state.filterTime["30m"].length > 0) {
        const findTokenFrom30m = state.filterTime["30m"]?.findIndex(
          (item) => item?.address == payload?.mint
        );
        if (findTokenFrom30m > 0) {
          const totalTradeValue = payload?.price * payload?.amount;
          state.filterTime["30m"][findTokenFrom30m].current_price =
            payload.price;
          if (payload.type == "buy") {
            state.filterTime["30m"][findTokenFrom30m].buys += 1;
            state.filterTime["30m"][findTokenFrom30m].liquidity +=
              totalTradeValue;
          } else {
            state.filterTime["30m"][findTokenFrom30m].sells += 1;
            const totalLQD = (state.filterTime["30m"][
              findTokenFrom30m
            ].liquidity -= totalTradeValue);
            if (totalLQD < 0) {
              state.filterTime["30m"][findTokenFrom30m].liquidity = 0;
            } else {
              state.filterTime["30m"][findTokenFrom30m].liquidity = totalLQD;
            }
          }
          state.filterTime["30m"][findTokenFrom30m].traded_volume +=
            totalTradeValue;
          const newMKC =
            state.filterTime["30m"][findTokenFrom30m].totalsupply *
            payload?.price;
          state.filterTime["30m"][findTokenFrom30m].Percentage =
            calculatePercentageDifference(
              newMKC,
              state.filterTime["30m"][findTokenFrom30m].marketCap
            );
          state.filterTime["30m"][findTokenFrom30m].marketCap = newMKC;
        }
      }
      // 1h update from node
      if (state.filterTime["1h"].length > 0) {
        const findTokenFrom1h = state.filterTime["1h"]?.findIndex(
          (item) => item?.address == payload?.mint
        );
        if (findTokenFrom1h > 0) {
          const totalTradeValue = payload?.price * payload?.amount;
          state.filterTime["1h"][findTokenFrom1h].current_price = payload.price;
          if (payload.type == "buy") {
            state.filterTime["1h"][findTokenFrom1h].buys += 1;
            state.filterTime["1h"][findTokenFrom1h].liquidity +=
              totalTradeValue;
          } else {
            state.filterTime["1h"][findTokenFrom1h].sells += 1;
            const totalLQD = (state.filterTime["1h"][
              findTokenFrom1h
            ].liquidity -= totalTradeValue);
            if (totalLQD < 0) {
              state.filterTime["1h"][findTokenFrom1h].liquidity = 0;
            } else {
              state.filterTime["1h"][findTokenFrom1h].liquidity = totalLQD;
            }
          }
          state.filterTime["1h"][findTokenFrom1h].traded_volume +=
            totalTradeValue;
          const newMKC =
            state.filterTime["1h"][findTokenFrom1h].totalsupply *
            payload?.price;
          state.filterTime["1h"][findTokenFrom1h].Percentage =
            calculatePercentageDifference(
              newMKC,
              state.filterTime["1h"][findTokenFrom1h].marketCap
            );
          state.filterTime["1h"][findTokenFrom1h].marketCap = newMKC;
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
