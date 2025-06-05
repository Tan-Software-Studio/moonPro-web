function calculateTimeDifference(dateString) {
  const inputDate = new Date(dateString);
  const currentDate = new Date();

  const differenceInMilliseconds = currentDate - inputDate;
  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
  const differenceInMinutes = Math.floor(differenceInSeconds / 60);
  const differenceInHours = Math.floor(differenceInMinutes / 60);
  const differenceInDays = Math.floor(differenceInHours / 24);

  if (differenceInSeconds < 60) {
    return `${differenceInSeconds}s`;
  } else if (differenceInMinutes < 60) {
    return `${differenceInMinutes}m`;
  } else if (differenceInHours < 24) {
    return `${differenceInHours}h`;
  } else {
    return `${differenceInDays}d`;
  }
}
function convertUTCToLocalTimeString(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-GB', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function humanReadableFormat(number, withDollar = true) {
  const units = ["", "K", "M", "B", "T"];
  let unitIndex = 0;

  number = parseFloat(number);
  if (isNaN(number)) return "$0";

  // Scale down
  while (Math.abs(number) >= 1000 && unitIndex < units.length - 1) {
    number /= 1000;
    unitIndex++;
  }

  // Check if rounding brings it to 1000
  const rounded = Number(number.toFixed(2));
  if (rounded >= 1000 && unitIndex < units.length - 1) {
    number = number / 1000;
    unitIndex++;
  }

  // Format cleanly: remove .00 if not needed
  const roundedStr = number.toFixed(2);
  const displayStr = roundedStr.endsWith(".00")
    ? parseInt(roundedStr).toString()
    : roundedStr;

  return withDollar ? `$${displayStr}${units[unitIndex]}` : `${displayStr}${units[unitIndex]}`;
}

function humanReadableFormatWithOutUsd(number) {
  const units = ["", "K", "M", "B", "T"];
  let unitIndex = 0;

  number = parseFloat(number);

  if (isNaN(number)) {
    return "0.00";
  }

  while (Math.abs(number) >= 1000 && unitIndex < units.length - 1) {
    number /= 1000;
    unitIndex++;
  }

  return `${number.toFixed(2)} ${units[unitIndex]}`;
}

function calculateHoldersPercentage(holdingAmount, totalSupply) {
  if (totalSupply === 0) {
    return "Total supply cannot be zero.";
  }
  const percentage = (holdingAmount / totalSupply) * 100;
  return `${percentage.toFixed(2)}%`;
}
function calculateHoldersPercentageWithoutPercentage(
  holdingAmount,
  totalSupply
) {
  if (totalSupply === 0) {
    return "Total supply cannot be zero.";
  }
  const percentage = (holdingAmount / totalSupply) * 100;
  return `${percentage.toFixed(2)}`;
}

const getDateMinus24Hours = (hours) => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};
const getDateMinusMinutes = (minutes) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date.toISOString();
};

function calculatePercentageChange(currentPrice, oldPrice) {
  if (oldPrice === 0) {
    return "0.00";
  }
  const percentageChange = ((currentPrice - oldPrice) / oldPrice) * 100;
  const finalPercentage =
    percentageChange > 0
      ? `+${Number(percentageChange).toFixed(2)}`
      : Number(percentageChange).toFixed(2);
  return finalPercentage;
}

function convertToRelativeTime(dateString) {
  const givenDate = new Date(dateString);
  const now = new Date();

  // Calculate differences in years, months, and days
  let years = now.getUTCFullYear() - givenDate.getUTCFullYear();
  let months = now.getUTCMonth() - givenDate.getUTCMonth();
  let days = now.getUTCDate() - givenDate.getUTCDate();

  // Adjust for negative months
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Adjust for negative days
  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      0
    ).getUTCDate();
    days += previousMonth;
    if (months < 0) {
      years -= 1;
      months += 12;
    }
  }
  return `${years}y ${months}m ${days}d`;
}

function UpdateTime(timestamp, currentTime) {
  const diff = Math.abs(currentTime - timestamp);

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 60000) % 60);
  const hours = Math.floor((diff / 3600000) % 24);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

function UpdateTimeViaUTCWithCustomTime(utcString, currentTime) {
  const utcDate = new Date(utcString); // This handles UTC properly

  const diff = Math.abs(currentTime.getTime() - utcDate.getTime());

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 60000) % 60);
  const hours = Math.floor((diff / 3600000) % 24);
  const days = Math.floor(diff / 86400000);

  let timeString = "";
  if (days > 0) timeString = `${days}d`;
  else if (hours > 0) timeString = `${hours}h`;
  else if (minutes > 0) timeString = `${minutes}m`;
  else timeString = `${seconds}s`;
  const isRecent = minutes < 10 && hours === 0 && days === 0;

  return {
    time: timeString,
    isRecent
  }
}


function getTimeAgo(dateString, addAgo = true) {
  const now = new Date().getTime(); // Current UTC timestamp
  const past = new Date(dateString).getTime(); // UTC timestamp of the input

  if (past > now) return `0s${addAgo ? " ago" : ""}`; // Handle future dates gracefully

  const diffInSeconds = Math.floor((now - past) / 1000);
  const suffix = addAgo ? " ago" : "";

  if (diffInSeconds < 60) return `${diffInSeconds}s${suffix}`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m${suffix}`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h${suffix}`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d${suffix}`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo${suffix}`;

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}yrs${suffix}`;
}

function decimalConvert(price) {
  const [integerPart, decimalPart] = Number(price).toFixed(11).split(".");
  const leadingZeros = decimalPart?.match(/^0*/)[0].length;

  if (leadingZeros > 3 && integerPart == 0) {
    const m = -Math.floor(Math.log10(price) + 1);

    // Generate subscript dynamically
    const subscript = m
      .toString()
      .replace(/-/g, " ₋ ") // Replace negative sign with subscript
      .replace(/\d/g, (digit) => String.fromCharCode(8320 + parseInt(digit)));

    const decimalNumber = decimalPart?.slice(leadingZeros).slice(0, 3); // Get significant digits after leading zeros
    // const finalAmount = `${integerPart}.0${subscript}${decimalNumber}`;
    // return finalAmount;
    return {
      main: `${integerPart}.0`,
      subscript,
      decimalNumber,
    };
  } else {
    // return Number(price).toFixed(5);
    return { main: Number(price).toFixed(5), subscript: "", decimalNumber: "" };
  }
}

const formatNumberNoLoop = (num) => {
  const number = Number(num);

  // Return "0" if it's NaN or exactly 0
  if (isNaN(number) || number === 0) return "0";

  // Handle numbers between -1 and 1 (but not 0)
  if (Math.abs(number) < 1) return number.toPrecision(2);

  const suffixes = ["", "K", "M", "B", "T", "Q", "Qi", "S", "Sp", "O"];

  // Ensure number isn't 0 before using log10
  const exponent = Math.floor(Math.log10(Math.abs(number)) / 3);
  const i = Math.max(0, Math.min(exponent, suffixes.length - 1)); // Ensure valid index

  const scaled = Math.abs(number) / Math.pow(1000, i);
  const formattedNum = parseFloat(scaled.toFixed(1)); // This removes trailing ".0" if unnecessary

  return `${number < 0 ? "-" : ""}${formattedNum}${suffixes[i]}`;
};

function convertUTCToIST(utcTimestamp) {
  const date = new Date(utcTimestamp);

  // Convert to IST by adding 5 hours 30 minutes
  const istOffset = 5.5 * 60; // IST offset in minutes
  const istDate = new Date(date.getTime() + istOffset * 60000);

  // Format date and time
  const day = String(istDate.getDate()).padStart(2, "0");
  const month = String(istDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = istDate.getFullYear();

  let hours = istDate.getHours();
  const minutes = String(istDate.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format

  const time = `${hours}:${minutes} ${ampm}`;
  const formattedDate = `${day}-${month}-${year}`;

  return `${formattedDate}, ${time}`;
}
export {
  getDateMinus24Hours,
  getDateMinusMinutes,
  calculatePercentageChange,
  convertToRelativeTime,
  calculateTimeDifference,
  humanReadableFormat,
  humanReadableFormatWithOutUsd,
  calculateHoldersPercentage,
  calculateHoldersPercentageWithoutPercentage,
  UpdateTime,
  decimalConvert,
  formatNumberNoLoop,
  getTimeAgo,
  convertUTCToIST,
  convertUTCToLocalTimeString,
  UpdateTimeViaUTCWithCustomTime
};
