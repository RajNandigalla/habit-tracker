import React from 'react';
import { SpinnerIcon } from '../icons';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost' | 'danger-ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';

interface BaseButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

type ButtonAsButton = BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
    href?: never;
  };

type ButtonAsLink = BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  leftIcon,
  rightIcon,
  ...props
}) => {
  // Added `active:scale-[0.96]` and `transition-all duration-200 ease-ios`
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-lg shadow-sm transition-all duration-200 ease-ios focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.96]';

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-indigo-600 text-white md:hover:bg-indigo-700 dark:md:hover:bg-indigo-500 disabled:bg-indigo-500 dark:disabled:bg-indigo-700 shadow-indigo-200 dark:shadow-none',
    secondary: 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 md:hover:bg-slate-50 dark:md:hover:bg-slate-600',
    outline: 'border-2 border-indigo-600 text-indigo-600 md:hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:md:hover:bg-indigo-900/20',
    danger: 'bg-red-600 text-white md:hover:bg-red-700 dark:md:hover:bg-red-500 disabled:bg-red-500 dark:disabled:bg-red-700',
    success: 'bg-green-600 text-white md:hover:bg-green-700 dark:md:hover:bg-green-500 disabled:bg-green-500 dark:disabled:bg-green-700',
    warning: 'bg-yellow-500 text-white md:hover:bg-yellow-600 dark:md:hover:bg-yellow-400 disabled:bg-yellow-400 dark:disabled:bg-yellow-600',
    ghost: 'bg-transparent text-slate-600 dark:text-slate-300 md:hover:bg-slate-100 dark:md:hover:bg-slate-700/50 shadow-none md:hover:text-indigo-600',
    'danger-ghost': 'bg-transparent text-red-600 dark:text-red-400 md:hover:bg-red-50 dark:md:hover:bg-red-900/20 shadow-none',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg',
    icon: 'p-2',
    'icon-sm': 'p-1.5',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    className,
  ].join(' ');

  const content = (
    <>
        {isLoading && <SpinnerIcon className="w-5 h-5 absolute" />}
        <span className={`flex items-center gap-2 transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            {leftIcon}
            {children}
            {rightIcon}
        </span>
    </>
  );

  if (props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <a href={href} className={combinedClasses} {...rest}>
        {content}
      </a>
    );
  } else {
    const isDisabled = (props as ButtonAsButton).disabled || isLoading;
    const { type = 'button', ...rest } = props as ButtonAsButton;
    return (
      <button type={type} className={combinedClasses} disabled={isDisabled} {...rest}>
        {content}
      </button>
    );
  }
};

export default Button;