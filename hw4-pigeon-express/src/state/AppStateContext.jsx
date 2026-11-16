import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { defaultState } from '../data/defaultState.js';
import { findBird, findDeliveryClass } from '../data/birds.js';
import { STATE_KEY, loadState, saveState } from '../lib/storage.js';
import { createId } from '../lib/format.js';
import { isOrderInProgress } from '../lib/orderProgress.js';
import { normalizeAddress, validateAddress, validateProfileField } from '../lib/validation.js';
import { appReducer } from './appReducer.js';

const AppStateContext = createContext(null);

const addressKinds = ['sender', 'receiver'];

function readStoredState() {
  return loadState(defaultState);
}

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, undefined, readStoredState);
  const skipNextSave = useRef(false);

  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    saveState(state);
  }, [state]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === STATE_KEY) {
        skipNextSave.current = true;
        dispatch({ type: 'replaceState', state: readStoredState() });
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const markOrderNotified = useCallback((orderId) => {
    const fresh = readStoredState();
    if (fresh.order?.id !== orderId || fresh.order.notified) {
      return false;
    }
    saveState({ ...fresh, order: { ...fresh.order, notified: true } });
    dispatch({ type: 'markOrderNotified', orderId });
    return true;
  }, []);

  const value = useMemo(() => {
    const cartBird = state.cart ? findBird(state.cart.birdId) : null;

    const selectedAddress = Object.fromEntries(
      addressKinds.map((kind) => [
        kind,
        state.addresses[kind].find((address) => address.id === state.selectedAddress[kind]) ?? null,
      ]),
    );

    const missingAddressKinds = addressKinds.filter((kind) => !selectedAddress[kind]);

    return {
      state,
      cartBird,
      selectedAddress,
      missingAddressKinds,
      hasOrderInProgress: () => isOrderInProgress(state.order),

      updateProfileField(field, value) {
        const error = validateProfileField(value);
        if (!error) {
          dispatch({ type: 'updateProfile', field, value: value.trim() });
        }
        return error;
      },

      selectAddress(kind, id) {
        dispatch({ type: 'selectAddress', kind, id });
      },

      validateNewAddress(kind, text) {
        return validateAddress(state.addresses[kind], text);
      },

      addAddress(kind, text) {
        const error = validateAddress(state.addresses[kind], text);
        if (error) {
          return { error, address: null };
        }
        const address = { id: createId(kind), text: normalizeAddress(text) };
        dispatch({ type: 'addAddress', kind, address });
        return { error: '', address };
      },

      removeAddress(kind, id) {
        dispatch({ type: 'removeAddress', kind, id });
      },

      putInCart(birdId) {
        if (findBird(birdId)) {
          dispatch({ type: 'putInCart', birdId });
        }
      },

      placeOrder() {
        if (!cartBird || missingAddressKinds.length > 0 || isOrderInProgress(state.order)) {
          return null;
        }
        const deliveryClass = findDeliveryClass(cartBird.classId);
        const order = {
          id: createId('order'),
          birdId: cartBird.id,
          birdName: cartBird.name,
          deliveryClass: deliveryClass.title,
          price: cartBird.price,
          sender: selectedAddress.sender.text,
          receiver: selectedAddress.receiver.text,
          createdAt: Date.now(),
          etaMinutes: deliveryClass.etaMinutes,
          notified: false,
        };
        dispatch({ type: 'placeOrder', order });
        return order;
      },

      markOrderNotified,

      finishOrder() {
        dispatch({ type: 'finishOrder' });
      },
    };
  }, [state, markOrderNotified]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return context;
}
