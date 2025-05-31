import axios from "axios";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;;

export const fetchAiSignalData = createAsyncThunk(
    "fetchAiSignalData",
    async () => {
        try {
            const res = await axios.get(`${baseUrl}aiSignal/aiSignalTokens`);
            return res?.data?.data?.aiSignleTokens;
        } catch (err) {
            throw err;
        }
    }
);


const aiSignalSlice = createSlice({
    name: "aiSignalSlice",
    initialState: {
        aiSignalData: [],
        initialLoading: true,
    },
    reducers: {
        setAiSignalData: (state, { payload }) => {
            state.aiSignalData = payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAiSignalData.fulfilled, (state, { payload }) => {
            state.aiSignalData = payload;
            state.initialLoading = false
        }).addCase(fetchAiSignalData.rejected, (state) => {
            state.initialLoading = false
        })
    }
})

export const { setAiSignalData } = aiSignalSlice.actions

export default aiSignalSlice.reducer