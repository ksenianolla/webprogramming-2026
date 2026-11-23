import pigeonImage from '../assets/images/pigeon.png';
import doveImage from '../assets/images/dove.png';
import owlImage from '../assets/images/owl.png';

export const birdKinds = {
  pigeon: {
    label: 'Pigeon',
    image: pigeonImage,
    width: 334,
    height: 359,
    alt: 'Grey city pigeon',
  },
  dove: {
    label: 'Dove',
    image: doveImage,
    width: 366,
    height: 359,
    alt: 'White dove in flight',
  },
  owl: {
    label: 'Owl',
    image: owlImage,
    width: 410,
    height: 402,
    alt: 'Eagle owl with outstretched claws',
  },
};

export const deliveryClasses = [
  { id: 'economy', title: 'Economy class', etaMinutes: 5 },
  { id: 'premium', title: 'Premium class', etaMinutes: 3 },
  { id: 'heavy', title: 'Heavy delivery', etaMinutes: 8 },
];

const flock = [
  { classId: 'economy', kind: 'pigeon', name: 'George', price: 3, count: 6 },
  { classId: 'premium', kind: 'dove', name: 'Louisa', price: 6, count: 6 },
  { classId: 'heavy', kind: 'owl', name: 'Hedwig', price: 10, count: 6 },
];

export const birds = flock.flatMap(({ count, ...bird }) =>
  Array.from({ length: count }, (_, index) => ({ ...bird, id: `${bird.classId}-${index + 1}` })),
);

export function findBird(id) {
  return birds.find((bird) => bird.id === id) ?? null;
}

export function findDeliveryClass(id) {
  return deliveryClasses.find((deliveryClass) => deliveryClass.id === id) ?? null;
}

export function getBirdsOfClass(classId) {
  return birds.filter((bird) => bird.classId === classId);
}
