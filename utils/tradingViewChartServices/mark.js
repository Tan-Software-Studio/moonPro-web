import { humanReadableFormatWithNoDollar, formatDecimal } from "@/utils/basicFunctions";
import { setPriceLines } from "./fifoPrice";

const marks = [];
const userMarks = [];

export const devMark = (id, time, isBuy, usdTraded, atPricePoint, isUsdActive, isMarketCapActive, markType) => {
  const usdTradedReadable = usdTraded >= 1 || usdTraded <= -1 ?  humanReadableFormatWithNoDollar(usdTraded, 2) : formatDecimal(usdTraded);
  const atPricePointReadable = atPricePoint >= 1 || atPricePoint <= -1 ?  humanReadableFormatWithNoDollar(atPricePoint, 2) : formatDecimal(atPricePoint);
  
  const isDev = markType === 'dev';
  const label = isDev
    ? (isBuy ? 'DB' : 'DS')
    : (isBuy ? 'B' : 'S');
  const trader = isDev ? 'Dev' : 'You';

  return {
      id,
      time,
      color: {
          border: isBuy === true ? '#195E54' : '#84303B',
          background: isBuy === true ? '#089880' : '#F23645',
      },
      text: isBuy === true ? 
      [`${trader} Bought $${usdTradedReadable} at ${isUsdActive ? "$" : ""}${atPricePointReadable} ${isUsdActive ? "USD" : "SOL"} ${isMarketCapActive ? "Market Cap" : ""}`] 
      : 
      [`${trader} sold $${usdTradedReadable} at ${isUsdActive ? "$" : ""}${atPricePointReadable} ${isUsdActive ? "USD" : "SOL"} ${isMarketCapActive ? "Market Cap" : ""}`],
      label,
      labelFontColor: 'white',
      minSize: 25,
  };
}

// Add a mark object to local store
export const addMark = async (time, isBuy, usdTraded, atPricePoint, tokenAmount, isUsdActive, isMarketCapActive, markType) => {
  const newMark = devMark(getStoredMarks().length, time, isBuy, usdTraded, atPricePoint, isUsdActive, isMarketCapActive, markType);
  marks.push(newMark);
  const isUser = markType === "user";
  if (isUser) {
    const userMark = {
      time,
      isBuy,
      usdTraded,
      price: atPricePoint,
      amount: tokenAmount
    }
    userMarks.push(userMark);
    userMarks.sort((a, b) => a.time - b.time);
  }
  const chart = window?.tvWidget;

  if (chart) {
    chart.activeChart().refreshMarks(); // Force re-request of marks
    await setPriceLines(chart);
  }
};

export const getStoredUserMarks = () => {
  return [...userMarks];
}

// Get all stored marks
export const getStoredMarks = () => {
  return [...marks]; // return a copy to avoid direct mutation
};

// Clear all marks from local store
export const clearMarks = () => {
  marks.length = 0; // clear array in-place
  userMarks.length = 0;
};