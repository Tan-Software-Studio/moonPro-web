const { createSlice } = require("@reduxjs/toolkit");

const solTrendingData = createSlice({
  name: "solTrendingData",
  initialState: {
    solanaTrendingData: [],
  },

  reducers: {
    addSolTrendingData: (state, action) => {
      state.solanaTrendingData = action.payload;
    },
  },
});

export const { addSolTrendingData } = solTrendingData.actions;

export default solTrendingData.reducer;
