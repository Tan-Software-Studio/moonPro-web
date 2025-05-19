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
  },

  reducers: {
    setFilterTime: (state, action) => {
      state.filterTime = action.payload;
    },
    updateTrendingData: (state, action) => {
      state.filterTime[action.payload.time] = action.payload.data;
    },
  },
});

export const { setFilterTime, updateTrendingData } = solTrendingData.actions;

export default solTrendingData.reducer;
