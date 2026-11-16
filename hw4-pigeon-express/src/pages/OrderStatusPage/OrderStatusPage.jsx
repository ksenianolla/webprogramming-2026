import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header.jsx';
import { ActionButton } from '../../components/ActionButton/ActionButton.jsx';
import { ArrivalAlert } from '../../components/ArrivalAlert/ArrivalAlert.jsx';
import { useAppState } from '../../state/AppStateContext.jsx';
import { useOrderProgress } from '../../hooks/useOrderProgress.js';
import { formatClock, formatMinutes, formatPrice, toIsoDuration } from '../../lib/format.js';
import styles from './OrderStatusPage.module.css';

function OrderDetails({ order }) {
  const rows = [
    ['Delivery bird', `${order.birdName}, ${order.deliveryClass}`],
    ['Price', formatPrice(order.price)],
    ['From', order.sender],
    ['To', order.receiver],
  ];

  return (
    <dl className={styles.details}>
      {rows.map(([label, value]) => (
        <div className={styles.row} key={label}>
          <dt className={styles.label}>{label}</dt>
          <dd className={styles.value}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function OrderStatusPage() {
  const { state, finishOrder } = useAppState();
  const navigate = useNavigate();
  const order = state.order;
  const progress = useOrderProgress(order);

  const startNewOrder = () => {
    finishOrder();
    navigate('/');
  };

  return (
    <>
      <title>PigeonExpress — order status</title>
      <Header action="back" />

      <main className={styles.status}>
        {!order && (
          <>
            <h1 className={styles.title}>You have no active orders</h1>
            <ActionButton className={styles.action} to="/">
              choose a bird
            </ActionButton>
          </>
        )}

        {order && (
          <>
            <h1 className={styles.title}>
              {progress.arrived ? 'Your bird has arrived!' : 'Your bird in on it’s way!'}
            </h1>
            <p className={styles.arrival} aria-live="polite">
              {progress.arrived ? (
                <>
                  Delivered at{' '}
                  <time dateTime={new Date(progress.arrivesAt).toISOString()}>
                    {formatClock(progress.arrivesAt)}
                  </time>
                </>
              ) : (
                <>
                  Arrives in ~{' '}
                  <time dateTime={toIsoDuration(progress.minutesLeft)}>
                    {formatMinutes(progress.minutesLeft)}
                  </time>
                </>
              )}
            </p>

            {!progress.arrived && <ArrivalAlert />}

            <OrderDetails order={order} />

            {progress.arrived && (
              <ActionButton className={styles.action} onClick={startNewOrder}>
                new order
              </ActionButton>
            )}
          </>
        )}
      </main>
    </>
  );
}
