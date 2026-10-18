'use client';
import { useState } from 'react';

function readStoredValue<T>(key: string, initialValue: T): T {
  // Guarded for SSR — the initializer runs on the server too.
  if (typeof window === 'undefined') return initialValue;
  try {
    const item = window.localStorage.getItem(key);
    return item !== null ? (JSON.parse(item) as T) : initialValue;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Read from storage lazily on first render instead of hydrating from an effect.
  const [storedValue, setStoredValue] = useState<T>(() => readStoredValue(key, initialValue));

  // Re-read from storage if the key changes (mirrors the old effect's [key] dependency).
  const [prevKey, setPrevKey] = useState(key);
  if (prevKey !== key) {
    setPrevKey(key);
    setStoredValue(readStoredValue(key, initialValue));
  }

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch {
      // ignore
    }
  };

  return [storedValue, setValue];
}
