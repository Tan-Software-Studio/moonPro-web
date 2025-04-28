import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const apiSK = process.env.NEXT_PUBLIC_WAVE_SCAN_ADMIN_SK;
const waveScanApiUrl = process.env.NEXT_PUBLIC_WAVE_SCAN_BOT_API_URL;

// ✅ Fetch follows from the database
export const fetchAlphaFollowsData = createAsyncThunk(
  "alphaFollows/fetchAlphaFollowsData",
  async (walletAddress, { rejectWithValue }) => {
    try {
      // console.log("Thunk started - Fetching for wallet (Alpha Follows):", walletAddress);
      const response = await axios.get(`${waveScanApiUrl}/getAlphaFollowing`, {
        params: { 
            securityKey: apiSK, 
            walletAddress 
        },
      });
      return response?.data?.following || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Add a follow to the database
export const addAlphaFollowToDB = createAsyncThunk(
  "alphaFollows/addAlphaFollowToDB",
  async (groupParams, { rejectWithValue }) => {
    const { walletAddress, alphaGroupId, alphaGroupChatType } = groupParams;
    try {
        await axios.post(`${waveScanApiUrl}/saveAlphaFollowing`, {
            securityKey: apiSK,
            walletAddress,
            alphaGroupId, 
            alphaGroupChatType
        });
        toast.success("Followed successfully!", { position: "top-center" });
      return groupParams; // Return the group ID for Redux update
    } catch (err) {
        toast.error("Failed to follow. Please try again.", { position: "top-center" });
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Remove a follow from the database
export const removeAlphaFollowFromDB = createAsyncThunk(
  "alphaFollows/removeAlphaFollowFromDB",
  async (groupParams, { rejectWithValue }) => {
    const { walletAddress, alphaGroupId, alphaGroupChatType } = groupParams;

    try {
      await axios.post(`${waveScanApiUrl}/deleteAlphaFollowing`, {
            securityKey: apiSK,
            walletAddress,
            alphaGroupId, 
            alphaGroupChatType
        });
      toast.success("Unfollowed successfully!", { position: "top-center" });

      return groupParams;
    } catch (err) {
        toast.error("Failed to unfollow. Please try again.", { position: "top-center" });
      return rejectWithValue(err.message);
    }
  }
);

const alphaFollowsSlice = createSlice({
  name: "alphaFollows",
  initialState: {
    alphaFollow: [],
    loading: false,
    error: null,
  },
  reducers: {
    addNewAlphaFollow: (state, action) => {
      state.alphaFollow.unshift(action.payload);
    },
    removeAlphaFollow: (state, action) => {
      state.alphaFollow = state.alphaFollow.filter((follow) => follow._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlphaFollowsData.fulfilled, (state, { payload }) => {
        state.alphaFollow = payload;
      })
      .addCase(addAlphaFollowToDB.rejected, (state, { meta }) => {
        // Rollback UI on failure
        state.alphaFollow = state.alphaFollow.filter((follow) => follow.id !== meta.arg);
      })
      .addCase(removeAlphaFollowFromDB.rejected, (state, { meta }) => {
        // Rollback UI on failure
        state.alphaFollow.push({ id: meta.arg });
      });
  },
});

export const { addNewAlphaFollow, removeAlphaFollow } = alphaFollowsSlice.actions;
export default alphaFollowsSlice.reducer;