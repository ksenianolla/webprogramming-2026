import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header.jsx';
import { BackLink } from '../../components/BackLink/BackLink.jsx';
import { Pill } from '../../components/Pill/Pill.jsx';
import { AddressBook } from '../../components/AddressBook/AddressBook.jsx';
import { ActionButton } from '../../components/ActionButton/ActionButton.jsx';
import { formatPrice } from '../../lib/format.js';
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

export function CartPage() {
  const { cartBird, missingAddressKinds, hasOrderInProgress, placeOrder } = useAppState();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const senderBookRef = useRef(null);
  const receiverBookRef = useRef(null);
  const bookRefs = { sender: senderBookRef, receiver: receiverBookRef };

  const handleSubmit = (event) => {
    event.preventDefault();
    const [missingKind] = missingAddressKinds;
    if (missingKind) {
      setError(missingAddressMessages[missingKind]);
      bookRefs[missingKind].current?.focusFirstOption();
      return;
    }
    if (!placeOrder()) {
      setError('Only one order can be active at a time');
      return;
    }
    navigate('/payment-success');
  };

  const clearError = () => setError('');

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

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
            <ActionButton className={styles.pay} type="submit">
              pay {formatPrice(cartBird.price)}
            </ActionButton>
          </form>
        ) : (
          <EmptyCart hasActiveOrder={hasOrderInProgress()} />
        )}
      </main>
    </>
  );
}
