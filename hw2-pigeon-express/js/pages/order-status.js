import { createElement, requireElement } from '../dom.js';
import { formatClock, formatMinutes, formatPrice, toIsoDuration } from '../format.js';
import { finishOrder, getCurrentOrder, getOrderProgress } from '../store.js';

const title = requireElement('#status-title');
const arrival = requireElement('#status-arrival');
const details = requireElement('#status-details');
const finishButton = requireElement('#status-finish');
const catalogLink = requireElement('#status-catalog');

const TICK_MS = 1_000;

function renderDetails(order) {
  const rows = [
    ['Delivery bird', `${order.birdName}, ${order.deliveryClass}`],
    ['Price', formatPrice(order.price)],
    ['From', order.sender],
    ['To', order.receiver],
  ];
  details.replaceChildren(
    ...rows.flatMap(([label, value]) => [
      createElement('dt', { className: 'order-status__label', text: label }),
      createElement('dd', { className: 'order-status__value', text: value }),
    ]),
  );
  details.hidden = false;
}

function renderProgress(order) {
  const { arrived, arrivesAt, minutesLeft } = getOrderProgress(order);
  if (arrived) {
    title.textContent = 'Your bird has arrived!';
    arrival.replaceChildren(
      'Delivered at ',
      createElement('time', {
        text: formatClock(arrivesAt),
        attrs: { datetime: new Date(arrivesAt).toISOString() },
      }),
    );
    finishButton.hidden = false;
    return true;
  }
  arrival.replaceChildren(
    'Arrives in ~ ',
    createElement('time', {
      text: formatMinutes(minutesLeft),
      attrs: { datetime: toIsoDuration(minutesLeft) },
    }),
  );
  return false;
}

function showNoOrder() {
  title.textContent = 'You have no active orders';
  arrival.hidden = true;
  catalogLink.hidden = false;
}

const order = getCurrentOrder();

if (order) {
  renderDetails(order);
  if (!renderProgress(order)) {
    const timer = setInterval(() => {
      if (renderProgress(order)) {
        clearInterval(timer);
      }
    }, TICK_MS);
  }
  finishButton.addEventListener('click', () => {
    finishOrder();
    window.location.assign('index.html');
  });
} else {
  showNoOrder();
}
