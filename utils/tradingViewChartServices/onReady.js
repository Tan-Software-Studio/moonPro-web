import { intervalTV } from "./constant";

const configurationData = {
    // Represents the resolutions for bars supported by your datafeed
    supported_resolutions: intervalTV,
    // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
    exchanges: [
        { value: "Bitfinex", name: "Bitfinex", desc: "Bitfinex" },
        { value: "Kraken", name: "Kraken", desc: "Kraken bitcoin exchange" },
    ],
    // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
    symbols_types: [{ name: "crypto", value: "crypto" }],
    supports_marks: true,
    supports_timescale_marks: true,
};

export const onReady = (callback) => {
    setTimeout(() => callback(configurationData), 0);
};
