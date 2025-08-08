import axios from "axios";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");


const url = "https://api.hyperliquid.xyz/info";

export const orderPositions = createAsyncThunk(
    "orderPositions",
    async (walletAddress) => {
        const params = {
            type: "clearinghouseState",
            user: walletAddress,
        };
        try {
            const response = await axios.post(url, params);
            return response?.data;
        } catch (err) {
            throw err;
        }
    }
);

const perpetualsData = createSlice({
    name: "perpetuals",
    initialState: {
        orderPositionsData: [],
        initialLoading: true,
        selectedToken: {},
        isTokenChanged: {},
        perpsTokenList: []


    },
    reducers: {
        setSelectedToken: (state, { payload }) => {
            state.selectedToken = {
                ...state.selectedToken,
                ...payload,
                dayBaseVlm: payload?.dayBaseVlm,
                dayNtlVlm: payload?.dayNtlVlm,
                funding: payload?.funding,
                markPx: payload?.markPx,
                midPx: payload?.midPx,
                openInterest: payload?.openInterest,
                oraclePx: payload?.oraclePx,
                premium: payload?.premium,
                prevDayPx: payload?.prevDayPx,
                priceChangePercent:
                    ((payload?.markPx - payload?.prevDayPx) / payload?.prevDayPx) * 100,
                priceChangeAbs: (payload?.markPx - payload?.prevDayPx)
            };
        },
        setPerpsTokenList: (state, { payload }) => {
            state.perpsTokenList = payload
        },
        setIsTokenChanged: (state, { payload }) => {
            state.isTokenChanged = payload
        }
        // setPerpsTokenList: (state, { payload }) => {
        //     state.perpsTokenList = {
        //         ...state.perpsTokenList,
        //         ...payload,
        //         ...payload.map(token => {
        //             if (token.name === coin) {
        //                 const updated = {
        //                     ...token,
        //                     ...payload,
        //                     priceChangePercent:
        //                         ((payload?.markPx - payload?.prevDayPx) /
        //                             payload?.prevDayPx) *
        //                         100,
        //                     priceChangeAbs:
        //                         payload?.markPx - payload?.prevDayPx,
        //                 };
        //                 return updated;
        //             }
        //             return token;
        //         }),

        //     }
        // }



    },
    extraReducers: (builder) => {
        builder
            .addCase(orderPositions.fulfilled, (state, { payload }) => {
                state.orderPositionsData = payload;
                state.initialLoading = false;
            })
            .addCase(orderPositions.rejected, (state) => {
                state.initialLoading = false;
            })
    },
})



export const { setSelectedToken, setPerpsTokenList, } = perpetualsData.actions;

export default perpetualsData.reducer;