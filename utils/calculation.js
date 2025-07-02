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
  return date.toLocaleTimeString("en-GB", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
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

  return withDollar
    ? `$${displayStr}${units[unitIndex]}`
    : `${displayStr}${units[unitIndex]}`;
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
    isRecent,
  };
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

// function to calculate rec. amount
function calculateRecAmountSolToAnytoken(
  amountToken1,
  priceToken1,
  priceToken2
) {
  if (priceToken2 === 0) {
    throw new Error("Price of token 2 cannot be zero");
  }
  const usdValue = Number(amountToken1) * Number(priceToken1);
  const amountToken2 = usdValue / Number(priceToken2);
  if (amountToken2 > 1) {
    return Number(amountToken2.toFixed(2));
  } else {
    return Number(amountToken2.toFixed(6));
  }
}

export {
  convertToRelativeTime,
  calculateTimeDifference,
  humanReadableFormat,
  humanReadableFormatWithOutUsd,
  calculateHoldersPercentage,
  UpdateTime,
  decimalConvert,
  convertUTCToLocalTimeString,
  UpdateTimeViaUTCWithCustomTime,
  calculateRecAmountSolToAnytoken,
};
