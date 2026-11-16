export function formatPrice(price) {
  return `${price}$`;
}

export function formatMinutes(minutes) {
  return `${minutes} min`;
}

export function formatClock(timestamp) {
  return new Date(timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function toIsoDuration(minutes) {
  return `PT${minutes}M`;
}

export function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
