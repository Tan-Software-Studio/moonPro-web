import { fetchHistoricalData } from "./histOHLC";
import { subscribeToWebSocket } from "./websocketOHLC";
async function toGetTokenAddressFromLocalStorage() {
  const token = await localStorage.getItem("chartTokenAddress");
  return token;
}
// Fetch historical data bars
export const getBars = async (
  symbolInfo,
  resolution,
  periodParams,
  onHistoryCallback,
  onErrorCallback
) => {
  // console.log("🚀 ~ resolution:", resolution);
  const { from, to } = periodParams;
  // console.log("🚀 ~ from:", new Date(from * 1000).toISOString());
  // console.log("🚀 ~ to:", new Date(to * 1000).toISOString());
  try {
    // Fetch historical data
    const tokenAddress = await toGetTokenAddressFromLocalStorage();
    const bars = await fetchHistoricalData(
      periodParams,
      resolution,
      tokenAddress
    );
    // console.log("🚀 ~ bars:", bars);
    // Pass bars to the chart if data is available
    if (bars.length > 0) {
      onHistoryCallback(bars, { noData: false });
    } else {
      onHistoryCallback([], { noData: true });
    }
  } catch (err) {
    console.error("[getBars] Error fetching data:", err);
    onErrorCallback(err);
  }
};

// Subscribe to real-time data using WebSocket
export const subscribeBars = async (
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscriberUID,
  onResetCacheNeededCallback
) => {
  const tokenAddress = await toGetTokenAddressFromLocalStorage();
  subscribeToWebSocket(onRealtimeCallback, tokenAddress);
};

// Unsubscribe from real-time data
export const unsubscribeBars = (subscriberUID) => {
  try {
    delete this.subscribers[subscriberUID];
  } catch (error) {
    console.log("🚀 ~ unsubscribeBars ~ error:", error?.message);
  }
};
