import React from 'react';

export interface Habit {
  id: string;
  name: string;
  description: string;
  categoryIds: string[]; // Linked Category IDs
  frequency: HabitFrequency;
  habitType: HabitType;
  targetDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
  targetCount?: number; // For "X times per week"
  reminderTime?: string; // Format: "HH:mm" (24h)
  completedDates: string[]; // ISO Date strings (YYYY-MM-DD)
  createdAt: string;
  streak: number;
  color: string;
  // Challenge specific fields
  challengeId?: string;
  challengeDuration?: number; // Total days required
}

export type HabitType = 'positive' | 'negative';
export type HabitFrequency = 'daily' | 'weekly' | 'specific_days';

export interface Category {
  id: string;
  label: string;
  icon?: string; // Emoji or icon name
  color?: string; // Tailwind color name (e.g., 'red-500')
  isArchived: boolean;
  isDefault?: boolean; // If true, cannot be renamed/deleted?
}

// Default Categories for initialization
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat_health',
    label: 'Health',
    icon: '❤️',
    color: 'red-500',
    isArchived: false,
    isDefault: true,
  },
  {
    id: 'cat_work',
    label: 'Work',
    icon: '💼',
    color: 'blue-500',
    isArchived: false,
    isDefault: true,
  },
  {
    id: 'cat_learning',
    label: 'Learning',
    icon: '📚',
    color: 'violet-500',
    isArchived: false,
    isDefault: true,
  },
  {
    id: 'cat_mindfulness',
    label: 'Mindfulness',
    icon: '🧘',
    color: 'emerald-500',
    isArchived: false,
    isDefault: true,
  },
  {
    id: 'cat_fitness',
    label: 'Fitness',
    icon: '💪',
    color: 'amber-500',
    isArchived: false,
    isDefault: true,
  },
  {
    id: 'cat_other',
    label: 'Other',
    icon: '✨',
    color: 'indigo-600',
    isArchived: false,
    isDefault: true,
  },
];

export type HabitCategory = string;

export interface JournalEntry {
  id: string;
  habitId?: string; // Optional link to a specific habit
  date: string; // ISO String
  content: string;
  imageUrl?: string;
  mood?: 'happy' | 'neutral' | 'sad' | 'motivated' | 'tired';
  aiAnalysis?: string;
}

export interface UserPreferences {
  darkMode: boolean;
  viewMode: 'list' | 'streak';
  soundEnabled: boolean;
  fontSize: number;
}

export type ViewMode = 'list' | 'streak';

export interface AIResponse {
  text: string;
  suggestion?: string;
}

export enum QuickActionType {
  HABIT = 'HABIT',
  JOURNAL = 'JOURNAL',
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType; // Storing component reference for rendering
  isUnlocked: boolean;
  progress: number; // 0 to 100
  color: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  category: HabitCategory;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: React.ElementType;
  color: string;
  habitTemplate: {
    name: string;
    description: string;
    category: HabitCategory;
    color: string;
  };
}
