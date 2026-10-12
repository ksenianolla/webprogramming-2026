const STATE_KEY = 'pigeon-express/state/v1';
const SESSION_PREFIX = 'pigeon-express/session/';

export function loadState(fallback) {
  const initial = structuredClone(fallback);
  try {
    const saved = JSON.parse(localStorage.getItem(STATE_KEY));
    if (saved && typeof saved === 'object') {
      return { ...initial, ...saved };
    }
  } catch {
    return initial;
  }
  return initial;
}

export function saveState(state) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    return false;
  }
  return true;
}

export function readSessionFlag(name) {
  try {
    return sessionStorage.getItem(SESSION_PREFIX + name) === '1';
  } catch {
    return false;
  }
}

export function writeSessionFlag(name) {
  try {
    sessionStorage.setItem(SESSION_PREFIX + name, '1');
  } catch {
    return false;
  }
  return true;
}
