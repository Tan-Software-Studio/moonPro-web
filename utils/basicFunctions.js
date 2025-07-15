function humanReadableFormat(number) {
  const units = ["", "K", "M", "B", "T"];
  let unitIndex = 0;

  number = parseFloat(number);

  if (isNaN(number)) {
    return "$0.00";
  }

  while (Math.abs(number) >= 1000 && unitIndex < units.length - 1) {
    number /= 1000;
    unitIndex++;
  }

  return `$${number.toFixed(2)}${units[unitIndex]}`;
}

// dynamic decimals
function humanReadableFormatWithNoDollar(number, decimal) {
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

  return `${number.toFixed(decimal)}${units[unitIndex]}`;
}

// convert
function decimalConvert(price) {
  const [integerPart, decimalPart] = Number(price).toFixed(11).split(".");
  const leadingZeros = decimalPart?.match(/^0*/)[0].length;

  if (leadingZeros > 4 && integerPart == 0) {
    const m = -Math.floor(Math.log10(price) + 1);
    const decimalNumber = Number(decimalPart);
    const finalAmount = `${integerPart}.0(${m})${decimalNumber
      .toString()
      .slice(0, 4)}`;
    return finalAmount;
  } else {
    return Number(price).toFixed(5);
  }
}

function formatDecimal(num, numAfterCount = 3) {
  // Defensive check to ensure input is a finite number
  if (typeof num !== "number" || !isFinite(num)) {
    // console.warn("Invalid input to formatDecimal:", num);
    return 0;
  }

  if (num >= 1 || num <= -1 || num === 0) {
    return num.toFixed(numAfterCount); // Round like toFixed
  }

  const isNegative = num < 0;
  const absNum = Math.abs(num);

  // Round number to (leading zeros + numAfterCount) digits to avoid precision issues
  const fullPrecision = 20;
  const roundedStr = absNum.toFixed(fullPrecision);
  const decimalStr = roundedStr.split(".")[1];
  const leadingZerosMatch = decimalStr.match(/^0*/);
  const leadingZeros = leadingZerosMatch[0].length;

  const totalPrecision = leadingZeros + numAfterCount;
  const rounded = Number(absNum.toFixed(totalPrecision)).toFixed(totalPrecision).split(".")[1];
  const trimmed = rounded.slice(leadingZeros);

  const subscripts = {
    0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄",
    5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉",
  };

  function toSubscript(n) {
    return String(n)
      .split("")
      .map((d) => subscripts[d] || d)
      .join("");
  }

  let result;
  if (leadingZeros > 2) {
    // Check if rounding caused a carry-over to the next significant digit
    if (Number(trimmed) === 0 && absNum.toFixed(totalPrecision - 1) >= 1e-20) {
      // Adjust for carry-over by reducing leading zeros and setting trimmed to 1
      result = `0.0${toSubscript(leadingZeros - 1)}1`;
    } else {
      result = `0.0${toSubscript(leadingZeros)}${trimmed}`;
    }
  } else {
    result = `${absNum.toFixed(3)}`;
  }

  return isNegative ? `-${result}` : result;
}


function calculatePercentageDifference(newValue, oldValue) {
  if (oldValue == 0) {
    return 0;
  }
  const change = ((newValue - oldValue) / oldValue) * 100;
  return change;
}

function convertAnyPriceToSol(tokenPrice, solPriceUSD) {
  return tokenPrice / solPriceUSD;
}
function numberFormated(value) {
  return parseFloat(value).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}
function capitalizeFirstLetter(str) {
  str = str.toLowerCase(); // convert whole string to lowercase
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const formatNumber = (amount, addSign = true, addDollar = true) => {
    const absoluteAmount = Math.abs(amount);
    const formattedAmount = absoluteAmount > 1 || absoluteAmount < -1
      ? humanReadableFormatWithNoDollar(absoluteAmount, 2)
      : formatDecimal(absoluteAmount, 1);
    let sign = "";
    if (amount < 0) {
      sign = "-";
    } else if (addSign) {
      sign = "+";
    }

    return `${sign}${addDollar ? "$" : ""}${formattedAmount}`
  };

  function shortenText(str, length) {
    if (!str) return '';
    return str.length > length ? str.slice(0, length).trim() + '...' : str;
  }

  function toNumber(value) {
    if (typeof value === 'number') {
      return !isNaN(value) ? value : 0;
    }
    if (typeof value === 'string') {
      const lower = value.toLowerCase().trim();
      let multiplier = 1;
      if (lower.includes('b')) multiplier = 1_000_000_000;
      else if (lower.includes('m')) multiplier = 1_000_000;
      else if (lower.includes('k')) multiplier = 1_000;

      const numberPart = lower.replace(/[^0-9.]/g, '');
      const parsed = Number(numberPart);
      const finalNumber = !isNaN(parsed) ? parsed * multiplier : 0;
      return finalNumber;
    }
    return 0;
  }

export {
  humanReadableFormat,
  decimalConvert,
  humanReadableFormatWithNoDollar,
  formatDecimal,
  calculatePercentageDifference,
  convertAnyPriceToSol,
  numberFormated,
  capitalizeFirstLetter,
  formatNumber,
  shortenText,
  toNumber
};
