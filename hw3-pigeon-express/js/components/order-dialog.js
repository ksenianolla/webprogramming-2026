import { createElement } from '../dom.js';

const DIMMED_PAGE_CLASS = 'page--dialog-open';
let dialogCounter = 0;

function isOutside(dialog, event) {
  const rect = dialog.getBoundingClientRect();
  return (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  );
}

function createAction(dialog, action) {
  const className = `order-action order-dialog__action order-dialog__action--${action.variant}`;
  const handleClick = (event) => {
    action.onClick?.(event);
    if (!action.href) {
      dialog.close();
    }
  };

  if (action.href) {
    return createElement('a', {
      className,
      text: action.label,
      attrs: { href: action.href },
      on: { click: handleClick },
    });
  }
  return createElement('button', {
    className,
    text: action.label,
    attrs: { type: 'button' },
    on: { click: handleClick },
  });
}

export function openOrderDialog({ title, hint, actions, dimPage = true, onClose }) {
  dialogCounter += 1;
  const titleId = `order-dialog-title-${dialogCounter}`;
  const opener = document.activeElement;

  const dialog = createElement('dialog', {
    className: 'order-dialog',
    attrs: { 'aria-labelledby': titleId },
  });
  dialog.append(
    createElement('h2', { className: 'order-dialog__title', text: title, attrs: { id: titleId } }),
    ...(hint ? [createElement('p', { className: 'order-dialog__hint', text: hint })] : []),
    createElement(
      'div',
      { className: 'order-dialog__actions' },
      actions.map((action) => createAction(dialog, action)),
    ),
  );

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog && isOutside(dialog, event)) {
      dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove(DIMMED_PAGE_CLASS);
    dialog.remove();
    onClose?.();
    if (opener instanceof HTMLElement && opener.isConnected) {
      opener.focus();
    }
  });

  document.body.classList.toggle(DIMMED_PAGE_CLASS, dimPage);
  document.body.append(dialog);
  dialog.showModal();

  return dialog;
}
