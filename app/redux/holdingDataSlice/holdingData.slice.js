import { pnlPercentage } from "@/components/profile/calculation";
import axios from "axios";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

export const fetchPNLData = createAsyncThunk(
  "PnlData",
  async (solWalletAddress) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${baseUrl}transactions/PNLSolana/${solWalletAddress}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res?.data?.data?.pnl;
    } catch (err) {
      throw err;
    }
  }
);
export const fetchPNLDataForAnotherWallet = createAsyncThunk(
  "PnlDataForAnotherWallet",
  async (solWalletAddress) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${baseUrl}transactions/PNLSolana/${solWalletAddress}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res?.data?.data?.pnl;
    } catch (err) {
      throw err;
    }
  }
);

export const fetchPNLDataHistory = createAsyncThunk(
  "fetchPNLDataHistory",
  async (solWalletAddress) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${baseUrl}transactions/PNLHistory/${solWalletAddress}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res?.data?.data?.pnlHistory;
    } catch (err) {
      throw err;
    }
  }
);

export const fetchPNLDataHistoryForAnotherWallet = createAsyncThunk(
  "fetchPNLDataHistoryForAnotherWallet",
  async (solWalletAddress) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${baseUrl}transactions/PNLHistory/${solWalletAddress}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res?.data?.data?.pnlHistory;
    } catch (err) {
      throw err;
    }
  }
);

export const fetchPerformanceHistory = createAsyncThunk(
  "fetchPerformanceHistory",
  async (action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${baseUrl}transactions/PNLPerformance/${action}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data?.data?.performance;
    } catch (err) {
      throw err;
    }
  }
);
export const fetchPerformanceHistoryForAnotherWallet = createAsyncThunk(
  "fetchPerformanceHistoryForAnotherWallet",
  async (action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${baseUrl}transactions/PNLPerformance/${action}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data?.data?.performance;
    } catch (err) {
      throw err;
    }
  }
);

const holdingData = createSlice({
  name: "PnlData",
  initialState: {
    PnlData: [],
    PnlDataForAnotherWallet: [],
    PnlDataHistory: [],
    PnlDataHistoryAnotherWallet: [],
    performance: {},
    performanceForAnotherWallet: {},
    loading: true,
    loadingForAnotherWallet: true,
    initialLoading: false,
    initialLoadingForAnotherWallet: false,
    isDataLoaded: false,
    isDataLoadedForAnotherWallet: false,
    hasAttemptedLoad: false,
    hasAttemptedLoadForAnotherWallet: false,
    error: null,
    errorForAnotherWallet: null,
    pnlTableData: "profile",
  },
  reducers: {
    setPnlData: (state, { payload }) => {
      state.PnlData = payload;
    },
    updatePnlTableData: (state, { payload }) => {
      state.pnlTableData = payload;
    },
    updateBalanceChangeInQuickSellPortfolio: (state, { payload }) => {
      state.PnlData[payload?.index].chainBalance = payload?.qty;
    },
    updatePnlDataPriceOnly: (state, { payload }) => {
      if (state.PnlData?.length > 0) {
        if (payload?.length > 0) {
          for (const element of payload) {
            const findTokenIndex = state?.PnlData?.findIndex(
              (item) => item?.token == element?.Trade?.Currency?.MintAddress
            );
            if (findTokenIndex >= 0) {
              if (element?.Trade?.PriceInUSD) {
                state.PnlData[findTokenIndex].current_price =
                  element?.Trade?.PriceInUSD;
              }
            }
          }
        }
      }
    },
    updateHoldingsDataWhileBuySell: (state, { payload }) => {
      if (payload?.type == "buy") {
        const tokenQty = +(payload?.amountInDollar / payload?.price).toFixed(
          10
        );
        const recQty = payload?.recQty || tokenQty;
        if (state?.PnlData?.length > 0) {
          const findTokenIndex = state?.PnlData?.findIndex(
            (item) => item?.token == payload?.token
          );
          if (findTokenIndex >= 0) {
            state.PnlData[findTokenIndex]?.lots?.push({
              qty: recQty,
              price: payload?.price,
              solPrice: payload?.solPrice,
            });
            let totalQty = 0;
            let weightedBuyAmount = 0;
            let weightedSolBuyAmount = 0;
            for (const item of state.PnlData[findTokenIndex]?.lots) {
              totalQty += item.qty;
              weightedBuyAmount += item.qty * item.price;
              weightedSolBuyAmount += item?.solPrice;
            }
            const averageSolPrice = +Number(
              (
                weightedSolBuyAmount /
                state.PnlData[findTokenIndex]?.lots?.length
              ).toFixed(10)
            );
            state.PnlData[findTokenIndex].averageSolBuyPrice = averageSolPrice;
            state.PnlData[findTokenIndex].totalBoughtQty += recQty;
            state.PnlData[findTokenIndex].activeQtyHeld += recQty;
            state.PnlData[findTokenIndex].chainBalance += recQty;
            state.PnlData[findTokenIndex].totalBuyAmount = Number(
              weightedBuyAmount.toFixed(10)
            );
            state.PnlData[findTokenIndex].averageBuyPrice =
              totalQty > 0
                ? Number((weightedBuyAmount / totalQty).toFixed(10))
                : 0;
          } else {
            state.PnlData?.unshift({
              token: payload?.token,
              lots: [
                {
                  qty: recQty,
                  price: payload?.price,
                  solPrice: payload?.solPrice,
                },
              ],
              realizedProfit: 0,
              activeQtyHeld: recQty,
              totalBoughtQty: recQty,
              quantitySold: 0,
              totalBuyAmount: recQty,
              averageBuyPrice: payload?.price,
              averageHistoricalSellPrice: 0,
              current_price: payload?.price,
              name: payload?.name,
              symbol: payload?.symbol,
              img: payload?.img,
              chainBalance: recQty,
              averageSolBuyPrice: payload?.solPrice,
              averageSolSellPrice: 0,
            });
          }
        } else {
          state.PnlData?.unshift({
            token: payload?.token,
            lots: [
              {
                qty: recQty,
                price: payload?.price,
                solPrice: payload?.solPrice,
              },
            ],
            realizedProfit: 0,
            activeQtyHeld: recQty,
            totalBoughtQty: recQty,
            quantitySold: 0,
            totalBuyAmount: recQty,
            averageBuyPrice: payload?.price,
            averageHistoricalSellPrice: 0,
            current_price: payload?.price,
            name: payload?.name,
            symbol: payload?.symbol,
            img: payload?.img,
            chainBalance: recQty,
            averageSolBuyPrice: payload?.solPrice,
            averageSolSellPrice: 0,
          });
        }
      } else {
        if (state.PnlData?.length > 0) {
          const findTokenIndex = state?.PnlData?.findIndex(
            (item) => item?.token == payload?.token
          );
          if (findTokenIndex >= 0) {
            // qty to sell
            let qtyToSell = Number(payload?.qty);
            // realizedProfit
            let realizedProfit = 0;
            while (
              qtyToSell > 0 &&
              state?.PnlData?.[findTokenIndex]?.lots?.length > 0
            ) {
              // pick first lot to minus qty
              const lot = state?.PnlData?.[findTokenIndex]?.lots[0];
              // pick qty from lots one by one
              const sellQty = Math.min(qtyToSell, lot.qty);
              // calculate cost basis like if qty is not fullfill from 1 lot and calculate first lot cost
              const costBasis = sellQty * lot.price;
              // calculate revenue
              const revenue = sellQty * Number(payload?.price);
              // calculate realized profts
              realizedProfit += revenue - costBasis;
              // minus qty from lot
              lot.qty -= sellQty;
              // minus qty from sellTokens
              qtyToSell -= sellQty;
              // remove If first  lot is emety
              if (lot.qty <= 0) {
                state?.PnlData?.[findTokenIndex]?.lots?.shift();
              }
            }
            // add sell count
            const sellCount = state?.PnlData?.[findTokenIndex]?.sellCount || 0;
            const previousAvgSol = Number(
              state?.PnlData?.[findTokenIndex]?.averageSolSellPrice || 0
            );
            // calculate solana averagePrice
            state.PnlData[findTokenIndex].averageSolSellPrice =
              Number(previousAvgSol * sellCount + Number(payload?.solPrice)) /
              (sellCount + 1);
            // update sell count
            state.PnlData[findTokenIndex].sellCount++;
            // update realizedProfit
            state.PnlData[findTokenIndex].realizedProfit += Number(
              Number(realizedProfit).toFixed(10)
            );
            // update average price of sell
            const oldQtyCal =
              Number(state.PnlData[findTokenIndex].quantitySold) *
              Number(state.PnlData[findTokenIndex].averageHistoricalSellPrice);
            const newQtyCal = Number(payload?.qty) * Number(payload?.price);
            const qtyTotal =
              Number(state?.PnlData[findTokenIndex]?.quantitySold) +
              Number(payload?.qty);
            state.PnlData[findTokenIndex].averageHistoricalSellPrice = +(
              (oldQtyCal + newQtyCal) /
              qtyTotal
            ).toFixed(10);
            // update sold qty
            state.PnlData[findTokenIndex].quantitySold += Number(
              (Number(payload?.qty) - qtyToSell).toFixed(10)
            );
            // update totalBuyAmount
            state.PnlData[findTokenIndex].totalBuyAmount = Number(
              state?.PnlData?.[findTokenIndex]?.lots?.reduce(
                (sum, item) => sum + item?.qty * item?.price,
                0
              )
            );
            // average buyPrice
            const totalQty = state.PnlData[findTokenIndex]?.lots?.reduce(
              (sum, lot) => sum + lot?.qty,
              0
            );
            state.PnlData[findTokenIndex].averageBuyPrice =
              totalQty > 0
                ? Number(
                    (
                      state?.PnlData[findTokenIndex]?.totalBuyAmount / totalQty
                    ).toFixed(10)
                  )
                : 0;

            // If there is no holdings anymore like user sells everything
            if (
              state.PnlData[findTokenIndex]?.lots?.length == 0 ||
              payload?.isSellFullAmount
            ) {
              // add in the history
              state?.PnlDataHistory?.unshift({
                token: payload?.token,
                realizedProfit: state?.PnlData[findTokenIndex]?.realizedProfit,
                qty: state?.PnlData[findTokenIndex]?.activeQtyHeld,
                buyPrice: state?.PnlData[findTokenIndex]?.averageBuyPrice,
                sellPrice:
                  state?.PnlData[findTokenIndex]?.averageHistoricalSellPrice,
                name: payload?.name || null,
                symbol: payload?.symbol || null,
                img: payload?.img || null,
                createdAt: new Date(),
                solAvgPriceBuy:
                  state?.PnlData[findTokenIndex]?.averageSolBuyPrice,
                solAvgPriceSell:
                  state?.PnlData[findTokenIndex]?.solAvgPriceSell,
              });
              // add in the chart of pnl
              const finalRealizedPnl =
                Number(state?.performance?.totalPNL) +
                Number(state?.PnlData[findTokenIndex]?.realizedProfit);
              state?.performance?.chartPnlHistory?.push({
                value: finalRealizedPnl,
                createdAt: new Date(),
              });
              // add value in total pnl
              state.performance.totalPNL = finalRealizedPnl;
              // add in the percentage in the performance section
              const realizedPnlPercentage = Number(
                pnlPercentage(
                  state?.PnlData[findTokenIndex]?.averageHistoricalSellPrice,
                  state?.PnlData[findTokenIndex]?.averageBuyPrice
                ) || 0
              );
              if (realizedPnlPercentage >= 500) {
                const index = state?.performance?.performance?.findIndex(
                  (item) => item?._id == 500
                );
                if (index >= 0) {
                  state.performance.performance[index].count += 1;
                } else {
                  state?.performance?.performance?.push({
                    _id: 500,
                    count: 1,
                  });
                }
              } else if (
                realizedPnlPercentage >= 200 &&
                realizedPnlPercentage < 500
              ) {
                const index = state?.performance?.performance?.findIndex(
                  (item) => item?._id == 200
                );
                if (index >= 0) {
                  state.performance.performance[index].count += 1;
                } else {
                  state?.performance?.performance?.push({
                    _id: 200,
                    count: 1,
                  });
                }
              } else if (
                realizedPnlPercentage >= 0 &&
                realizedPnlPercentage < 200
              ) {
                const index = state?.performance?.performance?.findIndex(
                  (item) => item?._id == 0
                );
                if (index >= 0) {
                  state.performance.performance[index].count += 1;
                } else {
                  state?.performance?.performance?.push({
                    _id: 0,
                    count: 1,
                  });
                }
              } else if (
                realizedPnlPercentage >= -50 &&
                realizedPnlPercentage < 0
              ) {
                const index = state?.performance?.performance?.findIndex(
                  (item) => item?._id == -50
                );
                if (index >= 0) {
                  state.performance.performance[index].count += 1;
                } else {
                  state?.performance?.performance?.push({
                    _id: -50,
                    count: 1,
                  });
                }
              } else {
                const index = state?.performance?.performance?.findIndex(
                  (item) => item?._id == "null"
                );
                if (index >= 0) {
                  state.performance.performance[index].count += 1;
                } else {
                  state?.performance?.performance?.push({
                    _id: "null",
                    count: 1,
                  });
                }
              }
              state?.PnlData?.splice(findTokenIndex, 1);
            }
          }
        }
      }
      // console.log(
      //   console.log("🚀 ~ state:", JSON.parse(JSON.stringify(state.PnlData)))
      // );
    },
    resetPnlDataState: (state) => {
      state.initialLoading = false;
      state.isDataLoaded = false;
      state.hasAttemptedLoad = false; // Reset this too
      state.PnlData = [];
      state.error = null;
    },
    setBuyAndSellCountInPerformance: (state, { payload }) => {
      if (payload == "buy") {
        state.performance.buys += 1;
      } else if (payload == "sell") {
        state.performance.sells += 1;
      }
    },
    updatePercentageCountData: (state, { payload }) => {
      if (payload >= 500) {
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPNLData.pending, (state) => {
        state.initialLoading = true;
        state.isDataLoaded = false;
        state.hasAttemptedLoad = true;
        state.error = null;
      })
      .addCase(fetchPNLData.fulfilled, (state, { payload }) => {
        state.initialLoading = false;
        state.isDataLoaded = true;
        state.hasAttemptedLoad = true;
        state.PnlData = payload || [];
        state.error = null;
      })
      .addCase(fetchPNLData.rejected, (state, { payload }) => {
        state.initialLoading = false;
        state.isDataLoaded = true;
        state.hasAttemptedLoad = true;
        state.PnlData = [];
        state.error = payload;
      })
      .addCase(fetchPNLDataForAnotherWallet.pending, (state) => {
        state.initialLoadingForAnotherWallet = true;
        state.isDataLoadedForAnotherWallet = false;
        state.hasAttemptedLoadForAnotherWallet = true;
        state.errorForAnotherWallet = null;
      })
      .addCase(fetchPNLDataForAnotherWallet.fulfilled, (state, { payload }) => {
        state.initialLoadingForAnotherWallet = false;
        state.isDataLoadedForAnotherWallet = true;
        state.hasAttemptedLoadForAnotherWallet = true;
        state.PnlDataForAnotherWallet = payload || [];
        state.errorForAnotherWallet = null;
      })
      .addCase(fetchPNLDataForAnotherWallet.rejected, (state, { payload }) => {
        state.initialLoadingForAnotherWallet = false;
        state.isDataLoadedForAnotherWallet = true;
        state.hasAttemptedLoadForAnotherWallet = true;
        state.PnlDataForAnotherWallet = [];
        state.errorForAnotherWallet = payload;
      })
      .addCase(fetchPNLDataHistory.fulfilled, (state, { payload }) => {
        state.PnlDataHistory = payload || [];
      })
      .addCase(fetchPNLDataHistory.rejected, (state, { payload }) => {
        state.PnlDataHistory = [];
      })
      .addCase(
        fetchPNLDataHistoryForAnotherWallet.fulfilled,
        (state, { payload }) => {
          state.PnlDataHistoryAnotherWallet = payload || [];
        }
      )
      .addCase(
        fetchPNLDataHistoryForAnotherWallet.rejected,
        (state, { payload }) => {
          state.PnlDataHistoryAnotherWallet = [];
        }
      )
      .addCase(fetchPerformanceHistory.fulfilled, (state, { payload }) => {
        state.performance = payload;
        state.loading = false;
      })
      .addCase(fetchPerformanceHistory.rejected, (state, { payload }) => {
        state.performance = [];
        state.loading = false;
      })
      .addCase(
        fetchPerformanceHistoryForAnotherWallet.fulfilled,
        (state, { payload }) => {
          state.performanceForAnotherWallet = payload;
          state.loadingForAnotherWallet = false;
        }
      )
      .addCase(
        fetchPerformanceHistoryForAnotherWallet.rejected,
        (state, { payload }) => {
          state.performanceForAnotherWallet = [];
          state.loadingForAnotherWallet = false;
        }
      );
  },
});

export const {
  setPnlData,
  updatePnlDataPriceOnly,
  updatePnlTableData,
  resetPnlDataState,
  updateHoldingsDataWhileBuySell,
  updatePercentageCountData,
  setBuyAndSellCountInPerformance,
  updateBalanceChangeInQuickSellPortfolio,
} = holdingData.actions;

export default holdingData.reducer;
