import { fetchHistoricalData } from "./histOHLC";
import {
  subscribeToWebSocket,
  unsubscribeFromWebSocket,
} from "./websocketOHLC";

async function toGetTokenAddressFromLocalStorage() {
  return await localStorage.getItem("chartTokenAddress");
}

async function getChartUsdSolToggleActive() {
  return await localStorage.getItem("chartUsdSolToggleActive");
}

async function getChartMarketCapPriceToggleActive() {
  return await localStorage.getItem("chartMarketCapPriceToggleActive");
}

async function getChartSupply() {
  return await localStorage.getItem("chartSupply");
}

async function getSolPrice() {
  return await localStorage.getItem("solPrice");
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
    
    const isUsdActive = await getChartUsdSolToggleActive();
    let usdActive = true;
    if (isUsdActive !== null) {
      usdActive = isUsdActive === "true";
    }
    const isMarketCapActive = await getChartMarketCapPriceToggleActive();
    let marketCapActive = true;
    if (isMarketCapActive !== null) {
      marketCapActive = isMarketCapActive === "true";
    }

    const supply = await getChartSupply();
    const solPrice = await getSolPrice();

    const bars = await fetchHistoricalData(
      periodParams,
      resolution,
      tokenAddress,
      usdActive,
      marketCapActive,
      supply,
      solPrice
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

  const isUsdActive = await getChartUsdSolToggleActive();
  let usdActive = true;
  if (isUsdActive !== null) {
    usdActive = isUsdActive === "true";
  }
  const isMarketCapActive = await getChartMarketCapPriceToggleActive();
  let marketCapActive = true;
  if (isMarketCapActive !== null) {
    marketCapActive = isMarketCapActive === "true";
  }

  const supply = await getChartSupply();
  const solPrice = await getSolPrice();

  await subscribeToWebSocket(
    onRealtimeCallback,
    tokenAddress,
    resolution,
    subscriberUID,
    usdActive,
    marketCapActive,
    supply,
    solPrice
  );
};

export const unsubscribeBars = (subscriberUID) => {
  unsubscribeFromWebSocket();
};
