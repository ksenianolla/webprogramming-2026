export const NotificationStatus = Object.freeze({
  unsupported: 'unsupported',
  insecure: 'insecure',
  default: 'default',
  granted: 'granted',
  denied: 'denied',
  error: 'error',
});

export function getNotificationStatus() {
  if (!('Notification' in window)) {
    return NotificationStatus.unsupported;
  }
  if (!window.isSecureContext) {
    return NotificationStatus.insecure;
  }
  return Notification.permission;
}

function askPermission() {
  return new Promise((resolve, reject) => {
    const result = Notification.requestPermission(resolve);
    if (result && typeof result.then === 'function') {
      result.then(resolve, reject);
    }
  });
}

export async function requestNotificationPermission() {
  const status = getNotificationStatus();
  if (status !== NotificationStatus.default) {
    return status;
  }
  try {
    const permission = await askPermission();
    return permission ?? getNotificationStatus();
  } catch {
    return NotificationStatus.error;
  }
}

export function showSystemNotification({ title, body, tag, icon, onClick }) {
  if (getNotificationStatus() !== NotificationStatus.granted) {
    return false;
  }
  try {
    const notification = new Notification(title, { body, tag, icon });
    notification.addEventListener('click', () => {
      window.focus();
      notification.close();
      onClick?.();
    });
    return true;
  } catch {
    return false;
  }
}
