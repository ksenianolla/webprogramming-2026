import { Link } from 'react-router-dom';
import { BackLink } from '../BackLink/BackLink.jsx';
import { ProfileIcon } from '../Icons/ProfileIcon.jsx';
import { cx } from '../../lib/classNames.js';
import styles from './Header.module.css';

export function Header({ action = null }) {
  return (
    <header className={styles.header}>
      <Link className={styles.logo} to="/">
        PigeonExpress
      </Link>

      {action === 'profile' && (
        <nav className={styles.nav} aria-label="Account">
          <Link className={styles.profile} to="/profile" aria-label="Personal info">
            <ProfileIcon className={styles.profileIcon} />
          </Link>
        </nav>
      )}

      {action === 'back' && (
        <nav className={cx(styles.nav, styles.navBack)} aria-label="Back">
          <BackLink />
        </nav>
      )}
    </header>
  );
}
