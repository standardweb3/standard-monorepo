import { useRef, useEffect } from 'react';

export const isNative = token => {
  return (
    token.symbol === 'ETH' ||
    token.symbol === 'NEON' ||
    token.symbol === 'INJ' ||
    token.symbol === 'IP'
  );
};

// Make an API request to `/api/{path}`
// biome-ignore lint/style/useDefaultParameterLast: <explanation>
export function apiRequest(path, method = 'GET', data) {
  return fetch(`/api/${path}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  })
    .then(response => response.json())
    .then(response => {
      if (response.status === 'error') {
        throw new CustomError(response.code, response.message);
      }
      return response.data;
    });
}

// Make an API request to any external URL
// biome-ignore lint/style/useDefaultParameterLast: <explanation>
export function apiRequestExternal(url, method = 'GET', data, mode = 'cors') {
  console.log('fetching', url);
  return fetch(url, {
    method: method,
    mode,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  }).then(response => response.json());
}

export function removeDuplicateByProp(array, prop) {
  return array.filter(
    (item, index, self) =>
      self.findIndex(t => t[prop] === item[prop]) === index,
  );
}

// Create an Error with custom message and code
export function CustomError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

// Hook that returns previous value of state
export function usePrevious(state) {
  const ref = useRef();
  useEffect(() => {
    ref.current = state;
  });
  return ref.current;
}

export const truncateAddress = hash => {
  const truncatedHash = `${hash.slice(0, 4)}...${hash.slice(-4)}`;
  return truncatedHash;
};
