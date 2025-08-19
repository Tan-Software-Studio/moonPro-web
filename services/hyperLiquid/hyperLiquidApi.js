const axios = require("axios");

export const fetchHyperliquidData = async (type, user) => {
    const url = "https://api.hyperliquid.xyz/info";
    try {
        const response = await axios.post(url, {
            type,
            user
        });

        return response.data;
    } catch (error) {
        console.error("❌ Failed to fetch open orders.");
    }
};
 
 