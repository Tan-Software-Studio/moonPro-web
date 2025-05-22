const { createSlice } = require("@reduxjs/toolkit");

const solTrendingData = createSlice({
  name: "solTrendingData",
  initialState: {
    filterTime: {
      "1m": {},
      "5m": {},
      "30m": {},
      "1h": {},
      "6h": {},
      "24h": {},
    },
    loading: false,
    filterValues: {
      mintauth: { checked: false },
      freezeauth: { checked: false },
      lpburned: { checked: false },
      top10holders: { checked: false },
      liquidity: { min: "", max: "" },
      volume: { min: "", max: "" },
      age: { min: "", max: "" },
      MKT: { min: "", max: "" },
      TXNS: { min: "", max: "" },
      buys: { min: "", max: "" },
      sells: { min: "", max: "" },
    }
  },

  reducers: {
    setFilterTime: (state, action) => {
      state.filterTime = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFilterValues: (state, action) => {
      state.filterValues = action.payload;
    },
  },
});

export const { setFilterTime, setLoading, setFilterValues } = solTrendingData.actions;

export default solTrendingData.reducer;
