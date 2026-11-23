import { useSyncExternalStore } from 'react';

function subscribe(onChange) {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}

function getVisibility() {
  return document.visibilityState;
}

export function usePageVisibility() {
  return useSyncExternalStore(subscribe, getVisibility, () => 'visible');
}
