import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a color value to CSS variable format
 */
export const getColorValue = (color: string): string => {
  return `var(--color-${color})`;
};

/**
 * Gets the Tailwind class name for a color
 */
export const getColorClassName = (color: string): string => {
  return `bg-${color}`;
};
