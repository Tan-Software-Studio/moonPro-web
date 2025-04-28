import { intervalTV } from "./constant";

export const resolveSymbol = (
  symbolName,
  onSymbolResolvedCallback,
  onResolveErrorCallback,
  extension
) => {
  if (!symbolName) {
    onResolveErrorCallback();
  } else {
    onSymbolResolvedCallback({
      ticker: symbolName,
      name: `${symbolName}/WSOL`,
      session: "24x7",
      timezone: "Etc/UTC",
      minmov: 1,
      pricescale: 10000000000,
      has_intraday: true,
      intraday_multipliers: ["1", "5", "15", "30", "60"],
      has_empty_bars: true,
      has_weekly_and_monthly: true,
      has_seconds:true,
      supported_resolutions: intervalTV,
      supported_intervals: intervalTV,
      countBack: 30,
      volume_precision: 2,
      visible_plots_set: "ohlcv",
      build_seconds_from_ticks:true
    });
  }
};
