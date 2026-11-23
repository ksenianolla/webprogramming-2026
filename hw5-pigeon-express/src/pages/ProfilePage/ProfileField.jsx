import { useRef, useState } from 'react';
import { Pill } from '../../components/Pill/Pill.jsx';
import { useAppState } from '../../state/AppStateContext.jsx';
import { validateProfileField } from '../../lib/validation.js';
import styles from './ProfilePage.module.css';

export function ProfileField({ field, label, autoComplete }) {
  const { state, updateProfileField } = useAppState();
  const savedValue = state.profile[field];
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const value = draft ?? savedValue;
  const inputId = `profile-${field}`;
  const errorId = `${inputId}-error`;

  const handleChange = (event) => {
    const nextValue = event.target.value;
    setDraft(nextValue);
    const nextError = validateProfileField(nextValue);
    setError(nextError);
    if (!nextError) {
      updateProfileField(field, nextValue);
    }
  };

  const handleBlur = () => {
    setDraft(null);
    setError('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.preventDefault();
      inputRef.current?.blur();
    }
  };

  return (
    <>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <Pill invalid={Boolean(error)}>
        <input
          ref={inputRef}
          className={styles.input}
          id={inputId}
          name={field}
          type="text"
          autoComplete={autoComplete}
          maxLength={30}
          size={Math.max(value.length, 2)}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      </Pill>
      <p className={styles.error} id={errorId} aria-live="polite">
        {error}
      </p>
    </>
  );
}
