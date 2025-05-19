import { intervalTV } from "./constant";

export const resolveSymbol = async (
  symbolName,
  onSymbolResolvedCallback,
  onResolveErrorCallback,
  extension
) => {
  if (!symbolName) {
    onResolveErrorCallback();
    return;
  }

  // Fetch market cap toggle from localStorage
  let pricescale = 10000000000; // Default value
  try {
    const mcPriceToggle = await localStorage.getItem("chartMarketCapPriceToggleActive");
    if (mcPriceToggle !== null) {
      pricescale = mcPriceToggle === "true" ? 1 : 10000000000;
    }
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    // Fallback to default pricescale if localStorage access fails
  }

  onSymbolResolvedCallback({
    ticker: symbolName,
    name: `${symbolName}/WSOL`,
    session: "24x7",
    timezone: "Etc/UTC",
    minmov: 1,
    pricescale: pricescale,
    has_intraday: true,
    intraday_multipliers: ["1", "5", "15", "30", "60"],
    has_weekly_and_monthly: true,
    has_seconds: true,
    supported_resolutions: intervalTV,
    supported_intervals: intervalTV,
    countBack: 30,
    volume_precision: 2,
    visible_plots_set: "ohlcv",
    build_seconds_from_ticks: true,
    has_empty_bars: false,
  });
}