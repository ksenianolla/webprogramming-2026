import { birdKinds, deliveryClasses, findBird, getBirdsOfClass } from '../data.js';
import { createElement, requireElement } from '../dom.js';
import { readSessionFlag, writeSessionFlag } from '../storage.js';
import { createBirdCard } from '../components/bird-card.js';
import { openOrderDialog } from '../components/order-dialog.js';
import { getSelectedAddress, hasOrderInProgress, putInCart } from '../store.js';

const ADDRESS_CONFIRMED_FLAG = 'sender-address-confirmed';

const catalog = requireElement('[data-catalog]');

function createDeliveryClassSection(deliveryClass) {
  const titleId = `${deliveryClass.id}-title`;
  const cards = getBirdsOfClass(deliveryClass.id).map((bird) =>
    createElement('li', { className: 'delivery-class__bird' }, [createBirdCard(bird)]),
  );

  return createElement(
    'section',
    { className: 'delivery-class', attrs: { 'aria-labelledby': titleId } },
    [
      createElement('h2', {
        className: 'delivery-class__title',
        text: deliveryClass.title,
        attrs: { id: titleId },
      }),
      createElement('ul', { className: 'delivery-class__birds' }, cards),
    ],
  );
}

function renderCatalog() {
  catalog.append(...deliveryClasses.map(createDeliveryClassSection));
}

function showOneOrderDialog() {
  openOrderDialog({
    title: 'Unfortunately, you can make only one order at a time...',
    hint: 'Check current order?',
    actions: [{ label: 'check', variant: 'check', href: 'order-status.html' }],
  });
}

function showBirdSelectedDialog(bird) {
  openOrderDialog({
    title: `${birdKinds[bird.kind].label} selected!`,
    hint: 'Proceed to Cart',
    actions: [
      {
        label: 'confirm',
        variant: 'confirm',
        href: 'cart.html',
        onClick: () => putInCart(bird.id),
      },
      { label: 'change', variant: 'change' },
    ],
  });
}

function showSenderAddressDialog() {
  const sender = getSelectedAddress('sender');
  if (!sender || hasOrderInProgress() || readSessionFlag(ADDRESS_CONFIRMED_FLAG)) {
    return;
  }
  openOrderDialog({
    title: 'Sender’s adress:',
    hint: sender.text,
    dimPage: false,
    onClose: () => writeSessionFlag(ADDRESS_CONFIRMED_FLAG),
    actions: [
      { label: 'confirm', variant: 'confirm' },
      {
        label: 'change',
        variant: 'change',
        href: 'profile.html',
        onClick: () => writeSessionFlag(ADDRESS_CONFIRMED_FLAG),
      },
    ],
  });
}

catalog.addEventListener('click', (event) => {
  const button = event.target.closest('.bird-card__select');
  if (!button) {
    return;
  }
  const bird = findBird(button.dataset.birdId);
  if (!bird) {
    return;
  }
  if (hasOrderInProgress()) {
    showOneOrderDialog();
  } else {
    showBirdSelectedDialog(bird);
  }
});

renderCatalog();
showSenderAddressDialog();
