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
      state.userDetails = payload?.user;
    });
  },
});

export default userDataSlice.reducer;

// import axios from "axios";
// import { getSolanaBalanceAndPrice } from "@/utils/solanaNativeBalance";

// const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

// const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

// // Batch processing with progress tracking
// const batchWithDelay = async (items, batchSize, delayMs, processFn, onProgress) => {
//   const results = [];
//   let completedCount = 0;

//   for (let i = 0; i < items.length; i += batchSize) {
//     const batch = items.slice(i, i + batchSize);
//     const batchResults = await Promise.allSettled(batch.map(processFn));

//     results.push(
//       ...batchResults.map((result, index) => ({
//         ...batch[index],
//         balance: result.status === "fulfilled" ? result.value : batch[index].balance || 0,
//         error: result.status === "rejected" ? result.reason?.message || "Failed to fetch balance" : null,
//       }))
//     );

//     completedCount += batch.length;
//     const progress = Math.round((completedCount / items.length) * 100);

//     if (onProgress) {
//       onProgress(progress);
//     }

//     if (i + batchSize < items.length) {
//       await new Promise((resolve) => setTimeout(resolve, delayMs));
//     }
//   }
//   return results;
// };

// // Fetch user data thunk
// export const fetchUserData = createAsyncThunk("userData/fetchUserData", async (_, { rejectWithValue, dispatch }) => {
//   const jwtToken = localStorage.getItem("token");
//   if (!jwtToken) {
//     return rejectWithValue("No authentication token");
//   }

//   try {
//     const response = await axios.get(`${baseUrl}user/getAllWallets`, {
//       headers: { Authorization: `Bearer ${jwtToken}` },
//     });

//     const userData = response?.data?.data;

//     // Auto-fetch balances after getting user data
//     const wallets = userData?.wallets?.walletAddressSOL;
//     if (wallets?.length) {
//       // Don't await this - let it run in background
//       setTimeout(() => {
//         dispatch(fetchAllWalletBalances(wallets));
//       }, 100);
//     }

//     return userData;
//   } catch (error) {
//     return rejectWithValue(error.response?.data?.message || error.message);
//   }
// });

// // Fetch all wallet balances thunk
// export const fetchAllWalletBalances = createAsyncThunk(
//   "userData/fetchAllWalletBalances",
//   async (wallets, { rejectWithValue, dispatch }) => {
//     const jwtToken = localStorage.getItem("token");
//     if (!jwtToken || !wallets?.length) {
//       return rejectWithValue("No token or wallets provided");
//     }

//     try {
//       let completedCount = 0;
//       const batchSize = 3; // Process 3 wallets at a time
//       const delayMs = 200; // 200ms delay between batches

//       const updateProgress = (progress) => {
//         dispatch(setBalanceFetchProgress(progress));
//       };

//       // Process wallets in batches with progress tracking
//       const results = await batchWithDelay(
//         wallets,
//         batchSize,
//         delayMs,
//         async (wallet) => {
//           try {
//             const response = await axios.get(`${baseUrl}user/getSolWalletBalance/${wallet.wallet}`, {
//               headers: { Authorization: `Bearer ${jwtToken}` },
//               timeout: 8000, // 8 second timeout per request
//             });

//             return response?.data?.data?.balance || 0;
//           } catch (error) {
//             console.error(`Balance fetch failed for ${wallet.wallet}:`, error);
//             throw new Error(error.response?.data?.message || error.message || "Network error");
//           }
//         },
//         updateProgress
//       );

//       // Return the wallets with updated balances
//       return results.map((result, index) => ({
//         ...wallets[index],
//         balance: result.balance,
//         error: result.error,
//         lastUpdated: Date.now(),
//       }));
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Fetch balances if needed (with caching)
// export const fetchBalancesIfNeeded = createAsyncThunk(
//   "userData/fetchBalancesIfNeeded",
//   async (_, { getState, dispatch }) => {
//     const state = getState();
//     const wallets = state.userDataSlice?.userDetails?.wallets?.walletAddressSOL || [];
//     const lastFetch = state.userDataSlice?.lastBalanceFetch;
//     const cacheTime = 60000; // 1 minute cache

//     if (!wallets.length) return null;

//     const needsUpdate =
//       !lastFetch || Date.now() - lastFetch > cacheTime || wallets.some((wallet) => wallet.balance === undefined);

//     if (needsUpdate) {
//       return dispatch(fetchAllWalletBalances(wallets));
//     }

//     return null;
//   }
// );

// // Fetch single wallet balance thunk
// export const fetchSingleWalletBalance = createAsyncThunk(
//   "userData/fetchSingleWalletBalance",
//   async ({ walletAddress, walletIndex }, { rejectWithValue }) => {
//     const jwtToken = localStorage.getItem("token");
//     if (!jwtToken) {
//       return rejectWithValue("No authentication token");
//     }

//     try {
//       const response = await axios.get(`${baseUrl}user/getSolWalletBalance/${walletAddress}`, {
//         headers: { Authorization: `Bearer ${jwtToken}` },
//         timeout: 8000,
//       });

//       return {
//         walletAddress,
//         walletIndex,
//         balance: response?.data?.data?.balance || 0,
//       };
//     } catch (error) {
//       console.error(`Error fetching balance for ${walletAddress}:`, error);
//       return {
//         walletAddress,
//         walletIndex,
//         balance: 0,
//         error: error.response?.data?.message || error.message,
//       };
//     }
//   }
// );

// // Redux slice
// const userDataSlice = createSlice({
//   name: "userDataSlice",
//   initialState: {
//     userDetails: {},
//     loading: false,
//     balancesLoading: false,
//     error: null,
//     lastBalanceFetch: null,
//     balanceFetchProgress: 0,
//     balanceErrors: [],
//   },
//   reducers: {
//     updateWalletBalance: (state, action) => {
//       const { walletAddress, balance } = action.payload;
//       if (state.userDetails?.wallets?.walletAddressSOL) {
//         const walletIndex = state.userDetails.wallets.walletAddressSOL.findIndex(
//           (wallet) => wallet.wallet === walletAddress
//         );
//         if (walletIndex !== -1) {
//           state.userDetails.wallets.walletAddressSOL[walletIndex].balance = balance;
//           state.userDetails.wallets.walletAddressSOL[walletIndex].lastUpdated = Date.now();
//           state.userDetails.wallets.walletAddressSOL[walletIndex].error = null;
//         }
//       }
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//     setBalanceFetchProgress: (state, action) => {
//       state.balanceFetchProgress = action.payload;
//     },
//     clearBalanceErrors: (state) => {
//       state.balanceErrors = [];
//       if (state.userDetails?.wallets?.walletAddressSOL) {
//         state.userDetails.wallets.walletAddressSOL.forEach((wallet) => {
//           delete wallet.error;
//         });
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch user data cases
//       .addCase(fetchUserData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserData.fulfilled, (state, { payload }) => {
//         state.loading = false;
//         state.userDetails = payload;
//       })
//       .addCase(fetchUserData.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || action.error.message;
//       })

//       // Fetch all wallet balances cases
//       .addCase(fetchAllWalletBalances.pending, (state) => {
//         state.balancesLoading = true;
//         state.balanceFetchProgress = 0;
//         state.balanceErrors = [];
//       })
//       .addCase(fetchAllWalletBalances.fulfilled, (state, { payload }) => {
//         state.balancesLoading = false;
//         state.balanceFetchProgress = 100;
//         state.lastBalanceFetch = Date.now();

//         if (state.userDetails?.wallets) {
//           state.userDetails.wallets.walletAddressSOL = payload;
//         }

//         // Collect errors for display
//         state.balanceErrors = payload
//           .filter((wallet) => wallet.error)
//           .map((wallet) => ({
//             wallet: wallet.wallet,
//             error: wallet.error,
//           }));
//       })
//       .addCase(fetchAllWalletBalances.rejected, (state, action) => {
//         state.balancesLoading = false;
//         state.balanceFetchProgress = 0;
//         state.error = action.payload || action.error.message;
//       })

//       // Fetch single wallet balance cases
//       .addCase(fetchSingleWalletBalance.fulfilled, (state, { payload }) => {
//         const { walletAddress, balance, error } = payload;
//         if (state.userDetails?.wallets?.walletAddressSOL) {
//           const walletIndex = state.userDetails.wallets.walletAddressSOL.findIndex(
//             (wallet) => wallet.wallet === walletAddress
//           );
//           if (walletIndex !== -1) {
//             state.userDetails.wallets.walletAddressSOL[walletIndex].balance = balance;
//             state.userDetails.wallets.walletAddressSOL[walletIndex].lastUpdated = Date.now();
//             state.userDetails.wallets.walletAddressSOL[walletIndex].error = error || null;
//           }
//         }
//       });
//   },
// });

// export const selectUserWallets = (state) => state.userDataSlice?.userDetails?.wallets?.walletAddressSOL || [];
// export const selectBalanceStatus = (state) => ({
//   loading: state.userDataSlice?.balancesLoading || false,
//   progress: state.userDataSlice?.balanceFetchProgress || 0,
//   errors: state.userDataSlice?.balanceErrors || [],
// });

// export const { updateWalletBalance, clearError, setBalanceFetchProgress, clearBalanceErrors } = userDataSlice.actions;

// export default userDataSlice.reducer;
