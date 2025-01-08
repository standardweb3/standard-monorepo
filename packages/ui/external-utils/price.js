import { DefaultTokenListChains } from "@/enums";
import { parseUnits } from "./trading";

export const getTokenPrice = async (wrapped, networkName) => {
  const input = {
    chain: DefaultTokenListChains[networkName],
    wrapped,
  };
  try {
    const response = await fetch("/api/native/nativeTokenPrice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    const { data } = await response.json();
    return data.current_price;
  } catch (error) {
    console.error("Error:", error);
  }
};

export function ceilOneDigit10(number) {
  const digit = number.toString();
  
  return 10 ** (digit.length);
}

export const convert = (isBid, base, quote, price, amountD) => {
  if (price === 0) return 0n;
  if (amountD == null) return 0n;
  const amount = parseUnits(amountD.toString(), isBid ? quote.decimals : base.decimals);
  formattedPrice = parseUnits(price.toString(), 8);
  const baseBquote = base.decimals > quote.decimals;
  const decDiff = baseBquote ? BigInt(10**(base.decimals - quote.decimals)) : BigInt(10**(quote.decimals - base.decimals));
  if (isBid) {
    // convert base to quote
    return baseBquote
      ? (amount * formattedPrice) / BigInt(1e8) / decDiff
      : (amount * formattedPrice) / BigInt(1e8) * decDiff;
  }
    // convert quote to base
    return baseBquote
      ? (amount * BigInt(1e8) / formattedPrice) * decDiff
      : (amount * BigInt(1e8) / formattedPrice) / decDiff;
};
