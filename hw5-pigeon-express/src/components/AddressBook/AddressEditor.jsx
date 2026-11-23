import { useState } from 'react';
import { ActionButton } from '../ActionButton/ActionButton.jsx';
import styles from './AddressBook.module.css';

const MIN_LENGTH_FOR_LIVE_CHECK = 5;

export function AddressEditor({ kind, validate, onSave, onCancel }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const isEmpty = value.trim() === '';

  const handleChange = (event) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    setError(nextValue.trim().length >= MIN_LENGTH_FOR_LIVE_CHECK ? validate(nextValue) : '');
  };

  const save = () => {
    const saveError = onSave(value);
    if (saveError) {
      setError(saveError);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!isEmpty) {
        save();
      }
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
    }
  };

  return (
    <div className={styles.editor}>
      <input
        className={styles.editorInput}
        type="text"
        name={`${kind}-new-address`}
        placeholder="Street, house, room"
        autoComplete="street-address"
        maxLength={80}
        aria-label={`New ${kind}’s address`}
        aria-invalid={Boolean(error)}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      {error && (
        <p className={styles.error} aria-live="polite">
          {error}
        </p>
      )}
      <div className={styles.editorActions}>
        <ActionButton className={styles.editorAction} size="small" disabled={isEmpty} onClick={save}>
          save
        </ActionButton>
        <ActionButton className={styles.editorAction} size="small" variant="muted" onClick={onCancel}>
          cancel
        </ActionButton>
      </div>
    </div>
  );
}
