import { createElement } from '../dom.js';
import {
  NotificationStatus,
  getNotificationStatus,
  requestNotificationPermission,
} from '../notifications.js';

const messages = {
  [NotificationStatus.default]: 'Get a notification when your bird arrives, even if this tab is in the background.',
  [NotificationStatus.granted]: 'Notifications are on. We will let you know when your bird arrives.',
  [NotificationStatus.denied]:
    'Notifications are blocked in your browser settings. We will remind you on the page instead.',
  [NotificationStatus.unsupported]:
    'Your browser can’t show notifications. We will remind you on the page instead.',
  [NotificationStatus.insecure]:
    'Notifications work only on a secure (https) page. We will remind you on the page instead.',
  [NotificationStatus.error]:
    'We couldn’t ask for permission to send notifications. We will remind you on the page instead.',
};

export function createArrivalAlert() {
  const text = createElement('p', { className: 'arrival-alert__text' });
  const button = createElement('button', {
    className: 'order-action arrival-alert__button',
    text: 'notify me',
    attrs: { type: 'button' },
  });
  const root = createElement('section', {
    className: 'arrival-alert',
    attrs: { 'aria-label': 'Arrival notification', 'aria-live': 'polite' },
  }, [text, button]);

  function render(status) {
    root.dataset.status = status;
    text.textContent = messages[status] ?? messages[NotificationStatus.error];
    button.hidden = status !== NotificationStatus.default;
  }

  button.addEventListener('click', async () => {
    button.disabled = true;
    const status = await requestNotificationPermission();
    button.disabled = false;
    render(status);
  });

  render(getNotificationStatus());

  return root;
}
