import { Link } from 'react-router-dom';
import { Header } from '../../components/Header/Header.jsx';
import { ArrivalAlert } from '../../components/ArrivalAlert/ArrivalAlert.jsx';
import { useAppState } from '../../state/AppStateContext.jsx';
import { useOrderProgress } from '../../hooks/useOrderProgress.js';
import { formatMinutes, toIsoDuration } from '../../lib/format.js';
import { cx } from '../../lib/classNames.js';
import owlImage from '../../assets/images/owl.png';
import doveImage from '../../assets/images/dove.png';
import pigeonImage from '../../assets/images/pigeon-large.png';
import styles from './PaymentSuccessPage.module.css';

const REFRESH_INTERVAL_MS = 15_000;

function WaitTime({ progress }) {
  if (progress.arrived) {
    return 'Your bird has arrived!';
  }
  return (
    <>
      Approximate wait time:{' '}
      <time dateTime={toIsoDuration(progress.minutesLeft)}>{formatMinutes(progress.minutesLeft)}</time>
    </>
  );
}

export function PaymentSuccessPage() {
  const { state } = useAppState();
  const order = state.order;
  const progress = useOrderProgress(order, REFRESH_INTERVAL_MS);

  return (
    <>
      <title>PigeonExpress — successful payment</title>
      <Header action="back" />

      <main className={styles.result}>
        <img className={cx(styles.bird, styles.owl)} src={owlImage} width="410" height="402" alt="" />
        <img className={cx(styles.bird, styles.dove)} src={doveImage} width="366" height="359" alt="" />

        <h1 className={cx(styles.line, styles.title)}>
          {order ? 'Successful payment!!!' : 'There is no paid order yet'}
        </h1>

        {order && (
          <p className={cx(styles.line, styles.message)}>
            Your bird is on it’s way. Do not forget to write your message and open the window!
          </p>
        )}

        <p className={cx(styles.line, styles.wait)}>
          {order ? (
            <Link className={styles.track} to="/order-status">
              <WaitTime progress={progress} />
            </Link>
          ) : (
            <Link className={styles.track} to="/">
              Choose a delivery bird
            </Link>
          )}
        </p>

        {order && !progress.arrived && <ArrivalAlert className={styles.alert} />}

        <img
          className={cx(styles.bird, styles.pigeon)}
          src={pigeonImage}
          width="725"
          height="779"
          alt=""
        />
      </main>
    </>
  );
}
