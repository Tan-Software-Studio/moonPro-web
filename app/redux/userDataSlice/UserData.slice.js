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
    activeSolanaWallet: {},
    isLoadingBalances: false,
    balancesError: null,
  },
  reducers: {
    makeUserEmptyOnLogout: (state) => {
      state.userDetails = {};
    },
    updateUserReferralId: (state, { payload }) => {
      state.userDetails.referralId = payload;
      state.userDetails.referralEdit = true;
    },
    addNewGeneratedWallet: (state, { payload }) => {
      state?.userDetails?.walletAddressSOL.push(payload);
    },
    resetActiveWalletAddress: (state, { payload }) => {
      state.activeSolanaWallet = {};
    },

    clearWalletBalances: (state) => {
      if (state.userDetails && state.userDetails.walletAddressSOL) {
        state.userDetails.walletAddressSOL =
          state.userDetails.walletAddressSOL.map((wallet) => ({
            ...wallet,
            balance: undefined,
          }));
      }
    },
    setWalletBalances: (state, action) => {
      state.isLoadingBalances = false;
      state.balancesError = null;

      if (
        state.userDetails &&
        state.userDetails.walletAddressSOL &&
        action.payload
      ) {
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

        state.userDetails.walletAddressSOL =
          state.userDetails.walletAddressSOL.map((wallet) => {
            const walletBalance = balancesByWallet[wallet.wallet];
            return {
              ...wallet,
              balance: walletBalance?.balance || 0,
              currency: walletBalance?.currency || null,
            };
          });
      }
      const findPrimaryWallet = state.userDetails.walletAddressSOL?.find(
        (item) => item?.primary
      );
      if (findPrimaryWallet) {
        state.activeSolanaWallet = findPrimaryWallet;
      }
    },
    updateWalletAddressesBalanceLive: (state, { payload }) => {
      if (state?.userDetails?.walletAddressSOL?.length > 0) {
        for (const element of state?.userDetails?.walletAddressSOL) {
          const isWallet = payload[element?.wallet];
          if (isWallet) {
            state.userDetails.walletAddressSOL[element?.index].balance = Number(
              isWallet?.BalanceUpdate?.PostBalance
            );
            if (state.userDetails.walletAddressSOL[element?.index].primary) {
              state.activeSolanaWallet =
                state.userDetails.walletAddressSOL[element?.index];
            }
          }
        }
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
      const setOldPrimaryToFalse =
        state.userDetails.walletAddressSOL?.findIndex((item) => item?.primary);
      if (setOldPrimaryToFalse >= 0) {
        state.userDetails.walletAddressSOL[
          setOldPrimaryToFalse
        ].primary = false;
      }
      const setNewPrimaryToFalse =
        state.userDetails.walletAddressSOL?.findIndex(
          (item) => item?.wallet == payload
        );
      if (setNewPrimaryToFalse >= 0) {
        state.userDetails.walletAddressSOL[setNewPrimaryToFalse].primary = true;
        state.activeSolanaWallet =
          state.userDetails.walletAddressSOL[setNewPrimaryToFalse];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, { payload }) => {
      state.userDetails = payload?.user;
      const findPrimaryWallet = state.userDetails.walletAddressSOL?.find(
        (item) => item?.primary
      );
      if (findPrimaryWallet) {
        state.activeSolanaWallet = findPrimaryWallet;
      }
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
  updateUserReferralId,
  updateWalletAddressesBalanceLive,
  resetActiveWalletAddress,
} = userDataSlice.actions;
export default userDataSlice.reducer;
