import { createElement, requireElement } from '../dom.js';
import { formatMinutes, toIsoDuration } from '../format.js';
import { getCurrentOrder, getOrderProgress } from '../store.js';

const title = requireElement('#payment-title');
const message = requireElement('#payment-message');
const waitLink = requireElement('#payment-wait');

const REFRESH_INTERVAL_MS = 15_000;

function renderWaitTime(order) {
  const { arrived, minutesLeft } = getOrderProgress(order);
  if (arrived) {
    waitLink.replaceChildren('Your bird has arrived!');
    return true;
  }
  waitLink.replaceChildren(
    'Approximate wait time: ',
    createElement('time', {
      text: formatMinutes(minutesLeft),
      attrs: { datetime: toIsoDuration(minutesLeft) },
    }),
  );
  return false;
}

const order = getCurrentOrder();

if (order) {
  if (!renderWaitTime(order)) {
    const timer = setInterval(() => {
      if (renderWaitTime(order)) {
        clearInterval(timer);
      }
    }, REFRESH_INTERVAL_MS);
  }
} else {
  title.textContent = 'There is no paid order yet';
  message.hidden = true;
  waitLink.textContent = 'Choose a delivery bird';
  waitLink.href = 'index.html';
}
