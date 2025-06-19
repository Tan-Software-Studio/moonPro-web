import { calculatePercentageDifference } from "@/utils/basicFunctions";

const { createSlice } = require("@reduxjs/toolkit");

const solTrendingData = createSlice({
  name: "solTrendingData",
  initialState: {
    filterTime: {
      "1m": {},
      "5m": {},
      "30m": {},
      "1h": {},
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
            const mint = element?.Trade?.Currency?.MintAddress;
            const amount = element?.Trade?.Amount;
            const price = element?.Trade?.PriceInUSD;
            const totalTradedValue = amount * price;
            const programAddress = element?.Trade?.Dex?.ProgramAddress;
            // 1m update from node
            const token1m = state?.filterTime["1m"]?.[mint];
            if (token1m) {
              const newMKC = token1m?.totalsupply * price;
              const updateToken1m = {
                ...token1m,
                current_price: price,
                traded_volume: token1m?.traded_volume + totalTradedValue,
                Percentage: calculatePercentageDifference(
                  newMKC,
                  token1m?.marketCap
                ),
                marketCap: newMKC,
              };
              if (element?.Trade?.Side?.Type == "buy") {
                updateToken1m.buys++;
                updateToken1m.liquidity = token1m?.liquidity + totalTradedValue;
              } else {
                updateToken1m.sells++;
                updateToken1m.liquidity = Math.max(
                  token1m?.liquidity - totalTradedValue,
                  0
                );
              }

              state.filterTime["1m"][mint] = updateToken1m;
            }
            // 5m update from node
            const token5m = state?.filterTime["5m"]?.[mint];
            if (token5m) {
              const newMKC = token5m?.totalsupply * price;
              const updateToken5m = {
                ...token5m,
                current_price: price,
                traded_volume: token5m?.traded_volume + totalTradedValue,
                Percentage: calculatePercentageDifference(
                  newMKC,
                  token5m?.marketCap
                ),
                marketCap: newMKC,
              };
              if (element?.Trade?.Side?.Type == "buy") {
                updateToken5m.buys++;
                updateToken5m.liquidity = token5m?.liquidity + totalTradedValue;
              } else {
                updateToken5m.sells++;
                updateToken5m.liquidity = Math.max(
                  token5m?.liquidity - totalTradedValue,
                  0
                );
              }
              state.filterTime["5m"][mint] = updateToken5m;
            }
            // 30m update from node
            const token30m = state?.filterTime["30m"]?.[mint];
            if (token30m) {
              const newMKC = token30m?.totalsupply * price;
              const updateToken30m = {
                ...token30m,
                current_price: price,
                traded_volume: token30m?.traded_volume + totalTradedValue,
                Percentage: calculatePercentageDifference(
                  newMKC,
                  token30m?.marketCap
                ),
                marketCap: newMKC,
              };
              if (element?.Trade?.Side?.Type == "buy") {
                updateToken30m.buys++;
                updateToken30m.liquidity =
                  token30m?.liquidity + totalTradedValue;
              } else {
                updateToken30m.sells++;
                updateToken30m.liquidity = Math.max(
                  token30m?.liquidity - totalTradedValue,
                  0
                );
              }
              state.filterTime["30m"][mint] = updateToken30m;
            }
            // 1h update from node
            const token1h = state?.filterTime["1h"]?.[mint];
            if (token1h) {
              const newMKC = token1h?.totalsupply * price;
              const updateToken1h = {
                ...token1h,
                current_price: price,
                traded_volume: token1h?.traded_volume + totalTradedValue,
                Percentage: calculatePercentageDifference(
                  newMKC,
                  token1h?.marketCap
                ),
                marketCap: newMKC,
              };
              if (element?.Trade?.Side?.Type == "buy") {
                updateToken1h.buys++;
                updateToken1h.liquidity = token1h?.liquidity + totalTradedValue;
              } else {
                updateToken1h.sells++;
                updateToken1h.liquidity = Math.max(
                  token1h?.liquidity - totalTradedValue,
                  0
                );
              }
              state.filterTime["1h"][mint] = updateToken1h;
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
