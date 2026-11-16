export function appReducer(state, action) {
  switch (action.type) {
    case 'replaceState':
      return action.state;

    case 'updateProfile':
      return { ...state, profile: { ...state.profile, [action.field]: action.value } };

    case 'selectAddress': {
      const exists = state.addresses[action.kind].some((address) => address.id === action.id);
      if (!exists) {
        return state;
      }
      return { ...state, selectedAddress: { ...state.selectedAddress, [action.kind]: action.id } };
    }

    case 'addAddress':
      return {
        ...state,
        addresses: {
          ...state.addresses,
          [action.kind]: [...state.addresses[action.kind], action.address],
        },
        selectedAddress: { ...state.selectedAddress, [action.kind]: action.address.id },
      };

    case 'removeAddress': {
      const rest = state.addresses[action.kind].filter((address) => address.id !== action.id);
      const selectedId = state.selectedAddress[action.kind];
      return {
        ...state,
        addresses: { ...state.addresses, [action.kind]: rest },
        selectedAddress: {
          ...state.selectedAddress,
          [action.kind]: selectedId === action.id ? (rest[0]?.id ?? null) : selectedId,
        },
      };
    }

    case 'putInCart':
      return { ...state, cart: { birdId: action.birdId } };

    case 'placeOrder':
      return { ...state, order: action.order, cart: null };

    case 'markOrderNotified':
      if (state.order?.id !== action.orderId) {
        return state;
      }
      return { ...state, order: { ...state.order, notified: true } };

    case 'finishOrder':
      return { ...state, order: null };

    default:
      return state;
  }
}
