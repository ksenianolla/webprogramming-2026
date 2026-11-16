import { cx } from '../../lib/classNames.js';
import styles from './Pill.module.css';

export function Pill({ as: Element = 'div', invalid = false, className, children, ...props }) {
  return (
    <Element className={cx(styles.pill, invalid && styles.invalid, className)} {...props}>
      {children}
    </Element>
  );
}
