import { useCallback, useEffect, useState } from 'react';
import { fetchFlyingWeather } from '../api/weather.js';
import { isAbortError } from '../api/http.js';

const CACHE_TTL_MS = 10 * 60_000;
let cache = null;

function readCache() {
  return cache && Date.now() - cache.savedAt < CACHE_TTL_MS ? cache.weather : null;
}

export function useFlyingWeather() {
  const [result, setResult] = useState(() => {
    const cached = readCache();
    return cached ? { status: 'success', weather: cached, error: null } : { status: 'loading', weather: null, error: null };
  });
  const [attempt, setAttempt] = useState(0);
  const needsFetch = result.status === 'loading';

  useEffect(() => {
    if (!needsFetch) {
      return undefined;
    }
    const controller = new AbortController();
    fetchFlyingWeather({ signal: controller.signal })
      .then((weather) => {
        cache = { weather, savedAt: Date.now() };
        setResult({ status: 'success', weather, error: null });
      })
      .catch((error) => {
        if (!isAbortError(error) && !controller.signal.aborted) {
          setResult({ status: 'error', weather: null, error });
        }
      });
    return () => controller.abort();
  }, [needsFetch, attempt]);

  const retry = useCallback(() => {
    setResult({ status: 'loading', weather: null, error: null });
    setAttempt((value) => value + 1);
  }, []);

  return { ...result, retry };
}
