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

export { humanReadableFormat, humanReadableFormatNoDollar, decimalConvert, humanReadableFormatWithNoDollar };
