import { useImperativeHandle, useRef, useState } from 'react';
import { useAppState } from '../../state/AppStateContext.jsx';
import { ActionButton } from '../ActionButton/ActionButton.jsx';
import { AddressEditor } from './AddressEditor.jsx';
import styles from './AddressBook.module.css';

export function AddressBook({ kind, legend, removable = false, onChange, ref }) {
  const { state, selectedAddress, selectAddress, addAddress, removeAddress, validateNewAddress } =
    useAppState();
  const [isEditing, setIsEditing] = useState(false);
  const firstOptionRef = useRef(null);
  const addButtonRef = useRef(null);

  const addresses = state.addresses[kind];
  const selectedId = selectedAddress[kind]?.id;

  useImperativeHandle(ref, () => ({
    focusFirstOption() {
      if (firstOptionRef.current) {
        firstOptionRef.current.focus();
      } else {
        setIsEditing(true);
      }
    },
  }));

  const closeEditor = () => {
    setIsEditing(false);
    requestAnimationFrame(() => addButtonRef.current?.focus());
  };

  const handleSave = (text) => {
    const { error } = addAddress(kind, text);
    if (error) {
      return error;
    }
    closeEditor();
    onChange?.(kind);
    return '';
  };

  return (
    <fieldset className={styles.book}>
      <legend className={styles.legend}>{legend}</legend>

      {addresses.length > 0 && (
        <ul className={styles.options}>
          {addresses.map((address, index) => (
            <li className={styles.option} key={address.id}>
              <label className={styles.address}>
                <input
                  ref={index === 0 ? firstOptionRef : undefined}
                  className={styles.radio}
                  type="radio"
                  name={`${kind}-address`}
                  value={address.id}
                  checked={address.id === selectedId}
                  onChange={() => {
                    selectAddress(kind, address.id);
                    onChange?.(kind);
                  }}
                />
                <span>{address.text}</span>
              </label>
              {removable && (
                <button
                  className={styles.remove}
                  type="button"
                  aria-label={`Remove ${address.text}`}
                  onClick={() => {
                    removeAddress(kind, address.id);
                    onChange?.(kind);
                  }}
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {isEditing ? (
        <AddressEditor
          kind={kind}
          validate={(text) => validateNewAddress(kind, text)}
          onSave={handleSave}
          onCancel={closeEditor}
        />
      ) : (
        <ActionButton ref={addButtonRef} onClick={() => setIsEditing(true)}>
          + add address
        </ActionButton>
      )}
    </fieldset>
  );
}
