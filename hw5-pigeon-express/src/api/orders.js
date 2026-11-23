import { ApiError, ApiErrorKind, requestJson } from './http.js';
import { formatPrice } from '../lib/format.js';

const ORDERS_URL = 'https://jsonplaceholder.typicode.com/posts';
const CUSTOMER_ID = 1;

function toPayload(order) {
  return {
    userId: CUSTOMER_ID,
    title: `PigeonExpress order: ${order.birdName}, ${order.deliveryClass}`,
    body: `From ${order.sender} to ${order.receiver}. Price ${formatPrice(order.price)}, about ${order.etaMinutes} min.`,
    order: {
      birdId: order.birdId,
      price: order.price,
      sender: order.sender,
      receiver: order.receiver,
      etaMinutes: order.etaMinutes,
      weather: order.weather,
    },
  };
}

export async function sendOrder(order, { signal } = {}) {
  const data = await requestJson(ORDERS_URL, { method: 'POST', body: toPayload(order), signal });

  if (data?.id === undefined || data?.id === null) {
    throw new ApiError(ApiErrorKind.format);
  }

  return { ...order, serverId: data.id };
}
