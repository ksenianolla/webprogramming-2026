import { requireElement } from '../dom.js';
import { mountAddressBook } from '../components/address-book.js';
import { getProfile, updateProfileField, validateProfileField } from '../store.js';

const form = requireElement('#profile-form');
const fields = ['name', 'surname'];

function fitToContent(input) {
  input.size = Math.max(input.value.length, 2);
}

function bindProfileField(field) {
  const input = requireElement(`#profile-${field}`);
  const pill = input.closest('.profile__value');
  const error = requireElement(`#profile-${field}-error`);
  let savedValue = getProfile()[field];

  input.value = savedValue;
  fitToContent(input);

  function showError(message) {
    error.textContent = message;
    pill.classList.toggle('profile__value--invalid', Boolean(message));
    input.setAttribute('aria-invalid', String(Boolean(message)));
  }

  input.addEventListener('input', () => {
    fitToContent(input);
    const message = validateProfileField(input.value);
    showError(message);
    if (!message) {
      updateProfileField(field, input.value);
      savedValue = input.value.trim();
    }
  });

  input.addEventListener('blur', () => {
    input.value = savedValue;
    fitToContent(input);
    showError('');
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      input.blur();
    }
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  document.activeElement?.blur();
});

fields.forEach(bindProfileField);

mountAddressBook(requireElement('#sender-addresses'), { kind: 'sender', removable: true });
mountAddressBook(requireElement('#receiver-addresses'), { kind: 'receiver', removable: true });
