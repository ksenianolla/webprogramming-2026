import { BirdCard } from '../BirdCard/BirdCard.jsx';
import styles from './DeliveryClass.module.css';

export function DeliveryClass({ deliveryClass, birds, onSelectBird }) {
  const titleId = `${deliveryClass.id}-title`;

  return (
    <section className={styles.deliveryClass} aria-labelledby={titleId}>
      <h2 className={styles.title} id={titleId}>
        {deliveryClass.title}
      </h2>
      <ul className={styles.birds}>
        {birds.map((bird) => (
          <li className={styles.bird} key={bird.id}>
            <BirdCard bird={bird} onSelect={onSelectBird} />
          </li>
        ))}
      </ul>
    </section>
  );
}
