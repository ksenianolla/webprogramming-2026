import { useEffect, useRef } from 'react';
import { useAppState } from '../state/AppStateContext.jsx';
import { getOrderProgress } from '../lib/orderProgress.js';

const MAX_TIMEOUT_MS = 2_147_483_647;

export function useArrivalWatcher(onArrive) {
  const { state, markOrderNotified } = useAppState();
  const order = state.order;
  const onArriveRef = useRef(onArrive);

  useEffect(() => {
    onArriveRef.current = onArrive;
  });

  useEffect(() => {
    if (!order || order.notified) {
      return undefined;
    }
    const delay = Math.min(getOrderProgress(order).remainingMs, MAX_TIMEOUT_MS);
    const timer = setTimeout(() => {
      if (markOrderNotified(order.id)) {
        onArriveRef.current(order);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [order, markOrderNotified]);
}
