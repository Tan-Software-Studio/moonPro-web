import { resolveSymbol } from "./resolveSymbol";
import { getBars, subscribeBars, unsubscribeBars } from "./getBars";
import { onReady } from "./onReady";

// Datafeed object for TradingView
const Datafeed = {
    onReady,
    resolveSymbol,
    getBars,
    subscribeBars,
    unsubscribeBars,
    timeFormatter: {
        format: (date) => {
        const hours = date.getUTCHours().toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, "0");
        const seconds = date.getUTCSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
        },
    },
};

export default Datafeed;
