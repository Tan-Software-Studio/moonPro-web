import axios from "axios";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const apiSK = process.env.NEXT_PUBLIC_WAVE_SCAN_ADMIN_SK;

// Async thunk to fetch AlphaPicks notifications
export const fetchAlphaPicksNotificationData = createAsyncThunk(
    "fetchAlphaPicksNotificationData",
    async (walletAddress) => {
      try {
        // console.log("Thunk started - Fetching for wallet (Alpha Calls Notification):", walletAddress);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_WAVE_SCAN_BOT_API_URL}/getAlphaNotifications`, {
          params: {
            "securityKey": apiSK,
            "walletAddress": walletAddress,
          },
        });
        return response?.data?.notifications || [];
      } catch (err) {
        console.log("Thunk error:", err?.message);
        throw err; // Add this to trigger rejected state
      }
    }
  );

// Redux slice for AlphaPicks notifications
const alphaPicksNotificationData = createSlice({
  name: "alphaPicksNotificationData",
  initialState: {
    alphaPicksNotification: [],
  },
  reducers: {
    addNewAlphaPickNotification: (state, action) => {
      state.alphaPicksNotification.unshift(action.payload);
      state.alphaPicksNotification = state.alphaPicksNotification.slice(0, 20);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAlphaPicksNotificationData.fulfilled, (state, { payload }) => {
      state.alphaPicksNotification = payload;
    });
  },
});

// Export actions and reducer
export const { addNewAlphaPickNotification } = alphaPicksNotificationData.actions;
export default alphaPicksNotificationData.reducer;
