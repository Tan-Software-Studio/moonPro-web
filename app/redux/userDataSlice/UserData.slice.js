import axios from "axios";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const fetchUserData = createAsyncThunk("fetchUserData", async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return 0;
    }
    const res = await axios({
      url: `${process.env.NEXT_PUBLIC_MOONPRO_BASE_URL}user/userDetails`,
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res?.data?.data;
  } catch (error) {
    throw error;
  }
});

const userDataSlice = createSlice({
  name: "userDataSlice ",
  initialState: {
    userDetails: {},
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, { payload }) => {
      console.log("🚀 ~ builder.addCase ~ payload:", payload?.user)
      state.userDetails = payload?.user;
    });
  },
});

export default userDataSlice.reducer;
