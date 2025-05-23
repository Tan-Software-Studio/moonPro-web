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

//  NoDollar function
function humanReadableFormatNoDollar(number, decimals = 0) {
  const units = ["", "K", "M", "B", "T"];
  let unitIndex = 0;
  number = parseFloat(number);

  if (isNaN(number)) {
    return "0";
  }
  number /= Math.pow(10, decimals);

  while (Math.abs(number) >= 1000 && unitIndex < units.length - 1) {
    number /= 1000;
    unitIndex++;
  }
  number = Math.trunc(number);
  return `${number}${units[unitIndex]}`;
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

function formatDecimal(num) {
  // Defensive check to ensure input is a finite number
  if (typeof num !== 'number' || !isFinite(num)) {
    console.warn('Invalid input to formatDecimal:', num);
    return ''; // Or return a fallback like '–'
  }

  if (num >= 1 || num <= -1 || num === 0) {
    return num.toString();
  }

  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const decimalStr = absNum.toFixed(20).split('.')[1];
  const leadingZerosMatch = decimalStr.match(/^0*/);
  const leadingZeros = leadingZerosMatch[0].length;
  const trimmed = decimalStr.slice(leadingZeros);

  const subscripts = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };

  function toSubscript(n) {
    return String(n).split('').map(d => subscripts[d] || d).join('');
  }

  let result;
  if (leadingZeros > 2) {
    result = `0${toSubscript(leadingZeros)}${trimmed.slice(0, 3)}`;
  } else {
    result = `0.${decimalStr.slice(0, 3)}`;
  }

  return isNegative ? `-${result}` : result;
}


export { humanReadableFormat, humanReadableFormatNoDollar, decimalConvert, humanReadableFormatWithNoDollar, formatDecimal };
