import { subscribeOnStream, unsubscribeFromStream } from './streaming.js'

const API_ENDPOINT =
  'https://secure-art-production.up.railway.app/api/tradingview' //

// Use it to keep a record of the most recent bar on the chart
const lastBarsCache = new Map()

const datafeed = {
  onReady: (callback) => {
    console.log('[onReady]: Method call')
    fetch(`${API_ENDPOINT}/config`).then((response) => {
      response.json().then((configurationData) => {
        setTimeout(() => callback(configurationData))
      })
    })
  },
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    console.log('[searchSymbols]: Method call')
    fetch(`${API_ENDPOINT}/search?query=${userInput}`).then((response) => {
      response.json().then((data) => {
        onResultReadyCallback(data)
      })
    })
  },
  resolveSymbol: (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) => {
    console.log('[resolveSymbol]: Method call', symbolName)
    fetch(`${API_ENDPOINT}/symbols?symbol=${symbolName}`).then((response) => {
      response
        .json()
        .then((symbolInfo) => {
          console.log('[resolveSymbol]: Symbol resolved', symbolInfo)
          onSymbolResolvedCallback(symbolInfo)
        })
        .catch((error) => {
          console.log('[resolveSymbol]: Cannot resolve symbol', symbolName, error)
          onResolveErrorCallback('Cannot resolve symbol')
          return
        })
    })
  },
  getBars: (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback
  ) => {
    const { from, to, firstDataRequest } = periodParams
    console.log('[getBars]: Method call', symbolInfo, resolution, from, to)

    const maxRangeInSeconds = 365 * 24 * 60 * 60 // 1 year in seconds
    const promises = []
    let currentFrom = from
    let currentTo

    while (currentFrom < to) {
      currentTo = Math.min(to, currentFrom + maxRangeInSeconds)
      const url = `${API_ENDPOINT}/history?symbol=${symbolInfo.ticker}&from=${currentFrom}&to=${currentTo}&resolution=${resolution}`
      promises.push(fetch(url).then((response) => response.json()))
      currentFrom = currentTo
    }

    Promise.all(promises)
      .then((results) => {
        const bars = []
        for (const data of results) {
          if (data.t.length > 0) {
            for (let index = 0; index < data.t.length; index++) {
              bars.push({
                time: data.t[index] * 1000,
                low: data.l[index],
                high: data.h[index],
                open: data.o[index],
                close: data.c[index],
                volume: data.v[index],
              })
            }
          }
        }
        const cacheKey = `${symbolInfo.ticker}-${resolution}`

        if (firstDataRequest && bars.length > 0) {
          lastBarsCache.set(cacheKey, {
            ...bars[bars.length - 1],
          })
        }

        onHistoryCallback(bars, { noData: bars.length === 0 })
      })
      .catch((error) => {
        console.log('[getBars]: Get error', error)
        onErrorCallback(error)
      })
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback
  ) => {
    console.log(
      '[subscribeBars]: Method call with subscriberUID:',
      subscriberUID
    )
    const cacheKey = `${symbolInfo.ticker}-${resolution}`
    console.log('[subscribeBars]: resolution', resolution)
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback,
      lastBarsCache.get(cacheKey)
    )
  },
  unsubscribeBars: (subscriberUID) => {
    console.log(
      '[unsubscribeBars]: Method call with subscriberUID:',
      subscriberUID
    )
    unsubscribeFromStream(subscriberUID)
  },
}

export default datafeed
