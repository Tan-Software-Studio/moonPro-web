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
  name: "userDataSlice",
  initialState: {
    userDetails: {},
    walletBalances: [],
    isLoadingBalances: false,
    balancesError: null,
  },
  reducers: {
    makeUserEmptyOnLogout: (state) => {
      state.userDetails = {};
    },
    addNewGeneratedWallet: (state, { payload }) => {
      state?.userDetails?.walletAddressSOL.push(payload);
    },
    clearWalletBalances: (state) => {
      if (state.userDetails && state.userDetails.walletAddressSOL) {
        state.userDetails.walletAddressSOL = state.userDetails.walletAddressSOL.map((wallet) => ({
          ...wallet,
          balance: undefined,
        }));
      }
    },
    setWalletBalances: (state, action) => {
      state.isLoadingBalances = false;
      state.balancesError = null;

      if (state.userDetails && state.userDetails.walletAddressSOL && action.payload) {
        const balancesByWallet = action.payload.reduce((acc, item) => {
          const walletAddress = item.BalanceUpdate?.Account?.Owner;

          if (walletAddress) {
            acc[walletAddress] = {
              balance: Number(item.BalanceUpdate?.Balance),
              currency: item.BalanceUpdate?.Currency,
            };
          }
          return acc;
        }, {});

        state.userDetails.walletAddressSOL = state.userDetails.walletAddressSOL.map((wallet) => {
          const walletBalance = balancesByWallet[wallet.wallet];
          return {
            ...wallet,
            balance: walletBalance?.balance || 0,
            currency: walletBalance?.currency || null,
          };
        });
      }
    },
    setBalancesLoading: (state, action) => {
      state.isLoadingBalances = action.payload;
    },
    setBalancesError: (state, action) => {
      state.isLoadingBalances = false;
      state.balancesError = action.payload;
    },
    updateWalletToPrimary: (state, { payload }) => {
      const setOldPrimaryToFalse = state.userDetails.walletAddressSOL?.findIndex((item) => item?.primary);
      if (setOldPrimaryToFalse >= 0) {
        state.userDetails.walletAddressSOL[setOldPrimaryToFalse].primary = false;
      }
      const setNewPrimaryToFalse = state.userDetails.walletAddressSOL?.findIndex((item) => item?.wallet == payload);
      if (setNewPrimaryToFalse >= 0) {
        state.userDetails.walletAddressSOL[setNewPrimaryToFalse].primary = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, { payload }) => {
      state.userDetails = payload?.user;
    });
  },
});

export const {
  makeUserEmptyOnLogout,
  clearWalletBalances,
  setWalletBalances,
  setBalancesLoading,
  setBalancesError,
  updateWalletToPrimary,
  addNewGeneratedWallet,
} = userDataSlice.actions;
export default userDataSlice.reducer;
