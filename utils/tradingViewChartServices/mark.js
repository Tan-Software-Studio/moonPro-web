import { humanReadableFormatWithNoDollar, formatDecimal } from "@/utils/basicFunctions"

const marks = [];

export const devMark = (id, time, isBuy, usdTraded, atPricePoint, isUsdActive, isMarketCapActive) => {
    const usdTradedReadable = humanReadableFormatWithNoDollar(usdTraded, 1);
    const atPricePointReadable = atPricePoint > 0.99 ?  humanReadableFormatWithNoDollar(atPricePoint, 2) : formatDecimal(atPricePoint);
    return {
        id,
        time,
        color: {
            border: isBuy === true ? '#195E54' : '#84303B',
            background: isBuy === true ? '#089880' : '#F23645',
        },
        text: isBuy === true ? 
        [`Dev Bought $${usdTradedReadable} at ${isUsdActive ? "$" : ""}${atPricePointReadable} ${isUsdActive ? "USD" : "SOL"} ${isMarketCapActive ? "Market Cap" : ""}`] 
        : 
        [`Dev sold $${usdTradedReadable} at ${isUsdActive ? "$" : ""}${atPricePointReadable} ${isUsdActive ? "USD" : "SOL"} ${isMarketCapActive ? "Market Cap" : ""}`],
        label: isBuy === true ? 'DB' : 'DS',
        labelFontColor: 'white',
        minSize: 25,
    };
}

// Add a mark object to local store
export const addDevMark = (id, time, isBuy, usdTraded, atPricePoint, isUsdActive, isMarketCapActive) => {
  const newMark = devMark(id, time, isBuy, usdTraded, atPricePoint, isUsdActive, isMarketCapActive);
  marks.push(newMark);
};

// Get all stored marks
export const getStoredMarks = () => {
  return [...marks]; // return a copy to avoid direct mutation
};

// Clear all marks from local store
export const clearMarks = () => {
  marks.length = 0; // clear array in-place
};