import { fetchHistoricalData } from "./histOHLC";
import {
  subscribeToWebSocket,
  unsubscribeFromWebSocket,
} from "./websocketOHLC";
import { setNewLatestBarTime } from "./latestBarTime";
import { setNewLatestHistoricalBar } from "./latestHistoricalBar";
import { setHistoricalChunkAndConnectBars } from "./historicalChunk";
import { intervalTV } from "./constant";

let startingIntervalBeforeLoop = null;
let moveToNextInterval = true;

let resolutionOffsets = {};

export const resetResolutionOffsets = () => {
  resolutionOffsets = {};
};

function getNextInterval(savedInterval) {
  const index = intervalTV.indexOf(savedInterval);
  if (index !== -1) {
    return intervalTV[(index + 1) % intervalTV.length];
  }
  for (let i = 0; i < intervalTV.length; i++) {
    if (intervalTV[i] > savedInterval) {
      return intervalTV[i];
    }
  }
  return intervalTV[0];
}

export const getBars = async (
  symbolInfo,
  resolution,
  periodParams,
  onHistoryCallback,
  onErrorCallback
) => {
  try {
    const tokenAddress = localStorage.getItem("chartTokenAddress");
    const isUsdActive = localStorage.getItem("chartUsdSolToggleActive");
    const isMarketCapActive = localStorage.getItem("chartMarketCapPriceToggleActive");
    const supply = localStorage.getItem("chartSupply");
    const solPrice = localStorage.getItem("solPrice");
    const tokenCreator = localStorage.getItem("chartTokenCreator");
    const walletAddress = localStorage.getItem("walletAddress");

    const usdActive = isUsdActive === null ? true : isUsdActive === "true";
    const marketCapActive = isMarketCapActive === null ? true : isMarketCapActive === "true";

    if (!(resolution in resolutionOffsets)) {
      resolutionOffsets[resolution] = {
        offset: 0,
        oldestBarTimeSec: null,
        fetchedSeconds: false
      };
    }

    const storedBarTime = resolutionOffsets[resolution].oldestBarTimeSec;

    if (resolutionOffsets[resolution].fetchedSeconds === true) {
      onHistoryCallback([], { noData: true });
      return;
    }

    if (storedBarTime !== null) {
      if (storedBarTime > periodParams.to) {
        onHistoryCallback([], { noData: true });
        return;
      }

      if (storedBarTime < periodParams.to) {
        resolutionOffsets[resolution].offset = 0;
        if (resolution.endsWith("S")) {
          resolutionOffsets[resolution].fetchedSeconds = false;
        }
      }
    }

    if (startingIntervalBeforeLoop === null) {
      startingIntervalBeforeLoop = resolution;
    }

    const barsData = await fetchHistoricalData(
      periodParams,
      resolution,
      tokenAddress,
      usdActive,
      marketCapActive,
      supply,
      resolutionOffsets[resolution].offset
    );

    const bars = barsData.bars;

    if (bars?.length > 0) {
      resolutionOffsets[resolution].offset += barsData.offset;
      resolutionOffsets[resolution].oldestBarTimeSec = Math.floor(bars[0].time / 1000);

      startingIntervalBeforeLoop = null;
      moveToNextInterval = false;

      setHistoricalChunkAndConnectBars(bars, resolution);
      setNewLatestBarTime(bars[bars.length - 1].time);
      setNewLatestHistoricalBar(bars[bars.length - 1], resolution);

      onHistoryCallback(bars, { noData: false });
      if (resolution.endsWith("S")) {
        resolutionOffsets[resolution].fetchedSeconds = true;
      }
    } else {
      if (moveToNextInterval) {
        const nextInterval = getNextInterval(resolution);
        if (nextInterval !== startingIntervalBeforeLoop) {
          window?.tvWidget?.activeChart()?.setResolution(nextInterval);
        }
      }
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
  const tokenAddress = localStorage.getItem("chartTokenAddress");
  const isUsdActive = localStorage.getItem("chartUsdSolToggleActive");
  const isMarketCapActive = localStorage.getItem("chartMarketCapPriceToggleActive");
  const supply = localStorage.getItem("chartSupply");
  const solPrice = localStorage.getItem("solPrice");

  const usdActive = isUsdActive === null ? true : isUsdActive === "true";
  const marketCapActive = isMarketCapActive === null ? true : isMarketCapActive === "true";

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
