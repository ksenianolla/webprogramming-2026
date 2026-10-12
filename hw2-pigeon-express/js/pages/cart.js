import { requireElement } from '../dom.js';
import { formatPrice } from '../format.js';
import { mountAddressBook } from '../components/address-book.js';
import { getCartBird, getMissingAddressKinds, hasOrderInProgress, placeOrder } from '../store.js';

const form = requireElement('#checkout-form');
const birdValue = requireElement('#cart-bird');
const priceValue = requireElement('#cart-price');
const payButton = requireElement('#checkout-pay');
const errorMessage = requireElement('#checkout-error');
const emptyState = requireElement('#cart-empty');
const emptyTitle = requireElement('#cart-empty-title');
const emptyAction = requireElement('#cart-empty-action');

const missingAddressMessages = {
  sender: 'Choose the sender’s address',
  receiver: 'Choose the reciever’s address',
};

function showEmptyCart() {
  form.hidden = true;
  emptyState.hidden = false;
  if (hasOrderInProgress()) {
    emptyTitle.textContent = 'Your bird is already on its way';
    emptyAction.textContent = 'check order';
    emptyAction.href = 'order-status.html';
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = !message;
}

function initCheckout(bird) {
  birdValue.textContent = bird.name;
  priceValue.textContent = formatPrice(bird.price);
  payButton.textContent = `pay ${formatPrice(bird.price)}`;

  const books = {
    sender: mountAddressBook(requireElement('#sender-addresses'), {
      kind: 'sender',
      onChange: () => showError(''),
    }),
    receiver: mountAddressBook(requireElement('#receiver-addresses'), {
      kind: 'receiver',
      onChange: () => showError(''),
    }),
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const [missingKind] = getMissingAddressKinds();
    if (missingKind) {
      showError(missingAddressMessages[missingKind]);
      books[missingKind].focusFirstOption();
      return;
    }
    if (!placeOrder()) {
      showError('Only one order can be active at a time');
      return;
    }
    window.location.assign('payment-success.html');
  });
}

const bird = getCartBird();
if (bird) {
  initCheckout(bird);
} else {
  showEmptyCart();
}
