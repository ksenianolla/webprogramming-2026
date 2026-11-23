import { Link } from 'react-router-dom';
import { cx } from '../../lib/classNames.js';
import styles from './ActionButton.module.css';

export function ActionButton({ to, variant = 'primary', size = 'regular', className, children, ...props }) {
  const classes = cx(
    styles.action,
    variant === 'muted' && styles.muted,
    size === 'small' && styles.small,
    className,
  );

  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}
