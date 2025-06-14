import { fetchHistoricalData } from "./histOHLC";
import {
  subscribeToWebSocket,
  unsubscribeFromWebSocket,
} from "./websocketOHLC";
import { setNewLatestBarTime } from "./latestBarTime";
import { setNewLatestHistoricalBar } from "./latestHistoricalBar";
import { setHistoricalChunkAndConnectBars } from "./historicalChunk";

// Dictionary to store offsets per resolution
let resolutionOffsets = {};

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

async function getChartTokenCreator() {
  return await localStorage.getItem("chartTokenCreator");
}

async function getSolWalletAddress() {
  return await localStorage.getItem("walletAddress");
}

// Function to reset the resolutionOffsets dictionary
export const resetResolutionOffsets = () => {
  resolutionOffsets = {};
};

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
    const tokenCreator = await getChartTokenCreator();
    const walletAddress = await getSolWalletAddress();

    // Initialize resolutionOffsets structure
    if (!(resolution in resolutionOffsets)) {
      resolutionOffsets[resolution] = {
        offset: 0,
        oldestBarTimeSec: null
      };
    }
    const storedBarTime = resolutionOffsets[resolution].oldestBarTimeSec;

    // Check time logic before fetching
    if (storedBarTime !== null) {
      if (storedBarTime > periodParams.to) {
        // console.log("[getBars] Stored bar time is newer than requested range → No data.");
        onHistoryCallback([], { noData: true });
        return;
      }

      if (storedBarTime < periodParams.to) {
        // Different time window — reset offset
        // console.log("Trading view reseted cache")
        resolutionOffsets[resolution].offset = 0;
      }
    }
    
    const barsData = await fetchHistoricalData(
      periodParams,
      resolution,
      tokenAddress,
      usdActive,
      marketCapActive,
      supply,
      solPrice,
      tokenCreator,
      walletAddress,
      resolutionOffsets[resolution].offset,
    );
    // console.log(barsData);
    const bars = barsData.bars;
    if (bars?.length > 0) {
      // Increment offset for this resolution by 500
      resolutionOffsets[resolution].offset += barsData.offset;

      // Store last bar time in seconds
      const oldestBarTimeSec = Math.floor(bars[0].time / 1000);
      resolutionOffsets[resolution].oldestBarTimeSec = oldestBarTimeSec;
      setHistoricalChunkAndConnectBars(bars, resolution);
      setNewLatestBarTime(bars[bars?.length - 1]?.time);
      setNewLatestHistoricalBar(bars[bars?.length - 1], resolution);
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
    solPrice,
  );
};

export const unsubscribeBars = (subscriberUID) => {
  unsubscribeFromWebSocket();
};