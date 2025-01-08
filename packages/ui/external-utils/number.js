/*
Here's a JavaScript function that uses regular expressions to add a . once, at a specific position, and a , after every three digits in a decimal input string, while excluding the addition of a , after the ., removing any preceding zeros, and removing a comma from the left end and preceding zeros after that:
All optimized by ChatGPT-3:
*/
export const toHuman = (str, digits, fixed) => {
  return str.replace(
    new RegExp(`(\\d*)(\\d{${digits}})(.*)`),
    (match, p1, p2) => {
      const formattedP1 = p1
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        .replace(/^0+/, "");
      return `${
        formattedP1 === "" ? formattedP1 : formattedP1.replace(/^,/, "")
      }.${p2.slice(0, fixed + 1)}`;
    }
  );
};

export function roundDownToDecimalPlaces(number, decimalPlaces) {
  const multiplier = 10 ** decimalPlaces;
  return Number.parseFloat(
    (Math.floor(number * multiplier) / multiplier).toFixed(decimalPlaces)
  );
}

export function roundUpToDecimalPlaces(number, decimalPlaces) {
  const multiplier = 10 ** decimalPlaces;
  return Number.parseFloat(
    Math.ceil(number * multiplier) / multiplier.toFixed(decimalPlaces)
  );
}

export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const addDecimalNotation = (str, digits) => {
  return str.replace(new RegExp(`(\\d*)(\\d{${digits}})(.*)`), "$1.$2");
};

export const textNotation = (x) => {
  const [integer, decimal] = x.toString().split(".");
  // remove trailing zeros in decimal
  if (decimal && decimal.length > 0) {
    const removed = decimal.replace(/0+$/, "");
    return removed.length === 0
      ? numberWithCommas(integer)
      : `${numberWithCommas(integer)}.${removed.slice(0, 4)}`;
  }
  return numberWithCommas(integer);
};

export const roundToThirdDecimal = (num) => {
  const n =
    num < 0.001
      ? Number.parseFloat(
          roundDownToDecimalPlaces(num, 8).toFixed(8)
        ).toString()
      : Number.parseFloat(
          roundDownToDecimalPlaces(num, 3).toFixed(3)
        ).toString();
  return Number.isNaN(n) ? "0" : n;
};

export function roundToFifthDecimal(num) {
  return num < 0.00001
    ? Number.parseFloat(roundDownToDecimalPlaces(num, 8).toFixed(8))
    : Number.parseFloat(roundDownToDecimalPlaces(num, 5).toFixed(5));
}

/**
 * Adjusts a number to the specified digit.
 *
 * @param {"round" | "floor" | "ceil"} type The type of adjustment.
 * @param {number} value The number.
 * @param {number} exp The exponent (the 10 logarithm of the adjustment base).
 * @returns {number} The adjusted value.
 */
export function decimalAdjust(type, value, exp) {
  const adjustmentType = String(type);
  if (!["round", "floor", "ceil"].includes(adjustmentType)) {
    throw new TypeError(
      "The type of decimal adjustment must be one of 'round', 'floor', or 'ceil'."
    );
  }
  const expNumber = Number(exp);
  const numValue = Number(value);
  if (exp % 1 !== 0 || Number.isNaN(numValue)) {
    return Number.NaN;
  }
  if (exp === 0) {
    return Math[type](value);
  }
  const [magnitude, exponent = 0] = numValue.toString().split("e");
  const adjustedValue = Math[adjustmentType](`${magnitude}e${exponent - expNumber}`);
  // Shift back
  const [newMagnitude, newExponent = 0] = adjustedValue.toString().split("e");
  return Number(`${newMagnitude}e${+newExponent + expNumber}`);
}

export const formatVolume = (num) => {
  if (num === "") {
    return "";
  }
  if (num === undefined || num === null || Number.isNaN(num)) {
    return "0";
  }
  if (num >= 1e51) {
    return `${(num / 1e51).toFixed(2)}Sxd`;
  }
  if (num >= 1e48) {
    return `${(num / 1e48).toFixed(2)}Qid`;
  }
  if (num >= 1e45) {
    return `${(num / 1e45).toFixed(2)}Qad`;
  }
  if (num >= 1e42) {
    return `${(num / 1e42).toFixed(2)}Td`;
  }
  if (num >= 1e39) {
    return `${(num / 1e39).toFixed(2)}Ddc`;
  }
  if (num >= 1e36) {
    return `${(num / 1e36).toFixed(2)}Ud`;
  }
  if (num >= 1e33) {
    return `${(num / 1e33).toFixed(2)}Dc`;
  }
  if (num >= 1e30) {
    return `${(num / 1e30).toFixed(2)}Nn`;
  }
  if (num >= 1e27) {
    return `${(num / 1e27).toFixed(2)}Oc`;
  }
  if (num >= 1e24) {
    return `${(num / 1e24).toFixed(2)}Sp`;
  }
  if (num >= 1e21) {
    return `${(num / 1e21).toFixed(2)}Sx`;
  }
  if (num >= 1e18) {
    return `${(num / 1e18).toFixed(2)}Qi`;
  }
  if (num >= 1e15) {
    return `${(num / 1e15).toFixed(2)}Q`;
  }
  if (num >= 1e12) {
    return `${(num / 1e12).toFixed(2)}T`;
  }
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  try {
    const fixed = Number.parseFloat(
      roundDownToDecimalPlaces(num, 8).toFixed(8)
    ).toString();
    return fixed;
  } catch (error) {
    return "";
  }
};
