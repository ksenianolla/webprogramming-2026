# PigeonExpress на React

Проект из прошлых заданий, переписанный на React + Vite.

- Приложение: https://ksenianolla.github.io/webprogramming-2026/hw4-pigeon-express/dist/
- Макеты в Figma: https://www.figma.com/design/fbfnzs2LCKKWPWP3NoyUkq/PigeonExpress-ucd?node-id=59-5&t=OwGBW2Xgq1tdeJ1I-1

## Запуск

```bash
npm install
npm run dev
```

Сборка: `npm run build`, результат в папке `dist/`.

## Структура

| Папка | Что внутри |
| --- | --- |
| `src/pages/` | Страницы: каталог, корзина, успешная оплата, статус заказа, профиль |
| `src/components/` | Компоненты, у каждого своя папка с `.jsx` и `.module.css` |
| `src/hooks/` | Свои хуки: таймер, прогресс доставки, разрешение на уведомления, видимость вкладки |
| `src/state/` | Состояние приложения: `useReducer` + Context, сохранение в `localStorage` |
| `src/data/`, `src/lib/` | Данные о птицах, форматирование, валидация, Notification API |

## Что используется

- Только React: без `querySelector` и ручного изменения DOM, диалоги открываются через `ref`
- CSS-модули (`*.module.css`), общие переменные в `src/styles/global.css`
- Хуки: `useState`, `useReducer`, `useEffect`, `useLayoutEffect`, `useRef`, `useContext`, `useMemo`, `useCallback`, `useId`, `useImperativeHandle`, `useSyncExternalStore`
- Роутинг: `react-router-dom` (`HashRouter`, чтобы работало на GitHub Pages)

| Экран | Компонент | Макет |
| --- | --- | --- |
| Каталог и диалоги | `CatalogPage` | [catalog](mockups/catalog.png), [address-confirm](mockups/address-confirm.png), [bird-selected](mockups/bird-selected.png), [one-order](mockups/one-order.png) |
| Корзина | `CartPage` | [cart](mockups/cart.png) |
| Успешная оплата | `PaymentSuccessPage` | [payment-success](mockups/payment-success.png) |
| Статус заказа | `OrderStatusPage` | [order-status](mockups/order-status.png) |
| Личные данные | `ProfilePage` | [profile](mockups/profile.png) |
