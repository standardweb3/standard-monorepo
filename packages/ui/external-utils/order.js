import { decimalAdjust } from "./number";
export const OrderbookScales = [
  { value: 0.000001, label: "0.000001" },
  { value: 0.00001, label: "0.00001" },
  { value: 0.0001, label: "0.0001" },
  { value: 0.001, label: "0.001" },
  { value: 0.01, label: "0.01" },
  { value: 0.1, label: "0.1" },
  { value: 1, label: "1" },
  { value: 10, label: "10" },
  { value: 100, label: "100" },
];

export const OrderbookScalesDigit = [
  { value: -6, label: "0.000001" },
  { value: -5, label: "0.00001" },
  { value: -4, label: "0.0001" },
  { value: -3, label: "0.001" },
  { value: -2, label: "0.01" },
  { value: -1, label: "0.1" },
  { value: 0, label: "1" },
  { value: 1, label: "10" },
  { value: 2, label: "100" },
];

export const computeOrderbookScale = (price) => {
  // find the suspension range as it is default 0.1% of the price
  const suspensionRange = price / 1000;
  // find the scale that is bigger than the suspension range
  const scale = OrderbookScales.find((item) => suspensionRange < item.value);
  return scale ? scale.value : 0.000001;
}

export const computeOrderbook = (data, scale, limit, isSingle) => {
  const marketPrice = data.mktPrice;

  const rawBids = data.bids;
  const rawAsks = data.asks;

  // filter bids below market price
  const bids = rawBids.filter((bid) => bid.price <= marketPrice);
  // filter asks above market price
  const asks = rawAsks.filter((ask) => ask.price >= marketPrice);

  const scaleString = scale.toString();
  const decimalDigits = OrderbookScalesDigit.find(
    (item) => item.label === scaleString
  )?.value;

  const roundedMktBidStartPrice = decimalAdjust("floor", marketPrice, decimalDigits);
  const roundedMktBidPrice = roundedMktBidStartPrice === marketPrice ? decimalAdjust(
    "round",
    roundedMktBidStartPrice - scale * 1,
    decimalDigits
  ) : roundedMktBidStartPrice;

  const roundedMktAskPrice = decimalAdjust("ceil", marketPrice, decimalDigits);

  // now fill in the aggregated amount between mktprice and scale
  const aggregatedBids = [];
  const aggregatedAsks = [];

  // now fill in the aggregated amount between mktprice and scale
  for (let i = 0; i < (isSingle ? limit : limit / 2); i++) {
    const bidPrice = decimalAdjust(
      "round",
      roundedMktBidPrice - scale * i,
      decimalDigits
    );
    const askPrice = decimalAdjust(
      "round",
      roundedMktAskPrice + scale * i,
      decimalDigits
    );
    const bidPrevPrice = decimalAdjust(
      "round",
      roundedMktBidPrice - scale * (i - 1),
      decimalDigits
    );
    const askNextPrice = decimalAdjust(
      "round",
      roundedMktAskPrice + scale * (i + 1),
      decimalDigits
    );

    const { groupedBidsQuoteAmount, groupedBidsCount } = bids
      .filter((bid) => bid.price > bidPrice && bid.price <= bidPrevPrice)
      .reduce(
        (acc, bid) => {
          acc.groupedBidsQuoteAmount += bid.amount;
          acc.groupedBidsCount += bid.count;
          return acc;
        },
        { groupedBidsQuoteAmount: 0, groupedBidsCount: 0 }
      );
    const groupedBidsBaseAmount = groupedBidsQuoteAmount / bidPrice;
    const { groupedAsksBaseAmount, groupedAsksCount } = asks
      .filter((ask) => ask.price < askNextPrice && ask.price >= askPrice)
      .reduce(
        (acc, ask) => {
          acc.groupedAsksBaseAmount += ask.amount;
          acc.groupedAsksCount += ask.count;
          return acc;
        },
        { groupedAsksBaseAmount: 0, groupedAsksCount: 0 }
      );
    const groupedAsksQuoteAmount = groupedAsksBaseAmount * askPrice;

    // get the accumulated amount from previous iteration, consider the case when the previous iteration is empty
    let accBidBaseAmount = 0;
    let accBidQuoteAmount = 0;
    let accBidOrderCount = 0;
    let accAskBaseAmount = 0;
    let accAskQuoteAmount = 0;
    let accAskOrderCount = 0;
    const prevBid = aggregatedBids[aggregatedBids.length - 1];
    const prevAsk = aggregatedAsks[aggregatedAsks.length - 1];

    accBidBaseAmount = prevBid
      ? prevBid.accBaseAmount + groupedBidsBaseAmount
      : groupedBidsBaseAmount;
    accBidQuoteAmount = prevBid
      ? prevBid.accQuoteAmount + groupedBidsQuoteAmount
      : groupedBidsQuoteAmount;
    accBidOrderCount = prevBid
      ? prevBid.accOrderCount + groupedBidsCount
      : groupedBidsCount;

    accAskBaseAmount = prevAsk
      ? prevAsk.accBaseAmount + groupedAsksBaseAmount
      : groupedAsksBaseAmount;
    accAskQuoteAmount = prevAsk
      ? prevAsk.accQuoteAmount + groupedAsksQuoteAmount
      : groupedAsksQuoteAmount;
    accAskOrderCount = prevAsk
      ? prevAsk.accOrderCount + groupedAsksCount
      : groupedAsksCount;

    if (bidPrice > 0 && !aggregatedBids.find((bid) => bid.price === bidPrice)) {
      aggregatedBids.push({
        id: i,
        price: bidPrice,
        avgPrice: Number.isNaN(accBidQuoteAmount / accBidBaseAmount) || accBidBaseAmount === 0 ? 0 : accBidQuoteAmount / accBidBaseAmount,
        baseAmount: groupedBidsBaseAmount ?? 0,
        quoteAmount: groupedBidsQuoteAmount ?? 0,
        accBaseAmount: accBidBaseAmount,
        accQuoteAmount: accBidQuoteAmount,
        accOrderCount: accBidOrderCount,
      });
    }
    if (!aggregatedAsks.find((ask) => ask.price === askPrice)) {
      aggregatedAsks.push({
        id: i,
        price: askPrice,
        avgPrice: Number.isNaN(accAskQuoteAmount / accAskBaseAmount) || accAskBaseAmount === 0 ? 0 : accAskQuoteAmount / accAskBaseAmount,
        baseAmount: groupedAsksBaseAmount ?? 0,
        quoteAmount: groupedAsksQuoteAmount ?? 0,
        accBaseAmount: accAskBaseAmount,
        accQuoteAmount: accAskQuoteAmount,
        accOrderCount: accAskOrderCount,
      });
    }
  }

  const lastBid = aggregatedBids.pop();
  const lastAsk = aggregatedAsks.pop();
  const totalBidAmount = lastBid ? lastBid.accBaseAmount : 0;
  const totalAskAmount = lastAsk ? lastAsk.accBaseAmount : 0;
  const bidPercentage =
    (totalBidAmount * 100) / (totalBidAmount + totalAskAmount);
  const askPercentage =
    (totalAskAmount * 100) / (totalBidAmount + totalAskAmount);

  // figure out progress limit for the progress bar on base Amount
  const bidProgressLimit = lastBid?.accBaseAmount;
  const askProgressLimit = lastAsk?.accBaseAmount;

  // compute progress bar for each tick
  for (const bid of aggregatedBids) {
    bid.progress = bid.baseAmount === 0 ? 100 : ((bidProgressLimit - bid.baseAmount) * 100) / bidProgressLimit;
    bid.accProgress =
      bid.accBaseAmount === 0 ? 100 : ((bidProgressLimit - bid.accBaseAmount) * 100) / bidProgressLimit;
  }

  for (const ask of aggregatedAsks) {
    ask.progress = ask.baseAmount === 0 ? 100 : ((askProgressLimit - ask.baseAmount) * 100) / askProgressLimit;
    ask.accProgress =
      ask.accBaseAmount === 0 ? 100 : ((askProgressLimit - ask.accBaseAmount) * 100) / askProgressLimit;
  }

  return {
    orderbook: data?.id,
    mktPrice: marketPrice,
    bidHead: aggregatedBids[0]?.price,
    askHead: aggregatedAsks[0]?.price,
    bids: aggregatedBids,
    asks: aggregatedAsks.reverse(),
    totalBidTicks: aggregatedBids.length,
    totalAskTicks: aggregatedAsks.length,
    bidPercentage,
    askPercentage,
    bidProgressLimit,
    askProgressLimit,
    lastUpdated: Date.now(),
  };
};

export const truncateTxHash = (hash) => {
  if (hash === undefined) {
    return "";
  }
  const truncatedHash = `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  return truncatedHash;
};

import { Parser } from "json2csv";

export const exportToCSV = (data, fileName) => {
  const fields = Object.keys(data[0]); // Automatically get fields from the first object
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);

  // Create a blob from the CSV string
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${fileName}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
