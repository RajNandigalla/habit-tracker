// Habit color palette using Tailwind color values
export const HABIT_COLORS = {
  indigo: '#6366f1',
  red: '#ef4444',
  amber: '#f59e0b',
  emerald: '#10b981',
  pink: '#ec4899',
  purple: '#8b5cf6',
  blue: '#3b82f6',
} as const;

// Array of color values for selection UI
export const HABIT_COLOR_VALUES = Object.values(HABIT_COLORS);

// Color names for accessibility labels
export const HABIT_COLOR_NAMES = [
  'Indigo',
  'Red',
  'Amber',
  'Emerald',
  'Pink',
  'Purple',
  'Blue',
] as const;
