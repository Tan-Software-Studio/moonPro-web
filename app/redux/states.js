const { createSlice } = require("@reduxjs/toolkit");

const AllStatesData = createSlice({
  name: "AllStatesData",
  initialState: {
    user: {},
    walletAddress: "",
    isSearchPopup: false,
    bigLoader: false,
    isEnabled: false,
    clickedWalletScan: {},
    globalBuyAmt: 0.1,
    chartSymbolImage: null,
    favouriteTokens: [],
    solWalletAddress: null,
    jwtToken: null
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
    setSolWalletAddress: (state, action) => {
      const wallet = localStorage.getItem("walletAddress")
      const token = localStorage.getItem("token")
      state.solWalletAddress = wallet ? wallet : null
      state.jwtToken = token ? token : null
    }
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
  setUserInfo,
  setSolWalletAddress
} = AllStatesData.actions;
