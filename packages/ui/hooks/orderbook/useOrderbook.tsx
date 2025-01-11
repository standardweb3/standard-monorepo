'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchOrderbook } from 'queries';
import { PonderLinks, PonderWssLinks } from '../../enums';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Orderbook, TickEvent, DeleteTickEvent, MarketPriceEvent } from 'types';
import io, { type Socket } from 'socket.io-client';

export const useOrderbook = (
  networkName: string,
  base: { address: string },
  quote: { address: string },
) => {
  const apiUrl: string = PonderLinks[networkName];

  const queryKey = useMemo(
    () => [`${base.address}-${quote.address}-orderbook`],
    [base.address, quote.address],
  );

  const [localData, setLocalData] = useState<Orderbook | undefined>(undefined);
  const socketRef = useRef<Socket | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data: Orderbook = await fetchOrderbook(base.address, quote.address, apiUrl);
      setLocalData(data);
      return data;
    } catch (error) {
      console.log(error, 'orderbook error');
      throw error;
    }
  }, [base.address, quote.address, apiUrl]);

  const { data, error, status, refetch } = useQuery({
    queryKey,
    queryFn: fetchData,
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!base.address && !!quote.address,
  });

  useEffect(() => {
    const SOCKET_SERVER_URL = `${PonderWssLinks[networkName]}`;

    const handleNewMarketPrice = (data: Orderbook, update: MarketPriceEvent): Orderbook => {
      if (data.orderbook !== update.id) return data;
      return { ...data, mktPrice: update.price };
    };

    const handleAdditionalTick = (
      data: Orderbook,
      addition: TickEvent,
    ): Orderbook => {
      if (data.orderbook !== addition.orderbook) return data;
      const updatedData = { ...data };
      if (addition.isBid) {
        if (addition.price > updatedData.bidHead) {
          updatedData.bidHead = addition.price;
        }
        const index = updatedData.bids.findIndex(
          item => item.id === addition.id,
        );
        if (index > -1) {
          updatedData.bids[index] = addition;
        } else {
          updatedData.bids.push(addition);
          updatedData.bids.sort((a, b) => b.price - a.price);
        }
      } else {
        if (addition.price < updatedData.askHead) {
          updatedData.askHead = addition.price;
        }
        const index = updatedData.asks.findIndex(
          item => item.id === addition.id,
        );
        if (index > -1) {
          updatedData.asks[index] = addition;
        } else {
          updatedData.asks.push(addition);
          updatedData.asks.sort((a, b) => a.price - b.price);
        }
      }
      return updatedData;
    };

    const handleDeleteTick = (data: Orderbook, deletion: DeleteTickEvent): Orderbook => {
      const updatedData = { ...data };
      if (deletion.isBid) {
        updatedData.bids = updatedData.bids.filter(
          item => item.id !== deletion.id,
        );
      } else {
        updatedData.asks = updatedData.asks.filter(
          item => item.id !== deletion.id,
        );
      }
      return updatedData;
    };

    const updateLocalData = (updater: (prevData: Orderbook) => Orderbook) => {
      setLocalData(prevData => {
        if (!prevData) return prevData;
        const updatedData = updater(prevData);
        updatedData.lastUpdated = Date.now();
        return updatedData;
      });
    };

    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
    });

    socketRef.current.on(
      'deleteTick',
      (deleteTick: DeleteTickEvent) => {
        updateLocalData(prevData => handleDeleteTick(prevData, deleteTick));
      },
    );

    socketRef.current.on(
      'tick',
      (tick: TickEvent) => {
        // console.log("tick", tick);
        updateLocalData(prevData => handleAdditionalTick(prevData, tick));
      },
    );

    socketRef.current.on(
      'marketPrice',
      (mktPrice: MarketPriceEvent) => {
        // console.log("marketPrice", mktPrice);
        updateLocalData(prevData => handleNewMarketPrice(prevData, mktPrice));
      },
    );

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [networkName]);

  return {
    data: localData,
    marketPrice: localData?.mktPrice,
    bidHeadPrice: localData?.bidHead,
    askHeadPrice: localData?.askHead,
    error,
    status,
    queryKey,
    refetch,
    lastUpdated: localData?.lastUpdated,
  };
};
