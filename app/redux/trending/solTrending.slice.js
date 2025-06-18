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
              token1m.current_price = price;
              if (element?.Trade?.Side?.Type == "buy") {
                token1m.buys += 1;
                token1m.liquidity += totalTradedValue;
              } else {
                token1m.sells += 1;
                if (token1m.liquidity - totalTradedValue <= 0) {
                  token1m.liquidity = 0;
                } else {
                  token1m.liquidity -= totalTradedValue;
                }
              }
              token1m.traded_volume += totalTradedValue;
              const newMKC = token1m?.totalsupply * price;
              token1m.Percentage = calculatePercentageDifference(
                newMKC,
                token1m?.marketCap
              );
              token1m.marketCap = newMKC;
              if (programAddress) {
                token1m.programAddress = programAddress;
              }
            }
            // 5m update from node
            const token5m = state?.filterTime["5m"]?.[mint];
            if (token5m) {
              token5m.current_price = price;
              if (element?.Trade?.Side?.Type == "buy") {
                token5m.buys += 1;
                token5m.liquidity += totalTradedValue;
              } else {
                token5m.sells += 1;
                if (token5m.liquidity - totalTradedValue <= 0) {
                  token5m.liquidity = 0;
                } else {
                  token5m.liquidity -= totalTradedValue;
                }
              }
              token5m.traded_volume += totalTradedValue;
              const newMKC = token5m?.totalsupply * price;
              token5m.Percentage = calculatePercentageDifference(
                newMKC,
                token5m?.marketCap
              );
              token5m.marketCap = newMKC;
              if (programAddress) {
                token5m.programAddress = programAddress;
              }
            }
            // 30m update from node
            const token30m = state?.filterTime["30m"]?.[mint];
            if (token30m) {
              token30m.current_price = price;
              if (element?.Trade?.Side?.Type == "buy") {
                token30m.buys += 1;
                token30m.liquidity += totalTradedValue;
              } else {
                token30m.sells += 1;
                if (token30m.liquidity - totalTradedValue <= 0) {
                  token30m.liquidity = 0;
                } else {
                  token30m.liquidity -= totalTradedValue;
                }
              }
              token30m.traded_volume += totalTradedValue;
              const newMKC = token30m?.totalsupply * price;
              token30m.Percentage = calculatePercentageDifference(
                newMKC,
                token30m?.marketCap
              );
              token30m.marketCap = newMKC;
              if (programAddress) {
                token30m.programAddress = programAddress;
              }
            }
            // 1h update from node
            const token1h = state?.filterTime["1h"]?.[mint];
            if (token1h) {
              token1h.current_price = price;
              if (element?.Trade?.Side?.Type == "buy") {
                token1h.buys += 1;
                token1h.liquidity += totalTradedValue;
              } else {
                token1h.sells += 1;
                if (token1h.liquidity - totalTradedValue <= 0) {
                  token1h.liquidity = 0;
                } else {
                  token1h.liquidity -= totalTradedValue;
                }
              }
              token1h.traded_volume += totalTradedValue;
              const newMKC = token1h?.totalsupply * price;
              token1h.Percentage = calculatePercentageDifference(
                newMKC,
                token1h?.marketCap
              );
              token1h.marketCap = newMKC;
              if (programAddress) {
                token1h.programAddress = programAddress;
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
