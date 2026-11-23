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
