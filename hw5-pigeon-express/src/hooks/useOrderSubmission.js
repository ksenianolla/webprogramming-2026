import { useCallback, useEffect, useRef, useState } from 'react';
import { sendOrder } from '../api/orders.js';
import { isAbortError } from '../api/http.js';
import { describeApiError } from '../lib/apiMessages.js';

export function useOrderSubmission() {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const controllerRef = useRef(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const submit = useCallback(async (order) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setIsSending(true);
    setError('');

    try {
      return await sendOrder(order, { signal: controller.signal });
    } catch (problem) {
      if (!isAbortError(problem) && !controller.signal.aborted) {
        setError(describeApiError(problem, 'send your order'));
      }
      return null;
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setIsSending(false);
      }
    }
  }, []);

  const clearError = useCallback(() => setError(''), []);

  return { submit, isSending, error, clearError };
}
