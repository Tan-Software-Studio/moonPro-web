const { createSlice } = require("@reduxjs/toolkit");

const solTrendingData = createSlice({
  name: "solTrendingData",
  initialState: {
    filterTime: {
      "1m": [],
      "5m": [],
      "30m": [],
      "1h": [],
      "6h": [],
      "24h": [],
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
  },
});

export const { setFilterTime, setLoading, updateTrendingData } =
  solTrendingData.actions;

export default solTrendingData.reducer;
