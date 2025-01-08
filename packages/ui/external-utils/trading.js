import { roundToThirdDecimal } from "./number";

export function parseEther(value) {
  return parseUnits(value, 18);
}

/**
 * Multiplies a string representation of a number by a given exponent of base 10 (10exponent).
 *
 * - Docs: https://viem.sh/docs/utilities/parseUnits
 *
 * @example
 * import { parseUnits } from 'viem'
 *
 * parseUnits('420', 9)
 * // 420000000000n
 */
export function parseUnits(value, decimals) {
  const parsedValue = Number.parseFloat(value);
  const formattedValue = Number.isNaN(parsedValue)
    ? "0"
    : value.includes("e")
    ? new Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: 18,
        useGrouping: false,
      }).format(parsedValue)
    : value;

  let [integer, fraction = "0"] = formattedValue.split(".");

  const negative = integer.startsWith("-");
  if (negative) integer = integer.slice(1);

  // trim trailing zeros.
  fraction = fraction.replace(/(0+)$/, "");

  // round off if the fraction is larger than the number of decimals.
  if (decimals === 0) {
    if (Math.round(Number(`.${fraction}`)) === 1)
      integer = `${BigInt(integer) + 1n}`;
    fraction = "";
  } else if (fraction.length > decimals) {
    const [left, unit, right] = [
      fraction.slice(0, decimals - 1),
      fraction.slice(decimals - 1, decimals),
      fraction.slice(decimals),
    ];

    const rounded = Math.round(Number(`${unit}.${right}`));
    if (rounded > 9)
      fraction = `${BigInt(left) + BigInt(1)}0`.padStart(left.length + 1, "0");
    else fraction = `${left}${rounded}`;

    if (fraction.length > decimals) {
      fraction = fraction.slice(1);
      integer = `${BigInt(integer) + 1n}`;
    }

    fraction = fraction.slice(0, decimals);
  } else {
    fraction = fraction.padEnd(decimals, "0");
  }

  return BigInt(`${negative ? "-" : ""}${integer}${fraction}`);
}

// TODO: setup measure that it does not affect trading
export function checkMarketPrice(
  isBuy,
  marketPrice,
  bidHeadPrice,
  askHeadPrice,
  base,
  quote
) {
  const bidPrice = bidHeadPrice === 0 ? marketPrice : bidHeadPrice;
  const askPrice = askHeadPrice === 0 ? marketPrice : askHeadPrice;
  const marketRate =
    base !== undefined && quote !== undefined
      ? base.current_price / quote.current_price
      : marketPrice;
  if (isBuy) {
    if (marketRate < askPrice * 0.9) {
      return "set up limit order";
    }
    if (bidPrice < marketRate * 0.7 && askPrice < marketRate * 0.7) {
      return "set up limit order with manipulation";
    }
  } else {
    if (marketRate > bidPrice * 1.1) {
      return "set up limit order";
    }
    if (bidPrice < marketRate * 0.7) {
      return "set up limit order with manipulation";
    }
    if (bidPrice < marketRate * 0.7 && askPrice < marketRate * 0.7) {
      return "set up limit order with manipulation";
    }
  }
  return "";
}

export function checkLimitPrice(
  isBuy,
  marketPrice,
  bidHeadPrice,
  askHeadPrice,
  base,
  quote,
  limitPrice
) {
  const marketRate =
    base !== undefined && quote !== undefined
      ? base.current_price / quote.current_price
      : marketPrice;
  const bidPrice = bidHeadPrice === 0 ? marketPrice : bidHeadPrice;
  const askPrice = askHeadPrice === 0 ? marketPrice : askHeadPrice;
  if (base !== undefined && quote !== undefined) {
    if (isBuy) {
      if (limitPrice < (marketRate * 9) / 10) {
        return "Invalid price"; // invalid low limit price
      }
      if (limitPrice >= 1.3 * marketRate) {
        return "High limit price"; // high limit price
      }
      return "";
    }
  } else {
    if (limitPrice > (marketRate * 11) / 10) {
      return "Invalid price";
    }
    if (limitPrice <= marketRate / 10) {
      return "Invalid price";
    }
    return "";
  }
}

export function calculateDanger(spreadPercentage) {
  if (spreadPercentage < 1) {
    return "green-500";
  }
  if (spreadPercentage < 5) {
    return "orange-500";
  }
  return "red-500";
}

export function checkSpread(isBuy, bidHeadPrice, askHeadPrice, marketPrice) {
  const { bidSpread, askSpread, bidSpreadPercentage, askSpreadPercentage } =
    calculateSpread(bidHeadPrice, askHeadPrice, marketPrice);
  return isBuy
    ? Math.abs(askSpreadPercentage) > 10
    : Math.abs(bidSpreadPercentage) > 10;
}

export function calculateSpread(bidHeadPrice, askHeadPrice, marketPrice) {
  const bidPrice = bidHeadPrice === undefined ? marketPrice : bidHeadPrice;
  const askPrice = askHeadPrice === undefined ? marketPrice : askHeadPrice;
  // Check if bid and ask prices are not equal
  if (bidPrice !== askPrice) {
    // Calculate bid and ask spreads
    const bidSpread = roundToThirdDecimal(bidPrice - askPrice);
    const askSpread = roundToThirdDecimal(askPrice - bidPrice);
    const bidAskSpread = roundToThirdDecimal(askPrice - bidPrice);

    // Calculate bid and ask spread percentages
    const bidSpreadPercentage = ((bidSpread / askPrice) * 100).toFixed(2);
    const askSpreadPercentage = ((askSpread / bidPrice) * 100).toFixed(2);
    const bidAskSpreadPercentage = ((bidAskSpread / askPrice) * 100).toFixed(2);

    // Return an object with both spread values and percentages
    return {
      bidSpread: bidAskSpread,
      askSpread: bidAskSpread,
      bidSpreadPercentage: bidAskSpreadPercentage,
      askSpreadPercentage: bidAskSpreadPercentage,
    };
  }
  // Handle the case where bid and ask prices are equal
  return {
    bidSpread: 0,
    askSpread: 0,
    bidSpreadPercentage: 0,
    askSpreadPercentage: 0,
    // or use a special value to indicate undefined
  };
}

export function calculateBestBidOrAsk(
  isBuy,
  isLimit,
  marketPrice,
  askHeadPrice,
  bidHeadPrice
) {
  return isBuy
    ? !isLimit
      ? `${roundToThirdDecimal(marketPrice)}`
      : `${roundToThirdDecimal(
          askHeadPrice === undefined || askHeadPrice === 0
            ? marketPrice
            : askHeadPrice
        )}`
    : !isLimit
    ? `${roundToThirdDecimal(marketPrice)}`
    : `${roundToThirdDecimal(
        bidHeadPrice === undefined || bidHeadPrice === 0
          ? marketPrice
          : bidHeadPrice
      )}`;
}
