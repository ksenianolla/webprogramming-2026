import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header.jsx';
import { BackLink } from '../../components/BackLink/BackLink.jsx';
import { Pill } from '../../components/Pill/Pill.jsx';
import { AddressBook } from '../../components/AddressBook/AddressBook.jsx';
import { ActionButton } from '../../components/ActionButton/ActionButton.jsx';
import { FlyingWeather } from '../../components/FlyingWeather/FlyingWeather.jsx';
import { formatMinutes, formatPrice } from '../../lib/format.js';
import { describeDelay, getWeatherDelay } from '../../lib/flyingWeather.js';
import { findDeliveryClass } from '../../data/birds.js';
import { useFlyingWeather } from '../../hooks/useFlyingWeather.js';
import { useOrderSubmission } from '../../hooks/useOrderSubmission.js';
import { useAppState } from '../../state/AppStateContext.jsx';
import styles from './CartPage.module.css';

const missingAddressMessages = {
  sender: 'Choose the sender’s address',
  receiver: 'Choose the reciever’s address',
};

function EmptyCart({ hasActiveOrder }) {
  return (
    <section className={styles.empty} aria-labelledby="cart-empty-title">
      <h2 className={styles.emptyTitle} id="cart-empty-title">
        {hasActiveOrder ? 'Your bird is already on its way' : 'Your cart is empty'}
      </h2>
      <ActionButton to={hasActiveOrder ? '/order-status' : '/'}>
        {hasActiveOrder ? 'check order' : 'choose a bird'}
      </ActionButton>
    </section>
  );
}

function DeliveryTime({ bird, weather }) {
  const baseMinutes = findDeliveryClass(bird.classId).etaMinutes;
  const delay = getWeatherDelay(weather);

  return (
    <>
      <dt>Delivery time</dt>
      <Pill as="dd" aria-live="polite">
        ~ {formatMinutes(baseMinutes + delay.minutes)}
      </Pill>
      {weather && <dd className={styles.note}>{describeDelay(delay)}</dd>}
    </>
  );
}

export function CartPage() {
  const { cartBird, missingAddressKinds, hasOrderInProgress, prepareOrder, placeOrder } = useAppState();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const weather = useFlyingWeather();
  const submission = useOrderSubmission();
  const senderBookRef = useRef(null);
  const receiverBookRef = useRef(null);
  const bookRefs = { sender: senderBookRef, receiver: receiverBookRef };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submission.isSending) {
      return;
    }
    const [missingKind] = missingAddressKinds;
    if (missingKind) {
      setError(missingAddressMessages[missingKind]);
      bookRefs[missingKind].current?.focusFirstOption();
      return;
    }
    const draft = prepareOrder(weather.weather);
    if (!draft) {
      setError('Only one order can be active at a time');
      return;
    }
    const savedOrder = await submission.submit(draft);
    if (!savedOrder) {
      return;
    }
    if (!placeOrder(savedOrder)) {
      setError('Only one order can be active at a time');
      return;
    }
    navigate('/payment-success');
  };

  const clearError = () => {
    setError('');
    submission.clearError();
  };

  const visibleError = error || submission.error;

  return (
    <>
      <title>PigeonExpress — cart</title>
      <Header />

      <main className={styles.checkout}>
        <h1 className="visually-hidden">Your order</h1>
        <BackLink className={styles.back} />

        {cartBird ? (
          <form className={styles.form} noValidate onSubmit={handleSubmit}>
            <dl className={styles.summary}>
              <dt>Delivery bird</dt>
              <Pill as="dd">{cartBird.name}</Pill>
              <dt>Price</dt>
              <Pill as="dd">{formatPrice(cartBird.price)}</Pill>
              <FlyingWeather
                status={weather.status}
                weather={weather.weather}
                error={weather.error}
                onRetry={weather.retry}
              />
              <DeliveryTime bird={cartBird} weather={weather.weather} />
            </dl>

            <AddressBook
              ref={senderBookRef}
              kind="sender"
              legend="Sender’s address:"
              onChange={clearError}
            />
            <AddressBook
              ref={receiverBookRef}
              kind="receiver"
              legend="Reciever’s address:"
              onChange={clearError}
            />

            {visibleError && (
              <p className={styles.error} role="alert">
                {visibleError}
              </p>
            )}
            <ActionButton
              className={styles.pay}
              type="submit"
              disabled={submission.isSending}
              aria-busy={submission.isSending}
            >
              {submission.isSending ? 'paying…' : `pay ${formatPrice(cartBird.price)}`}
            </ActionButton>
          </form>
        ) : (
          <EmptyCart hasActiveOrder={hasOrderInProgress()} />
        )}
      </main>
    </>
  );
}
