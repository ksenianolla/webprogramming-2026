import { useId, useLayoutEffect, useRef } from 'react';
import { ActionButton } from '../ActionButton/ActionButton.jsx';
import styles from './OrderDialog.module.css';

export function OrderDialog({ title, hint, actions, onClose }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
    return () => dialog?.close();
  }, []);

  const handleCancel = (event) => {
    event.preventDefault();
    onClose();
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className={styles.body}>
        <h2 className={styles.title} id={titleId}>
          {title}
        </h2>
        {hint && <p className={styles.hint}>{hint}</p>}
        <div className={styles.actions}>
          {actions.map((action) => (
            <ActionButton
              key={action.label}
              className={styles.action}
              variant={action.variant}
              to={action.to}
              onClick={() => {
                action.onClick?.();
                if (!action.to) {
                  onClose();
                }
              }}
            >
              {action.label}
            </ActionButton>
          ))}
        </div>
      </div>
    </dialog>
  );
}
