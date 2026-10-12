import { defaultState, findBird, findDeliveryClass } from './data.js';
import { loadState, saveState } from './storage.js';

const MIN_ADDRESS_LENGTH = 5;
const MAX_ADDRESS_LENGTH = 80;
const NAME_PATTERN = /^[\p{L}][\p{L}' -]*$/u;

const state = loadState(defaultState);

function commit() {
  saveState(state);
}

function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getProfile() {
  return { ...state.profile };
}

export function validateProfileField(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'This field cannot be empty';
  }
  if (trimmed.length > 30) {
    return 'Use 30 characters or fewer';
  }
  if (!NAME_PATTERN.test(trimmed)) {
    return 'Use letters only';
  }
  return '';
}

export function updateProfileField(field, value) {
  const error = validateProfileField(value);
  if (error) {
    return { error };
  }
  state.profile[field] = value.trim();
  commit();
  return { error: '' };
}

export function getAddresses(kind) {
  return state.addresses[kind].map((address) => ({ ...address }));
}

export function getSelectedAddress(kind) {
  const id = state.selectedAddress[kind];
  return state.addresses[kind].find((address) => address.id === id) ?? null;
}

export function selectAddress(kind, id) {
  if (!state.addresses[kind].some((address) => address.id === id)) {
    return;
  }
  state.selectedAddress[kind] = id;
  commit();
}

export function validateAddress(kind, text) {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length < MIN_ADDRESS_LENGTH) {
    return `Address should be at least ${MIN_ADDRESS_LENGTH} characters long`;
  }
  if (trimmed.length > MAX_ADDRESS_LENGTH) {
    return `Address should be at most ${MAX_ADDRESS_LENGTH} characters long`;
  }
  const isDuplicate = state.addresses[kind].some(
    (address) => address.text.toLowerCase() === trimmed.toLowerCase(),
  );
  if (isDuplicate) {
    return 'This address is already in the list';
  }
  return '';
}

export function addAddress(kind, text) {
  const error = validateAddress(kind, text);
  if (error) {
    return { error, address: null };
  }
  const address = { id: createId(kind), text: text.trim().replace(/\s+/g, ' ') };
  state.addresses[kind].push(address);
  state.selectedAddress[kind] = address.id;
  commit();
  return { error: '', address: { ...address } };
}

export function removeAddress(kind, id) {
  state.addresses[kind] = state.addresses[kind].filter((address) => address.id !== id);
  if (state.selectedAddress[kind] === id) {
    state.selectedAddress[kind] = state.addresses[kind][0]?.id ?? null;
  }
  commit();
}

export function getCartBird() {
  return state.cart ? findBird(state.cart.birdId) : null;
}

export function putInCart(birdId) {
  if (!findBird(birdId)) {
    return;
  }
  state.cart = { birdId };
  commit();
}

export function getCurrentOrder() {
  return state.order ? { ...state.order } : null;
}

export function getOrderProgress(order, now = Date.now()) {
  const arrivesAt = order.createdAt + order.etaMinutes * 60_000;
  const remainingMs = Math.max(0, arrivesAt - now);
  return {
    arrivesAt,
    arrived: remainingMs === 0,
    minutesLeft: Math.ceil(remainingMs / 60_000),
  };
}

export function hasOrderInProgress() {
  const order = getCurrentOrder();
  return Boolean(order) && !getOrderProgress(order).arrived;
}

export function getMissingAddressKinds() {
  return ['sender', 'receiver'].filter((kind) => !getSelectedAddress(kind));
}

export function placeOrder() {
  const bird = getCartBird();
  if (!bird || getMissingAddressKinds().length > 0 || hasOrderInProgress()) {
    return null;
  }
  const deliveryClass = findDeliveryClass(bird.classId);
  state.order = {
    id: createId('order'),
    birdId: bird.id,
    birdName: bird.name,
    deliveryClass: deliveryClass.title,
    price: bird.price,
    sender: getSelectedAddress('sender').text,
    receiver: getSelectedAddress('receiver').text,
    createdAt: Date.now(),
    etaMinutes: deliveryClass.etaMinutes,
  };
  state.cart = null;
  commit();
  return getCurrentOrder();
}

export function finishOrder() {
  state.order = null;
  commit();
}
