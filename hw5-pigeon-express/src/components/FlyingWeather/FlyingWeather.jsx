import { Pill } from '../Pill/Pill.jsx';
import { summarizeWeather } from '../../lib/flyingWeather.js';
import { describeApiError } from '../../lib/apiMessages.js';
import styles from './FlyingWeather.module.css';

function WeatherValue({ status, weather, onRetry }) {
  if (status === 'loading') {
    return <span className={styles.muted}>checking the sky…</span>;
  }
  if (status === 'error') {
    return (
      <>
        <span className={styles.muted}>no weather data</span>
        <button className={styles.retry} type="button" onClick={onRetry}>
          try again
        </button>
      </>
    );
  }
  return summarizeWeather(weather);
}

export function FlyingWeather({ status, weather, error, onRetry }) {
  return (
    <>
      <dt>Flying weather in Saint Petersburg</dt>
      <Pill as="dd" className={styles.value} aria-live="polite" aria-busy={status === 'loading'}>
        <WeatherValue status={status} weather={weather} onRetry={onRetry} />
      </Pill>
      {status === 'error' && (
        <dd className={styles.note} role="alert">
          {describeApiError(error, 'check the weather')}. The delivery time is shown without the weather.
        </dd>
      )}
    </>
  );
}
