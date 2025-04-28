import { solana } from "../Images";

const { createSlice } = require("@reduxjs/toolkit");
let chainroute = "Solana";
let pageName;

if (typeof window !== "undefined") {
  const pathname = window.location.pathname;
  chainroute = pathname.split("/")[2];
}

let initialState = {
  borderColor: "border-[#26262e]",
  border: "border-[#8671D9]",
  isSidebarOpen: false,
  isLargeScreen: true,
  isSmallScreen: false,
  hasTableScroll: false,
  selectToken:
    pageName == "memescope" || "trending"
      ? "solana"
      : chainroute == "solana"
        ? "Solana"
        : chainroute == "base"
          ? "Base"
          : "Ethereum",
  selectTokenLogo: solana,
  tokenPopup: false,
  filterTime: "24h",
  quickBuy: 0.1,
  clickTitle: "",
  ascending: false,
  decending: false,
};

const AllthemeColorData = createSlice({
  name: "AllthemeColorData",
  initialState,
  reducers: {
    setBorderColor: (state, action) => {
      state.borderColor = action?.payload;
    },
    setBorder: (state, action) => {
      state.border = action?.payload;
    },
    setIsSidebarOpen: (state, action) => {
      state.isSidebarOpen = action?.payload;
    },
    setIsLargeScreen: (state, action) => {
      state.isLargeScreen = action?.payload;
    },
    setIsSmallScreen: (state, action) => {
      state.isSmallScreen = action?.payload;
    },
    setTableScroll: (state, action) => {
      state.hasTableScroll = action?.payload;
    },
    setselectToken: (state, action) => {
      state.selectToken = action?.payload;
    },
    setselectTokenLogo: (state, action) => {
      state.selectTokenLogo = action?.payload;
    },
    setTokenPopup: (state, action) => {
      state.tokenPopup = action?.payload;
    },
    setFilterTime: (state, action) => {
      state.filterTime = action?.payload;
    },
    setQuickBuy: (state, action) => {
      state.quickBuy = action?.payload;
    },
    setAscending: (state, action) => {
      state.ascending = action?.payload;
    },
    setDecending: (state, action) => {
      state.decending = action?.payload;
    },
    setClickTitle: (state, action) => {
      state.clickTitle = action?.payload;
    },
  },
});

export default AllthemeColorData.reducer;
export const {
  setBorderColor,
  setIsSidebarOpen,
  setIsLargeScreen,
  setTableScroll,
  setBorder,
  setselectToken,
  setTokenPopup,
  setselectTokenLogo,
  setFilterTime,
  setQuickBuy,
  setIsSmallScreen,
  setAscending,
  setDecending,
  setClickTitle,
} = AllthemeColorData.actions;
