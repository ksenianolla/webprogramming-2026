import { birdKinds } from '../../data/birds.js';
import { formatPrice } from '../../lib/format.js';
import { cx } from '../../lib/classNames.js';
import styles from './BirdCard.module.css';

export function BirdCard({ bird, onSelect }) {
  const kind = birdKinds[bird.kind];
  const price = formatPrice(bird.price);

  return (
    <article className={cx(styles.card, bird.classId === 'heavy' && styles.heavy)}>
      <img
        className={styles.photo}
        src={kind.image}
        width={kind.width}
        height={kind.height}
        alt={kind.alt}
        loading="lazy"
      />
      <h3 className={styles.name}>{bird.name}</h3>
      <p className={styles.price}>{price}</p>
      <button
        className={styles.select}
        type="button"
        aria-label={`Select ${bird.name} for ${price}`}
        onClick={() => onSelect(bird)}
      />
    </article>
  );
}
