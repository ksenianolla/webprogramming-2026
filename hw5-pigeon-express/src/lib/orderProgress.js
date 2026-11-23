const MINUTE_MS = 60_000;

export function getOrderProgress(order, now = Date.now()) {
  const arrivesAt = order.createdAt + order.etaMinutes * MINUTE_MS;
  const remainingMs = Math.max(0, arrivesAt - now);
  return {
    arrivesAt,
    remainingMs,
    arrived: remainingMs === 0,
    minutesLeft: Math.ceil(remainingMs / MINUTE_MS),
  };
}

export function isOrderInProgress(order, now = Date.now()) {
  return Boolean(order) && !getOrderProgress(order, now).arrived;
}
