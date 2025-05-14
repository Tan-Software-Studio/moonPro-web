import { fetchHistoricalData } from "./histOHLC";
import {
  subscribeToWebSocket,
  unsubscribeFromWebSocket,
} from "./websocketOHLC";

async function toGetTokenAddressFromLocalStorage() {
  return await localStorage.getItem("chartTokenAddress");
}

export const getBars = async (
  symbolInfo,
  resolution,
  periodParams,
  onHistoryCallback,
  onErrorCallback
) => {
  try {
    const tokenAddress = await toGetTokenAddressFromLocalStorage();
    const bars = await fetchHistoricalData(
      periodParams,
      resolution,
      tokenAddress
    );
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

export const subscribeBars = async (
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscriberUID,
  onResetCacheNeededCallback
) => {
  const tokenAddress = await toGetTokenAddressFromLocalStorage();
  await subscribeToWebSocket(
    onRealtimeCallback,
    tokenAddress,
    resolution,
    subscriberUID
  );
};

export const unsubscribeBars = (subscriberUID) => {
  unsubscribeFromWebSocket();
};
