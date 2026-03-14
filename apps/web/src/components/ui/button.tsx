import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'mint' | 'ink';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
  variant?: ButtonVariant;
};

const variantClassNames: Record<ButtonVariant, string> = {
  primary: 'bg-lemon',
  secondary: 'bg-white',
  mint: 'bg-mint',
  ink: 'bg-ink text-white',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, fullWidth = false, type = 'button', variant = 'primary', ...props },
    ref,
  ) => (
    <button
      className={cn(
        'neo-button',
        variantClassNames[variant],
        fullWidth && 'w-full',
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    />
  ),
);

Button.displayName = 'Button';
