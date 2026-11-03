import { birdKinds } from '../data.js';
import { createElement } from '../dom.js';
import { formatPrice } from '../format.js';

export function createBirdCard(bird) {
  const kind = birdKinds[bird.kind];
  const price = formatPrice(bird.price);
  const modifier = bird.classId === 'heavy' ? ' bird-card--heavy' : '';

  return createElement('article', { className: `bird-card${modifier}` }, [
    createElement('img', {
      className: 'bird-card__photo',
      attrs: {
        src: kind.image,
        width: kind.width,
        height: kind.height,
        alt: kind.alt,
        loading: 'lazy',
      },
    }),
    createElement('h3', { className: 'bird-card__name', text: bird.name }),
    createElement('p', { className: 'bird-card__price', text: price }),
    createElement('button', {
      className: 'bird-card__select',
      attrs: { type: 'button', 'aria-label': `Select ${bird.name} for ${price}` },
      dataset: { birdId: bird.id },
    }),
  ]);
}
