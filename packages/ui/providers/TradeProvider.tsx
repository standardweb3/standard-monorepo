// @ts-nocheck
"use client";
import { useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { ChainIds, PonderLinks } from "enums";
import { useERC20BalanceAllowance } from "@/hooks/account/useERC20BalanceAllowance";
import {
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
} from "wagmi";
import MatchingEngineABI from "@/components/abis/MatchingEngine.json";
import { roundToThirdDecimal } from "@/utils/number";
import { parseEther, parseUnits } from "@/utils/trading";
import { erc20Abi } from "viem";
import TradeDetail from "@/components/account/orders/modal_contents/TradeDetail";
import SelectTradeCrypto from "@/components/trade/modal_contents/SelectTradeCrypto";
import ResponsiveModal from "@/components/modals/ResponsiveModal";
import ReviewTradeModal from "@/components/modals/ReviewTradeModal";
import ReviewTrade from "@/components/trade/modal_contents/ReviewTrade";
import { useHeadPrices } from "@/hooks/trade/useHeadPrices";
import { calculateSpread } from "@/utils/trading";
import useNetworkAccount from "@/hooks/network/useNetworkAccount";
import Navbar from "@/components/navbar/Navbar";
import SparkleLoader from "@/components/loaders/SparkleLoader";
import { useRecentOverallTradePaginated } from "@/hooks/trade/useRecentOverallTradePaginated";
import { usePairs } from "@/hooks/pair/usePairs";
import { useAccountOrdersPaginated } from "@/hooks/orders/useAccountOrdersPaginated";
import { useAccountTradeHistoryPaginated } from "@/hooks/trade/useAccountTradeHistoryPaginated";
import { useTokenlistBalances } from "@/hooks/account/useTokenlistBalances";
import { useOrderbook } from "@/hooks/orderbook/useOrderbook";
import SelectTradePair from "@/components/trade/modal_contents/SelectTradePair";
import { useOHLCVTotal } from "@/hooks/ohlcv/useOHLCVTotal";
import defaultTokenList from "@standardweb3/default-token-list";
import { useRecentPairTradePaginated } from "@/hooks/trade/useRecentPairTradePaginated";
import { isNative } from "@/utils";
import { fetchOHLCVTotal } from "@/queries";
import { computeOrderbookScale } from "@/utils/order";

// Create a context to use the query functions outside the provider
const QueryContext = createContext(null);

export const TradeProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, isConnected, chain, router] = useNetworkAccount();

  // supported networks
  const supportedNetworks = Object.keys(defaultTokenList.matchingEngine);
  const networkName: string =
    chain !== undefined && supportedNetworks.includes((chain as { name: string }).name)
      ? (chain as {name: string}).name
      : "Base";

  // console.log(supportedNetworks, networkName, "networkName");

  // constants
  const matchingEngine = defaultTokenList.matchingEngine[networkName].address;
  const scannerUrl = defaultTokenList.scannerLink[networkName];
  const nativeToken = defaultTokenList.nativeToken[networkName];

  // Base and quote state
  const [base, setBase] = useState(
    defaultTokenList.defaultPair[networkName].base
  );
  const [quote, setQuote] = useState(
    defaultTokenList.defaultPair[networkName].quote
  );

  // useEffect to set default base and quote on network change
  useEffect(() => {
    setBase(defaultTokenList.defaultPair[networkName].base);
    setQuote(defaultTokenList.defaultPair[networkName].quote);
  }, [networkName]);

  const [isBuy, setIsBuy] = useState(true);

  const handleBuySellToggle = (isBuy: boolean) => {
    setIsBuy(isBuy);
  };

  // Each asset amount state
  const [baseAmount, setBaseAmount] = useState(0);
  const [quoteAmount, setQuoteAmount] = useState(0);

  // Matching order count state, default matching count is 2
  const [matchN, setMatchN] = useState(2);

  // Display state from trade widget for price
  const [priceDisplay, setPriceDisplay] = useState("");

  // Display state from trade widget for base/quote amount
  const [baseDisplay, setBaseDisplay] = useState("");
  const [quoteDisplay, setQuoteDisplay] = useState("");

  // get orderbook data from matching engine
  const {
    data: orderbook,
    scale: initScale,
    marketPrice,
    bidHeadPrice,
    askHeadPrice,
    status: orderbookStatus,
    error: orderbookError,
    queryKey: orderbookQueryKey,
    refetch: refetchOrderbook,
  } = useOrderbook(networkName, base, quote);
  const [scale, setScale] = useState(initScale);

  useEffect(() => {
    setScale(initScale);
  }, [initScale]);

  // Price state
  const [limitPrice, setLimitPrice] = useState(
    roundToThirdDecimal(marketPrice ?? 0)
  );

  // console.log(orderbook, quote, "orderbook");

  // determine initial order type with market order
  const [isLimit, setIsLimit] = useState(true);

  const rate: string = roundToThirdDecimal(isLimit ? limitPrice : marketPrice);

  const spread = calculateSpread(bidHeadPrice, askHeadPrice, marketPrice);

  const [bAmount, qAmount] = [
    isBuy
      ? Number.parseFloat(rate) === 0 || Number.isNaN(Number.parseFloat(rate))
        ? 0
        : Number.parseFloat(quoteAmount) / Number.parseFloat(rate)
      : Number.parseFloat(baseAmount),
    isBuy ? Number.parseFloat(quoteAmount) : Number.parseFloat(rate) * Number.parseFloat(baseAmount),
  ];

  const {
    data: tokenlist,
    holdings,
    status,
    error,
    queryKey: tokenlistBalanceQueryKey,
    refetch: refetchTokenlistBalance,
  } = useTokenlistBalances(networkName, address as any, nativeToken);

  // Set the initial state of base once data is fetched
  useEffect(() => {
    if (status === "success" && tokenlist.length > 0) {
      const defaultBaseSymbol =
        defaultTokenList.defaultPair[networkName].base.symbol;
      const defaultBaseCoin = tokenlist.find((coin) => {
        return coin.symbol.toUpperCase() === defaultBaseSymbol.toUpperCase();
      });

      if (
        defaultBaseCoin &&
        base.symbol.toUpperCase() === defaultBaseCoin.symbol.toUpperCase()
      ) {
        setBase(defaultBaseCoin);
      }

      const defaultQuoteSymbol =
        defaultTokenList.defaultPair[networkName].quote.symbol;
      const defaultQuoteCoin = tokenlist.find((coin) => {
        return (
          coin.symbol.toUpperCase() === defaultQuoteSymbol.toUpperCase()
        );
      });

      if (
        defaultQuoteCoin &&
        quote.symbol.toUpperCase() === defaultQuoteCoin.symbol.toUpperCase()
      ) {
        setQuote(defaultQuoteCoin);
      }
    }
  }, [status, tokenlist, base, quote]);

  // base balance and allowance
  const {
    data: baseBalanceAllowance,
    status: baseBalanceAllowanceStatus,
    error: baseBalanceAllowanceError,
    queryKey: baseBalanceAllowanceQueryKey,
    refetch: refetchBaseBalanceAllowance,
  } = useERC20BalanceAllowance(base, address, matchingEngine);

  // quote balance and allowance
  const {
    data: quoteBalanceAllowance,
    status: quoteBalanceAllowanceStatus,
    error: quoteBalanceAllowanceError,
    queryKey: quoteBalanceAllowanceQueryKey,
    refetch: refetchQuoteBalanceAllowance,
  } = useERC20BalanceAllowance(quote, address, matchingEngine);

  const {
    data: nativeBalance,
    isError,
    isLoading,
    queryKey: nativeBalanceQueryKey,
    refetch: refetchNativeBalance,
  } = useBalance({
    address,
  });

  const {
    data: pairData,
    error: pairError,
    status: pairStatus,
  } = usePairs(networkName, tokenlist);

  const {
    data: ohlcvData,
    error: ohlcvError,
    status: ohlcvStatus,
    queryKey: ohlcvQueryKey,
    refetch: refetchOHLCV,
  } = useOHLCVTotal(networkName, base, quote);

  const {
    data: recentPairTradeData,
    error: recentPairTradeError,
    status: recentPairTradeStatus,
    queryKey: recentPairTradeQueryKey,
    refetch: refetchRecentPairTrade,
  } = useRecentPairTradePaginated(networkName, base, quote);

  const {
    data: ordersData,
    prevData: prevOrdersData,
    error: ordersError,
    status: ordersStatus,
    queryKey: orderQueryKey,
    refetch: refetchOrders,
    page: ordersPage,
    setPage: setOrdersPage,
    totalPages: ordersTotalPages,
    totalOrders: ordersTotalOrders,
    pageSize: ordersPageSize,
    lastUpdated: ordersLastUpdated,
  } = useAccountOrdersPaginated(networkName, tokenlist, address as string, 10);

  /*
  const {
    data: orderHistoryData,
    prevData: prevOrderHistoryData,
    error: orderHistoryError,
    status: orderHistoryStatus,
    queryKey: orderHistoryQueryKey,
    refetch: refetchOrderHistory,
    page: orderHistoryPage,
    setPage: setOrderHistoryPage,
    pageSize: orderHistoryPageSize,
  } = useAccountOrderHistoryPaginated(
    networkName,
    tokenlist,
    address as string,
    10
  );
  */

  const {
    data: tradeHistoryData,
    prevData: prevTradeHistoryData,
    error: tradeHistoryError,
    status: tradeHistoryStatus,
    queryKey: tradeHistoryQueryKey,
    refetch: refetchTradeHistory,
    page: tradeHistoryPage,
    totalPages: tradeHistoryTotalPages,
    totalTradeHistory: tradeHistoryTotalTradeHistory,
    setPage: setTradeHistoryPage,
    pageSize: tradeHistoryPageSize,
  } = useAccountTradeHistoryPaginated(
    networkName,
    tokenlist,
    address as string,
    10
  );

  // Invalidate queries after contract write to refetch data
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    if (refetchBaseBalanceAllowance) refetchBaseBalanceAllowance();
    if (refetchQuoteBalanceAllowance) refetchQuoteBalanceAllowance();
    if (refetchNativeBalance) refetchNativeBalance();
    if (refetchTokenlistBalance) refetchTokenlistBalance();
    if (refetchOrders) refetchOrders();
    if (refetchTradeHistory) refetchTradeHistory();
  };

  // contract write constants
  const chainId: number = ChainIds[networkName as keyof typeof ChainIds];

  // Trade approve function
  const [approvalNeeded, setApprovalNeeded] = useState<boolean>(
    isBuy
      ? (quoteBalanceAllowance.allowance ?? 0) < 1 * qAmount && !isNative(quote)
      : (baseBalanceAllowance.allowance ?? 0) < 1 * bAmount && !isNative(base)
  );

  // use effect to set approval needed on every opening modal
  useEffect(() => {
    setApprovalNeeded(
      isBuy
        ? (quoteBalanceAllowance.allowance ?? 0) < qAmount && !isNative(quote)
        : (baseBalanceAllowance.allowance ?? 0) < bAmount && !isNative(base)
    );
  }, [
    baseBalanceAllowance,
    quoteBalanceAllowance,
    base,
    quote,
    baseBalanceAllowanceQueryKey,
    quoteBalanceAllowanceQueryKey,
  ]);

  const { data: approveData, queryKey: approveQueryKey } = useSimulateContract({
    address: isBuy ? quote.address : base.address,
    abi: erc20Abi,
    chainId: chainId,
    functionName: "approve",
    args: [
      matchingEngine,
      parseUnits(
        "10000000000000000000000000000000000000",
        isBuy ? quote.decimals : base.decimals
      ),
    ],
  });

  // Trade write functions
  const [isETHTrade, setIsETHTrade] = useState(
    isBuy
      ? quote &&
          (quote.symbol.toUpperCase() === nativeBalance?.symbol.toUpperCase() ||
            isNative(quote))
      : base &&
          (base.symbol.toUpperCase() === nativeBalance?.symbol.toUpperCase() ||
            isNative(base))
  );

  useEffect(() => {
    setIsETHTrade(
      isBuy
        ? quote &&
            (quote.symbol.toUpperCase() ===
              nativeBalance?.symbol.toUpperCase() ||
              isNative(quote))
        : base &&
            (base.symbol.toUpperCase() ===
              nativeBalance?.symbol.toUpperCase() ||
              isNative(base))
    );
  }, [base, quote, isBuy]);

  const {
    data: limitBuyETHData,
    queryKey: limitBuyETHQueryKey,
    error: limitBuyETHError,
  } = useSimulateContract({
    abi: MatchingEngineABI,
    address: matchingEngine,
    functionName: "limitBuyETH",
    chainId: chainId,
    args: [
      base.address,
      parseUnits(roundToThirdDecimal(limitPrice).toString(), 8),
      true,
      matchN,
      address,
    ],
    value: parseEther(roundToThirdDecimal(qAmount).toString()),
  });

  const {
    data: limitSellETHData,
    queryKey: limitSellETHQueryKey,
    error: limitSellETHError,
  } = useSimulateContract({
    abi: MatchingEngineABI,
    address: matchingEngine,
    functionName: "limitSellETH",
    chainId,
    args: [
      quote.address,
      parseUnits(roundToThirdDecimal(limitPrice).toString(), 8),
      true,
      matchN,
      address,
    ],
    value: parseEther(roundToThirdDecimal(bAmount).toString()),
  });

  const {
    data: limitBuyData,
    status: limitBuyStatus,
    error: limitBuyError,
    queryKey: limitBuyQueryKey,
  } = useSimulateContract({
    abi: MatchingEngineABI,
    address: matchingEngine,
    functionName: "limitBuy",
    account: address,
    args: [
      base.address,
      quote.address,
      parseUnits(roundToThirdDecimal(limitPrice).toString(), 8),
      parseUnits(roundToThirdDecimal(qAmount), quote.decimals),
      true,
      matchN,
      address,
    ],
  });

  const {
    data: limitSellData,
    queryKey: limitSellQueryKey,
    error: limitSellError,
  } = useSimulateContract({
    abi: MatchingEngineABI,
    address: matchingEngine,
    functionName: "limitSell",
    chainId: chainId,
    args: [
      base.address,
      quote.address,
      parseUnits(roundToThirdDecimal(limitPrice).toString(), 8),
      parseUnits(roundToThirdDecimal(bAmount), base.decimals),
      true,
      matchN,
      address,
    ],
  });

  // slippage limit in basis points
  const [slippageLimit, setSlippageLimit] = useState(10);

  const {
    data: marketBuyETHData,
    queryKey: marketBuyETHQueryKey,
    error: marketBuyETHError,
  } = useSimulateContract({
    abi: MatchingEngineABI,
    address: matchingEngine,
    functionName: "marketBuyETH",
    chainId: chainId,
    args: [base.address, true, matchN, address, slippageLimit],
    value: parseEther(roundToThirdDecimal(qAmount).toString()),
  });

  const {
    data: marketSellETHData,
    queryKey: marketSellETHQueryKey,
    error: marketSellETHError,
  } = useSimulateContract({
    abi: MatchingEngineABI,
    address: matchingEngine,
    functionName: "marketSellETH",
    chainId: chainId,
    args: [quote.address, true, matchN, address, slippageLimit],
    value: parseEther(roundToThirdDecimal(bAmount).toString()),
  });

  const {
    data: marketBuyData,
    queryKey: marketBuyQueryKey,
    error: marketBuyError,
  } = useSimulateContract({
    abi: MatchingEngineABI,
    address: matchingEngine,
    functionName: "marketBuy",
    chainId: chainId,
    args: [
      base.address,
      quote.address,
      parseUnits(roundToThirdDecimal(qAmount), quote.decimals),
      true,
      matchN,
      address,
      slippageLimit,
    ],
  });

  const {
    data: marketSellData,
    queryKey: marketSellQueryKey,
    error: marketSellError,
  } = useSimulateContract({
    abi: MatchingEngineABI,
    address: matchingEngine,
    functionName: "marketSell",
    chainId: chainId,
    args: [
      base.address,
      quote.address,
      parseUnits(roundToThirdDecimal(bAmount), base.decimals),
      true,
      matchN,
      address,
      slippageLimit,
    ],
  });

  const [initPrice, setInitPrice] = useState(0);
  const {
    data: addPairData,
    queryKey: addPairQueryKey,
    error: addPairError,
  } = useSimulateContract({
    abi: MatchingEngineABI,
    address: matchingEngine,
    functionName: "addPair",
    chainId: chainId,
    args: [base.address, quote.address, parseUnits(initPrice.toString(), 8)],
  });

  const {
    data: hash,
    isPending: isWritePending,
    isError: isWriteError,
    writeContract,
    writeContractAsync,
    queryKey: writeContractQueryKey,
  } = useWriteContract();

  const {
    data: receipt,
    isLoading: isTxPending,
    isSuccess: isTxConfirmed,
    isError: isTxError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({} as ModalContent);

  interface ModalContent {
    name: string | undefined;
    isBase: boolean | undefined;
  }

  function handleOpenModal(content: ModalContent) {
    setIsModalOpen(true);
    setModalContent(content);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function updateModalContent(content: ModalContent) {
    if (modalContent.name === content.name) {
      setModalContent(content);
    }
  }

  interface Asset {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
  }

  // Handler for Select Crypto Modal
  function handleSelectCrypto(asset: Asset, isBase: boolean) {
    if (base !== undefined && quote !== undefined) {
      if (isBase && asset.address === base.address) {
        // if base asset is quote asset, move base asset to quote
        setBase(asset);
        setQuote(base);
      } else if (!isBase && asset.address === base.address) {
        setBase(quote);
        setQuote(asset);
      } else if (isBase && asset.address === quote.address) {
        setBase(asset);
        setQuote(base);
      } else if (!isBase && asset.address === base.address) {
        setBase(quote);
        setQuote(asset);
      }
    }

    isBase ? setBase(asset) : setQuote(asset);

    setIsModalOpen(false);
  }

  function handleSelectPair(base: Asset, quote: Asset) {
    setBase(base);
    setQuote(quote);
    setIsModalOpen(false);
  }

  function renderModal() {
    let content: React.ReactNode;
    switch (modalContent.name) {
      case "review_trade":
        content = (
          <ReviewTrade
            address={address}
            networkName={networkName}
            isBuy={isBuy}
            base={base}
            quote={quote}
            limitPrice={limitPrice}
            baseAmount={baseAmount}
            quoteAmount={quoteAmount}
            approvalNeeded={approvalNeeded}
            isETHTrade={isETHTrade}
            matchingEngine={matchingEngine}
            isLimit={isLimit}
            marketPrice={marketPrice}
            bidHeadPrice={bidHeadPrice}
            askHeadPrice={askHeadPrice}
            onClose={setIsModalOpen}
          />
        );
        return (
          <ResponsiveModal
            modalDesc={
              approvalNeeded
                ? "Approve"
                : `Review ${isLimit ? "limit" : "market"} ${
                    isBuy ? "buy" : "sell"
                  }`
            }
            isOpen={isModalOpen}
            onClose={setIsModalOpen}
          >
            {content}
          </ResponsiveModal>
        );
      case "select_trade_crypto":
        content = (
          <SelectTradeCrypto
            onSelectAsset={handleSelectCrypto}
            networkName={networkName}
            address={address}
            holdings={holdings}
            data={tokenlist}
            status={status}
            isBuy={isBuy}
            isBase={modalContent.isBase}
            base={base}
            quote={quote}
          />
        );
        return (
          <ResponsiveModal
            modalDesc={`Select ${modalContent.isBase ? "Base" : "Quote"} Asset`}
            isOpen={isModalOpen}
            onClose={setIsModalOpen}
          >
            {content}
          </ResponsiveModal>
        );
      case "select_trade_pair":
        content = <SelectTradePair onSelectPair={handleSelectPair} />;
        return (
          <ResponsiveModal
            modalDesc="Select Pair"
            isOpen={isModalOpen}
            detailDesc="Select a trading pair to trade on."
            onClose={setIsModalOpen}
          >
            {content}
          </ResponsiveModal>
        );
      case "trade_detail":
        content = <TradeDetail modalContent={modalContent} />;
        return (
          <ReviewTradeModal
            modalDesc="Trade Details"
            isOpen={isModalOpen}
            onClose={setIsModalOpen}
          >
            <TradeDetail modalContent={modalContent} />
          </ReviewTradeModal>
        );
    }
  }

  const renderNavbar = () => {
    return (
      <>
        <Navbar />
      </>
    );
  };

  const renderProvider = () => {
    if (isConnected === false) {
      return (
        <>
          <QueryContext.Provider value={{}}>
            {renderNavbar()}
            <div className="w-full h-screen flex flex-col justify-center items-center page-background">
              <div className="w-full mt-[-100px] flex flex-col justify-center items-center margin-auto space-y-4">
                <w3m-connect-button />
                <span className="mt-[10px]">
                  {"A wallet must be connected"}
                </span>
              </div>
            </div>
          </QueryContext.Provider>
        </>
      );
    }
    if (
      status === "success" &&
      tokenlist.length > 0 &&
      base !== null &&
      quote !== null
    ) {
      return (
        <>
          <QueryContext.Provider
            value={{
              // constants
              networkName,
              nativeToken,
              matchingEngine,
              scannerUrl,
              // pair data
              pairData,
              pairError,
              pairStatus,
              // recent pair trade data
              recentPairTradeData,
              recentPairTradeStatus,
              recentPairTradeError,
              recentPairTradeQueryKey,
              refetchRecentPairTrade,
              // Balance retrieval
              tokenlist,
              holdings,
              status,
              error,
              // base and quote balance and allowance
              baseBalanceAllowance,
              baseBalanceAllowanceQueryKey,
              quoteBalanceAllowance,
              quoteBalanceAllowanceQueryKey,
              refetchBaseBalanceAllowance,
              refetchQuoteBalanceAllowance,
              nativeBalance,
              nativeBalanceQueryKey,
              // order data
              ordersData,
              prevOrdersData,
              ordersError,
              ordersStatus,
              ordersPage,
              setOrdersPage,
              ordersTotalPages,
              ordersTotalOrders,
              ordersPageSize,
              // trade history data
              tradeHistoryData,
              prevTradeHistoryData,
              tradeHistoryError,
              tradeHistoryStatus,
              tradeHistoryQueryKey,
              tradeHistoryPage,
              setTradeHistoryPage,
              tradeHistoryTotalPages,
              tradeHistoryTotalTradeHistory,
              tradeHistoryPageSize,
              // OHLCV data
              ohlcvData,
              ohlcvError,
              ohlcvStatus,
              // Trade Price and orderbook data
              marketPrice,
              bidHeadPrice,
              askHeadPrice,
              scale,
              setScale,
              orderbook,
              orderbookError,
              orderbookStatus,
              orderbookQueryKey,
              refetchOrderbook,
              spread,
              // base and quote states
              base,
              setBase,
              quote,
              setQuote,
              // price and order states
              isBuy,
              setIsBuy,
              handleBuySellToggle,
              isLimit,
              setIsLimit,
              limitPrice,
              setLimitPrice,
              // trade widget price state
              priceDisplay,
              setPriceDisplay,
              // trade widget amount state
              baseDisplay,
              setBaseDisplay,
              quoteDisplay,
              setQuoteDisplay,
              rate,
              // each asset amount states
              baseAmount,
              setBaseAmount,
              quoteAmount,
              setQuoteAmount,
              bAmount,
              qAmount,
              // matching order count
              matchN,
              setMatchN,
              // contract write state
              approvalNeeded,
              isETHTrade,
              approveData,
              limitSellETHData,
              limitSellETHError,
              limitSellData,
              limitSellError,
              limitBuyETHData,
              limitBuyETHError,
              limitBuyData,
              limitBuyError,
              marketSellETHData,
              marketSellETHError,
              marketSellData,
              marketSellError,
              marketBuyETHData,
              marketBuyETHError,
              marketBuyData,
              marketBuyError,
              addPairData,
              addPairQueryKey,
              addPairError,
              initPrice,
              setInitPrice,
              receipt,
              isTxPending,
              isTxConfirmed,
              isTxError,
              invalidateQueries,
              // modal state
              isModalOpen,
              setIsModalOpen,
              modalContent,
              setModalContent,
              updateModalContent,
              handleOpenModal,
              handleCloseModal,
              // react-query client
              queryClient,
            }}
          >
            {renderNavbar()}
            {renderModal()}
            {children}
          </QueryContext.Provider>
        </>
      );
    }
    if (error) {
      console.log(error, "connection error");
      return (
        <>
          <QueryContext.Provider value={{}}>
            {renderNavbar()}
            <div className="w-full h-screen flex flex-col justify-center align-center page-background">
              <div className="w-full mt-[-100px] flex flex-col justify-center items-center margin-auto space-y-4">
                <SparkleLoader
                  className={
                    "flex flex-col space-y-4 p-4 xs:overflow-x-none justify-center items-center card-background hide-scrollbar"
                  }
                />
                <span className="top-[-40px] text-white">
                  Connection to blockchain failed. check rpc or internet
                  connections.
                </span>
              </div>
            </div>{" "}
          </QueryContext.Provider>
        </>
      );
    }
    return (
      <>
        <QueryContext.Provider value={{}}>
          {renderNavbar()}
          <div className="w-full h-screen flex flex-col justify-center items-center page-background">
            <div className="w-full mt-[-100px] flex flex-col justify-center items-center margin-auto space-y-4">
              <SparkleLoader
                className={
                  "flex flex-col space-y-4 p-4 xs:overflow-x-none justify-center items-center card-background hide-scrollbar"
                }
              />
              <span className="mt-[10px] font-semibold text-white">
                {"Loading Data..."}
              </span>
            </div>
          </div>
        </QueryContext.Provider>
      </>
    );
  };

  return <>{renderProvider()}</>;
};

export const useTradeContext = () => {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error("useTradeContext must be used within an TradeProvider");
  }
  return context;
};
