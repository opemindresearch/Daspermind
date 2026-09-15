import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: IconName;
  children?: ReactNode;
};
export function IconButton({ label, icon, className = '', children, ...props }: Props) {
  return (
    <button type="button" {...props} className={`icon-button ${className}`} aria-label={label}>
      <Icon name={icon} />
      {children}
    </button>
  );
}
