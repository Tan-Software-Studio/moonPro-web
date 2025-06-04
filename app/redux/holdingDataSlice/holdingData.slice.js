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

const holdingData = createSlice({
  name: "PnlData",
  initialState: {
    PnlData: [],
    initialLoading: false,
    isDataLoaded: false,
    hasAttemptedLoad: false,
    error: null,
    pnlTableData: "profile",
  },
  reducers: {
    setPnlData: (state, { payload }) => {
      state.PnlData = payload;
    },
    updatePnlTableData: (state, { payload }) => {
      state.pnlTableData = payload;
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
        if (state?.PnlData?.length > 0) {
          const findTokenIndex = state?.PnlData?.findIndex(
            (item) => item?.token == payload?.token
          );
          if (findTokenIndex >= 0) {
            state.PnlData[findTokenIndex]?.lots?.push({
              qty: tokenQty,
              price: payload?.price,
            });
            let totalQty = 0;
            let weightedBuyAmount = 0;
            for (const item of state.PnlData[findTokenIndex]?.lots) {
              totalQty += item.qty;
              weightedBuyAmount += item.qty * item.price;
            }
            state.PnlData[findTokenIndex].totalBoughtQty += tokenQty;
            state.PnlData[findTokenIndex].activeQtyHeld += tokenQty;
            state.PnlData[findTokenIndex].totalBuyAmount = Number(
              weightedBuyAmount.toFixed(10)
            );
            state.PnlData[findTokenIndex].averageBuyPrice =
              totalQty > 0
                ? Number((weightedBuyAmount / totalQty).toFixed(10))
                : 0;
          } else {
            state.PnlData?.push({
              token: payload?.token,
              lots: [
                {
                  qty: tokenQty,
                  price: payload?.price,
                },
              ],
              realizedProfit: 0,
              activeQtyHeld: tokenQty,
              totalBoughtQty: tokenQty,
              quantitySold: 0,
              totalBuyAmount: tokenQty,
              averageBuyPrice: payload?.price,
              averageHistoricalSellPrice: 0,
              current_price: payload?.price,
              name: payload?.name,
              symbol: payload?.symbol,
              img: payload?.img,
              chainBalance: tokenQty,
            });
          }
        } else {
          state.PnlData?.push({
            token: payload?.token,
            lots: [
              {
                qty: tokenQty,
                price: payload?.price,
              },
            ],
            realizedProfit: 0,
            activeQtyHeld: tokenQty,
            totalBoughtQty: tokenQty,
            quantitySold: 0,
            totalBuyAmount: tokenQty,
            averageBuyPrice: payload?.price,
            averageHistoricalSellPrice: 0,
            current_price: payload?.price,
            name: payload?.name,
            symbol: payload?.symbol,
            img: payload?.img,
            chainBalance: tokenQty,
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
            // update realizedProfit
            state.PnlData[findTokenIndex].realizedProfit += Number(
              Number(realizedProfit).toFixed(10)
            );
            // update average price of sell
            const oldQtyCal =
              Number(state.PnlData[findTokenIndex].quantitySold) *
              Number(state.PnlData[findTokenIndex].averageHistoricalSellPrice);
            const newQtyCal =
              Number(payload?.qty) *
              Number(payload?.price);
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
            if (
              state.PnlData[findTokenIndex]?.lots?.length == 0 ||
              payload?.isSellFullAmount
            ) {
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
      });
  },
});

export const {
  setPnlData,
  updatePnlDataPriceOnly,
  updatePnlTableData,
  resetPnlDataState,
  updateHoldingsDataWhileBuySell,
} = holdingData.actions;

export default holdingData.reducer;
