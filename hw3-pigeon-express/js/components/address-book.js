import { createElement } from '../dom.js';
import {
  addAddress,
  getAddresses,
  getSelectedAddress,
  removeAddress,
  selectAddress,
  validateAddress,
} from '../store.js';

function createOption(kind, address, { isSelected, removable }) {
  const radio = createElement('input', {
    className: 'address-option__radio',
    attrs: {
      type: 'radio',
      name: `${kind}-address`,
      value: address.id,
      checked: isSelected,
    },
  });

  return createElement('li', { className: 'address-book__option' }, [
    createElement('label', { className: 'address-option' }, [
      radio,
      createElement('span', { className: 'address-option__text', text: address.text }),
    ]),
    removable &&
      createElement('button', {
        className: 'address-option__remove',
        text: '×',
        attrs: { type: 'button', 'aria-label': `Remove ${address.text}` },
        dataset: { removeId: address.id },
      }),
  ]);
}

function createEditor(kind) {
  const input = createElement('input', {
    className: 'address-editor__input',
    attrs: {
      type: 'text',
      name: `${kind}-new-address`,
      placeholder: 'Street, house, room',
      autocomplete: 'street-address',
      maxlength: 80,
      'aria-label': `New ${kind}’s address`,
    },
  });
  const error = createElement('p', {
    className: 'address-editor__error',
    attrs: { 'aria-live': 'polite' },
  });
  const save = createElement('button', {
    className: 'order-action address-editor__action',
    text: 'save',
    attrs: { type: 'button', disabled: true },
  });
  const cancel = createElement('button', {
    className: 'order-action address-editor__action address-editor__action--cancel',
    text: 'cancel',
    attrs: { type: 'button' },
  });
  const root = createElement('div', { className: 'address-editor', attrs: { hidden: true } }, [
    input,
    error,
    createElement('div', { className: 'address-editor__actions' }, [save, cancel]),
  ]);

  return { root, input, error, save, cancel };
}

export function mountAddressBook(fieldset, { kind, removable = false, onChange } = {}) {
  const list = createElement('ul', { className: 'address-book__options' });
  const editor = createEditor(kind);
  const addButton = createElement('button', {
    className: 'order-action address-book__add',
    text: '+ add address',
    attrs: { type: 'button' },
  });

  function render() {
    const selectedId = getSelectedAddress(kind)?.id;
    const addresses = getAddresses(kind);
    list.replaceChildren(
      ...addresses.map((address) =>
        createOption(kind, address, { isSelected: address.id === selectedId, removable }),
      ),
    );
    list.hidden = addresses.length === 0;
  }

  function showError(message) {
    editor.error.textContent = message;
    editor.input.setAttribute('aria-invalid', String(Boolean(message)));
  }

  function openEditor() {
    editor.root.hidden = false;
    addButton.hidden = true;
    editor.input.focus();
  }

  function closeEditor() {
    editor.input.value = '';
    editor.save.disabled = true;
    showError('');
    editor.root.hidden = true;
    addButton.hidden = false;
    addButton.focus();
  }

  function saveAddress() {
    const { error, address } = addAddress(kind, editor.input.value);
    if (error) {
      showError(error);
      editor.input.focus();
      return;
    }
    closeEditor();
    render();
    list.querySelector(`input[value="${CSS.escape(address.id)}"]`)?.focus();
    onChange?.(kind);
  }

  list.addEventListener('change', (event) => {
    if (event.target.matches('.address-option__radio')) {
      selectAddress(kind, event.target.value);
      onChange?.(kind);
    }
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-id]');
    if (!button) {
      return;
    }
    removeAddress(kind, button.dataset.removeId);
    render();
    onChange?.(kind);
  });

  addButton.addEventListener('click', openEditor);
  editor.cancel.addEventListener('click', closeEditor);
  editor.save.addEventListener('click', saveAddress);

  editor.input.addEventListener('input', () => {
    const value = editor.input.value;
    editor.save.disabled = value.trim() === '';
    showError(value.trim().length >= 5 ? validateAddress(kind, value) : '');
  });

  editor.input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!editor.save.disabled) {
        saveAddress();
      }
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      closeEditor();
    }
  });

  fieldset.append(list, editor.root, addButton);
  render();

  return {
    focusFirstOption() {
      const first = list.querySelector('.address-option__radio');
      if (first) {
        first.focus();
      } else {
        openEditor();
      }
    },
  };
}
