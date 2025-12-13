import React from 'react';
import { cn } from '../utils';

type TextVariant = 'body' | 'small' | 'caption' | 'label' | 'code';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextAlign = 'left' | 'center' | 'right';
type TextColor = 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'danger' | 'inherit';

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  weight?: TextWeight;
  align?: TextAlign;
  color?: TextColor;
  className?: string;
  as?: 'p' | 'span' | 'div' | 'label';
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  weight = 'normal',
  align = 'left',
  color = 'primary',
  className = '',
  as: Component = 'p',
}) => {
  const variantClasses: Record<TextVariant, string> = {
    body: 'text-base leading-relaxed',
    small: 'text-sm leading-normal',
    caption: 'text-xs leading-tight',
    label: 'text-sm font-medium leading-tight',
    code: 'text-sm font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded',
  };

  const weightClasses: Record<TextWeight, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const alignClasses: Record<TextAlign, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const colorClasses: Record<TextColor, string> = {
    primary: 'text-slate-900 dark:text-slate-100',
    secondary: 'text-slate-700 dark:text-slate-300',
    muted: 'text-slate-500 dark:text-slate-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
    inherit: '',
  };

  const classes = cn(
    variantClasses[variant],
    weightClasses[weight],
    alignClasses[align],
    colorClasses[color],
    className
  );

  return <Component className={classes}>{children}</Component>;
};

export default Text;
