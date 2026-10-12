export const birdKinds = {
  pigeon: {
    label: 'Pigeon',
    image: 'images/pigeon.png',
    width: 334,
    height: 359,
    alt: 'Grey city pigeon',
  },
  dove: {
    label: 'Dove',
    image: 'images/dove.png',
    width: 366,
    height: 359,
    alt: 'White dove in flight',
  },
  owl: {
    label: 'Owl',
    image: 'images/owl.png',
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

export const defaultState = {
  profile: {
    name: 'Ksenia',
    surname: 'Ivanova',
  },
  addresses: {
    sender: [
      { id: 'griboyedov', text: 'Griboyedov Canal Embarkment, 123, room 317' },
      { id: 'khudozhnikov', text: 'Khudozhnikov street, 10, room 432' },
    ],
    receiver: [{ id: 'kantemitovskaya', text: 'Kantemitovskaya street, 3, room 3' }],
  },
  selectedAddress: {
    sender: 'griboyedov',
    receiver: null,
  },
  cart: null,
  order: null,
};
