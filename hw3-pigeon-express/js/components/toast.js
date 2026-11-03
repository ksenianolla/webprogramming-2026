import { createElement } from '../dom.js';

const HIDE_AFTER_MS = 12_000;

export function showToast({ text, linkLabel, linkHref }) {
  document.querySelector('.toast')?.remove();

  const toast = createElement('div', { className: 'toast', attrs: { role: 'status' } }, [
    createElement('p', { className: 'toast__text', text }),
    linkHref &&
      createElement('a', {
        className: 'toast__link',
        text: linkLabel,
        attrs: { href: linkHref },
      }),
    createElement('button', {
      className: 'toast__close',
      text: '×',
      attrs: { type: 'button', 'aria-label': 'Close' },
      on: { click: () => toast.remove() },
    }),
  ]);

  const startHideTimer = () => setTimeout(() => toast.remove(), HIDE_AFTER_MS);

  document.body.append(toast);
  if (document.visibilityState === 'hidden') {
    document.addEventListener('visibilitychange', startHideTimer, { once: true });
  } else {
    startHideTimer();
  }

  return toast;
}
