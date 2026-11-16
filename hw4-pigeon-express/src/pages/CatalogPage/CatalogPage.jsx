import { useState } from 'react';
import { Header } from '../../components/Header/Header.jsx';
import { DeliveryClass } from '../../components/DeliveryClass/DeliveryClass.jsx';
import { OrderDialog } from '../../components/OrderDialog/OrderDialog.jsx';
import { birdKinds, deliveryClasses, getBirdsOfClass } from '../../data/birds.js';
import { readSessionFlag, writeSessionFlag } from '../../lib/storage.js';
import { useAppState } from '../../state/AppStateContext.jsx';
import { cx } from '../../lib/classNames.js';
import styles from './CatalogPage.module.css';

const ADDRESS_CONFIRMED_FLAG = 'sender-address-confirmed';

export function CatalogPage() {
  const { selectedAddress, hasOrderInProgress, putInCart } = useAppState();

  const [dialog, setDialog] = useState(() => {
    const shouldConfirmAddress =
      selectedAddress.sender && !hasOrderInProgress() && !readSessionFlag(ADDRESS_CONFIRMED_FLAG);
    return shouldConfirmAddress ? { type: 'senderAddress' } : null;
  });

  const closeDialog = () => {
    if (dialog?.type === 'senderAddress') {
      writeSessionFlag(ADDRESS_CONFIRMED_FLAG);
    }
    setDialog(null);
  };

  const handleSelectBird = (bird) => {
    setDialog(hasOrderInProgress() ? { type: 'oneOrder' } : { type: 'birdSelected', bird });
  };

  const dialogs = {
    senderAddress: () => ({
      title: 'Sender’s adress:',
      hint: selectedAddress.sender?.text,
      actions: [
        { label: 'confirm', variant: 'muted' },
        {
          label: 'change',
          to: '/profile',
          onClick: () => writeSessionFlag(ADDRESS_CONFIRMED_FLAG),
        },
      ],
    }),
    birdSelected: ({ bird }) => ({
      title: `${birdKinds[bird.kind].label} selected!`,
      hint: 'Proceed to Cart',
      actions: [
        { label: 'confirm', variant: 'muted', to: '/cart', onClick: () => putInCart(bird.id) },
        { label: 'change' },
      ],
    }),
    oneOrder: () => ({
      title: 'Unfortunately, you can make only one order at a time...',
      hint: 'Check current order?',
      actions: [{ label: 'check', to: '/order-status' }],
    }),
  };

  const isDimmed = dialog !== null && dialog.type !== 'senderAddress';

  return (
    <div className={cx(styles.page, isDimmed && styles.dimmed)}>
      <title>PigeonExpress — choose a delivery bird</title>
      <Header action="profile" />

      <main className={styles.catalog}>
        <h1 className="visually-hidden">Choose your delivery bird</h1>
        {deliveryClasses.map((deliveryClass) => (
          <DeliveryClass
            key={deliveryClass.id}
            deliveryClass={deliveryClass}
            birds={getBirdsOfClass(deliveryClass.id)}
            onSelectBird={handleSelectBird}
          />
        ))}
      </main>

      {dialog && (
        <OrderDialog
          key={dialog.type + (dialog.bird?.id ?? '')}
          {...dialogs[dialog.type](dialog)}
          onClose={closeDialog}
        />
      )}
    </div>
  );
}
