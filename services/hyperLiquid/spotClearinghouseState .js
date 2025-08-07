import axios from "axios";

export async function spotClearinghouseState(walletAddress) {
    const url = "https://api.hyperliquid.xyz/info";
    const params = {
        type: "spotClearinghouseState",
        user: walletAddress,
    };
    try {
        const response = await axios.post(url, params);
        return response?.data?.balances;
    } catch (err) {
        throw err;
    }
}