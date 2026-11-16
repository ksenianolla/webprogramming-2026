import { useNotificationPermission } from '../../hooks/useNotificationPermission.js';
import { NotificationStatus } from '../../lib/notifications.js';
import { cx } from '../../lib/classNames.js';
import { ActionButton } from '../ActionButton/ActionButton.jsx';
import styles from './ArrivalAlert.module.css';

const messages = {
  [NotificationStatus.default]:
    'Get a notification when your bird arrives, even if this tab is in the background.',
  [NotificationStatus.granted]: 'Notifications are on. We will let you know when your bird arrives.',
  [NotificationStatus.denied]:
    'Notifications are blocked in your browser settings. We will remind you on the page instead.',
  [NotificationStatus.unsupported]:
    'Your browser can’t show notifications. We will remind you on the page instead.',
  [NotificationStatus.insecure]:
    'Notifications work only on a secure (https) page. We will remind you on the page instead.',
  [NotificationStatus.error]:
    'We couldn’t ask for permission to send notifications. We will remind you on the page instead.',
};

const workingStatuses = [NotificationStatus.default, NotificationStatus.granted];

export function ArrivalAlert({ className }) {
  const { status, isRequesting, request } = useNotificationPermission();
  const message = messages[status] ?? messages[NotificationStatus.error];

  return (
    <section
      className={cx(styles.alert, className)}
      aria-label="Arrival notification"
      aria-live="polite"
      data-status={status}
    >
      <p className={cx(styles.text, !workingStatuses.includes(status) && styles.textMuted)}>
        {message}
      </p>
      {status === NotificationStatus.default && (
        <ActionButton className={styles.button} size="small" disabled={isRequesting} onClick={request}>
          notify me
        </ActionButton>
      )}
    </section>
  );
}
