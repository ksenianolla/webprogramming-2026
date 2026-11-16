import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageVisibility } from '../../hooks/usePageVisibility.js';
import styles from './Toast.module.css';

const HIDE_AFTER_MS = 12_000;

export function Toast({ text, linkLabel, linkTo, onClose }) {
  const visibility = usePageVisibility();

  useEffect(() => {
    if (visibility === 'hidden') {
      return undefined;
    }
    const timer = setTimeout(onClose, HIDE_AFTER_MS);
    return () => clearTimeout(timer);
  }, [visibility, onClose]);

  return (
    <div className={styles.toast} role="status">
      <p className={styles.text}>{text}</p>
      {linkTo && (
        <Link className={styles.link} to={linkTo} onClick={onClose}>
          {linkLabel}
        </Link>
      )}
      <button className={styles.close} type="button" aria-label="Close" onClick={onClose}>
        ×
      </button>
    </div>
  );
}
