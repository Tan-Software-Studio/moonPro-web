import { resolveSymbol } from "./resolveSymbol";
import { getBars, subscribeBars, unsubscribeBars } from "./getBars";
import { onReady } from "./onReady";
import { getMarks } from "./getMarks";

// Datafeed object for TradingView
const Datafeed = {
    onReady,
    resolveSymbol,
    getBars,
    getMarks,
    subscribeBars,
    unsubscribeBars,
};

export default Datafeed;
