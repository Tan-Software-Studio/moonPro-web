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


export const getAllTokenList = createAsyncThunk(
    "getAllTokenList",
    async () => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URLS

        try {
            const response = await axios.get(`${baseUrl}perpetual/getPerpetualTokens`);
            return response?.data?.data
        } catch (error) {
            console.error(error)
        }
    }

)
const perpetualsData = createSlice({
    name: "perpetuals",
    initialState: {
        orderPositionsData: [],
        initialLoading: true,
        allTokenList: [],
        selectedToken: {}, 


    },
    reducers: {
        setSelectedToken: (state, action) => {
            state.selectedToken = action.payload
        }
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
            .addCase(getAllTokenList.fulfilled, (state, { payload }) => {
                state.allTokenList = payload;
                state.selectedToken = state.allTokenList[0] 
            });
    },
})



export const { setSelectedToken, setIsTokenChanged } = perpetualsData.actions;

export default perpetualsData.reducer;