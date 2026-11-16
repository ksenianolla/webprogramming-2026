import { getOrderProgress } from '../lib/orderProgress.js';
import { useNow } from './useNow.js';

export function useOrderProgress(order, intervalMs = 1_000) {
  const isTicking = Boolean(order) && !getOrderProgress(order).arrived;
  const now = useNow(intervalMs, isTicking);
  return order ? getOrderProgress(order, Math.max(now, Date.now())) : null;
}
