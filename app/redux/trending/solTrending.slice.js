const { createSlice } = require("@reduxjs/toolkit");

const solTrendingData = createSlice({
  name: "solTrendingData",
  initialState: {
    filterTime: {
      "1m": {},
      "5m": {},
      "1h": {},
      "6h": {},
      "24h": {},
    },
    filterInput:
    {
      "By Volume": {},
      "By Liquidity": {},
      "By Age": {},
      "By MKT Cap": {},
      "By TXNS": {},
      "By Buys": {},
      "By Sales": {},
    },
  },

  reducers: {
    setFilterTime: (state, action) => {
      state.filterTime = action.payload;
    },
    setFilterInput: (state, action) => {
      state.filterInput = action.payload;
    },
  },
});

export const { setFilterTime, setFilterInput } = solTrendingData.actions;

export default solTrendingData.reducer;
