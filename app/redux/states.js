const { createSlice } = require("@reduxjs/toolkit");

const AllStatesData = createSlice({
  name: "AllStatesData",
  initialState: {
    user:{},
    walletAddress: "",
    isSearchPopup: false,
    bigLoader: false,
    isEnabled: false,
    clickedWalletScan: {},
    globalBuyAmt: 0.1,
    chartSymbolImage: null,
    favouriteTokens: [],
  },
  reducers: {
    setWalletAddress: (state, action) => {
      state.walletAddress = action?.payload;
    },
    setIsSearchPopup: (state, action) => {
      state.isSearchPopup = action?.payload;
    },
    setBigLoader: (state, action) => {
      state.bigLoader = action?.payload;
    },
    setIsEnabled: (state, action) => {
      state.isEnabled = action?.payload;
    },
    setClickedWalletScan: (state, action) => {
      state.clickedWalletScan = action?.payload;
    },
    setGlobalBuyAmt: (state, action) => {
      state.globalBuyAmt = action?.payload;
      localStorage.setItem("copyBuySol", action?.payload);
    },
    setChartSymbolImage: (state, action) => {
      state.chartSymbolImage = action?.payload;
    },
    setFavouriteTokens: (state, action) => {
      state.favouriteTokens = action?.payload;
    },
    setUserInfo: (state, action) => {
      console.log("🚀 ~ action:", action?.payload)
      state.user = action?.payload;
    },
  },
});

export default AllStatesData.reducer;
export const {
  setWalletAddress,
  setIsSearchPopup,
  setBigLoader,
  setIsEnabled,
  setClickedWalletScan,
  setGlobalBuyAmt,
  setChartSymbolImage,
  setFavouriteTokens,
  setUserInfo
} = AllStatesData.actions;
