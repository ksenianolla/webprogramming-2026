import { Link } from 'react-router-dom';
import { BackIcon } from '../Icons/BackIcon.jsx';
import { cx } from '../../lib/classNames.js';
import styles from './BackLink.module.css';

export function BackLink({ className }) {
  return (
    <Link className={cx(styles.backLink, className)} to="/" aria-label="Back to the catalog">
      <BackIcon className={styles.icon} />
    </Link>
  );
}
