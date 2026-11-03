# PigeonExpress — браузерное API

Приложение из второго задания с подключённым Notification API: когда птица долетает до получателя, браузер присылает уведомление, даже если вкладка свёрнута.

- Приложение: https://ksenianolla.github.io/webprogramming-2026/hw3-pigeon-express/
- Макеты в Figma: https://www.figma.com/design/fbfnzs2LCKKWPWP3NoyUkq/PigeonExpress-ucd?node-id=59-5&t=OwGBW2Xgq1tdeJ1I-1

## Как работает

1. После оплаты на странице «Successful payment» и на странице статуса заказа появляется кнопка **notify me**.
2. По нажатию браузер спрашивает разрешение на уведомления.
3. Когда время доставки выходит, на любой открытой странице приложения срабатывает напоминание:
   - вкладка в фоне и уведомления разрешены — приходит системное уведомление, клик по нему открывает статус заказа;
   - вкладка открыта — внизу страницы появляется сообщение со ссылкой на статус.
4. Уведомление приходит один раз на заказ, даже если открыто несколько страниц.

## Обработка ошибок

| Ситуация | Что видит пользователь |
| --- | --- |
| Браузер не поддерживает уведомления | Сообщение об этом, напоминание показывается на странице |
| Страница открыта не по https | Сообщение об этом, напоминание на странице |
| Уведомления запрещены в настройках | Подсказка, где их включить, напоминание на странице |
| Запрос разрешения закрыт без ответа | Кнопка **notify me** остаётся, можно спросить ещё раз |
| Запрос разрешения завершился ошибкой | Сообщение об ошибке, напоминание на странице |
| Браузер запрещает создавать уведомление со страницы (Chrome на Android) | Ошибка перехватывается, напоминание на странице |

## Модули

| Файл | Назначение |
| --- | --- |
| `js/notifications.js` | Обёртка над Notification API: проверка поддержки, запрос разрешения, показ уведомления |
| `js/order-watcher.js` | Следит за временем доставки и выбирает способ напоминания |
| `js/components/arrival-alert.js` | Блок с кнопкой **notify me** и статусом разрешения |
| `js/components/toast.js` | Напоминание внутри страницы |
| `js/store.js` | Состояние приложения, отметка «уведомление уже показано» |
| `js/data.js`, `js/storage.js`, `js/dom.js`, `js/format.js` | Данные, `localStorage`, создание DOM, форматирование |
| `js/components/`, `js/pages/` | Компоненты интерфейса и скрипты страниц |

## Запуск

ES-модули и уведомления не работают при открытии файла напрямую (`file://`). Локально запускайте через сервер, например Live Server в VS Code или `python3 -m http.server`, и открывайте `http://localhost`.

| Экран | Файл | Макет |
| --- | --- | --- |
| Каталог и диалоги | [index.html](index.html) | [catalog.png](mockups/catalog.png), [address-confirm.png](mockups/address-confirm.png), [bird-selected.png](mockups/bird-selected.png), [one-order.png](mockups/one-order.png) |
| Корзина | [cart.html](cart.html) | [cart.png](mockups/cart.png) |
| Успешная оплата | [payment-success.html](payment-success.html) | [payment-success.png](mockups/payment-success.png) |
| Статус заказа | [order-status.html](order-status.html) | [order-status.png](mockups/order-status.png) |
| Личные данные | [profile.html](profile.html) | [profile.png](mockups/profile.png) |
