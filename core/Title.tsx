import React from 'react';
import { cn } from '../utils';

type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6;
type TitleWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
type TitleAlign = 'left' | 'center' | 'right';
type TitleColor = 'primary' | 'secondary' | 'muted' | 'gradient';

interface TitleProps {
  children: React.ReactNode;
  level?: TitleLevel;
  weight?: TitleWeight;
  align?: TitleAlign;
  color?: TitleColor;
  className?: string;
}

export const Title: React.FC<TitleProps> = ({
  children,
  level = 1,
  weight = 'bold',
  align = 'left',
  color = 'primary',
  className = '',
}) => {
  const Component = `h${level}` as React.ElementType;

  const levelClasses: Record<TitleLevel, string> = {
    1: 'text-4xl md:text-5xl leading-tight tracking-tight',
    2: 'text-3xl md:text-4xl leading-snug tracking-tight',
    3: 'text-xl md:text-3xl leading-snug',
    4: 'text-lg md:text-xl leading-normal',
    5: 'text-md md:text-lg leading-normal',
    6: 'text-base md:text-md leading-normal',
  };

  const weightClasses: Record<TitleWeight, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  };

  const alignClasses: Record<TitleAlign, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const colorClasses: Record<TitleColor, string> = {
    primary: 'text-slate-900 dark:text-slate-100',
    secondary: 'text-slate-700 dark:text-slate-200',
    muted: 'text-slate-600 dark:text-slate-400',
    gradient:
      'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent',
  };

  const classes = cn(
    levelClasses[level],
    weightClasses[weight],
    alignClasses[align],
    colorClasses[color],
    className
  );

  return <Component className={classes}>{children}</Component>;
};

export default Title;
