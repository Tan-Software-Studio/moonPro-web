const axios = require("axios");

export const getOpenOrders = async (address) => {
    const url = "https://api.hyperliquid.xyz/info";
    try {
        const response = await axios.post(url, {
            type: "openOrders",
            user: address
        });

        return response.data;
        // console.log("📌 Open Orders:", JSON.stringify(openOrders, null, 2));

    } catch (error) {
        console.error("❌ Failed to fetch open orders.");
       
    }
};
 