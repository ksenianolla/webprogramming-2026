import { useCallback, useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppStateProvider } from './state/AppStateContext.jsx';
import { useArrivalWatcher } from './hooks/useArrivalWatcher.js';
import { usePageVisibility } from './hooks/usePageVisibility.js';
import { showSystemNotification } from './lib/notifications.js';
import { Toast } from './components/Toast/Toast.jsx';
import { CatalogPage } from './pages/CatalogPage/CatalogPage.jsx';
import { CartPage } from './pages/CartPage/CartPage.jsx';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage/PaymentSuccessPage.jsx';
import { OrderStatusPage } from './pages/OrderStatusPage/OrderStatusPage.jsx';
import { ProfilePage } from './pages/ProfilePage/ProfilePage.jsx';
import pigeonImage from './assets/images/pigeon.png';

const STATUS_PATH = '/order-status';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const visibility = usePageVisibility();
  const [toast, setToast] = useState(null);
  const closeToast = useCallback(() => setToast(null), []);

  useArrivalWatcher((order) => {
    const title = 'Your bird has arrived!';
    const body = `${order.birdName} is waiting at ${order.receiver}`;

    const shownBySystem =
      visibility === 'hidden' &&
      showSystemNotification({
        title,
        body,
        tag: order.id,
        icon: pigeonImage,
        onClick: () => navigate(STATUS_PATH),
      });

    if (!shownBySystem && location.pathname !== STATUS_PATH) {
      setToast({ id: order.id, text: `${title} ${body}.` });
    }
  });

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path={STATUS_PATH} element={<OrderStatusPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {toast && (
        <Toast
          key={toast.id}
          text={toast.text}
          linkLabel="check"
          linkTo={STATUS_PATH}
          onClose={closeToast}
        />
      )}
    </>
  );
}

export function App() {
  return (
    <HashRouter>
      <AppStateProvider>
        <AppRoutes />
      </AppStateProvider>
    </HashRouter>
  );
}
