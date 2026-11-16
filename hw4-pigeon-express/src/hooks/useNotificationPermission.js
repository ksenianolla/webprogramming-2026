import { useCallback, useState } from 'react';
import { getNotificationStatus, requestNotificationPermission } from '../lib/notifications.js';

export function useNotificationPermission() {
  const [status, setStatus] = useState(getNotificationStatus);
  const [isRequesting, setIsRequesting] = useState(false);

  const request = useCallback(async () => {
    setIsRequesting(true);
    const nextStatus = await requestNotificationPermission();
    setStatus(nextStatus);
    setIsRequesting(false);
  }, []);

  return { status, isRequesting, request };
}
