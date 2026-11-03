import { showToast } from './components/toast.js';
import { showSystemNotification } from './notifications.js';
import { getCurrentOrder, getOrderProgress, markOrderNotified } from './store.js';

const STATUS_PAGE = 'order-status.html';
const MAX_TIMEOUT_MS = 2_147_483_647;

function isStatusPage() {
  return window.location.pathname.endsWith(STATUS_PAGE);
}

function announceArrival(order, { showInPage }) {
  if (!markOrderNotified(order.id)) {
    return;
  }

  const title = 'Your bird has arrived!';
  const body = `${order.birdName} is waiting at ${order.receiver}`;
  const pageIsHidden = document.visibilityState === 'hidden';

  const shownBySystem =
    pageIsHidden &&
    showSystemNotification({
      title,
      body,
      tag: order.id,
      icon: 'images/pigeon.png',
      onClick: () => {
        if (!isStatusPage()) {
          window.location.assign(STATUS_PAGE);
        }
      },
    });

  if (!shownBySystem && showInPage) {
    showToast({
      text: `${title} ${body}.`,
      linkLabel: 'check',
      linkHref: STATUS_PAGE,
    });
  }
}

export function watchOrderArrival({ showInPage = true } = {}) {
  const order = getCurrentOrder();
  if (!order || order.notified) {
    return;
  }

  const { arrivesAt } = getOrderProgress(order);
  const delay = Math.min(Math.max(0, arrivesAt - Date.now()), MAX_TIMEOUT_MS);

  setTimeout(() => announceArrival(order, { showInPage }), delay);
}
