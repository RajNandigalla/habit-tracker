import React, { createContext, useContext, useState, useEffect } from 'react';
import { Habit, Challenge, DEFAULT_CATEGORIES } from '../types';
import { storageService } from '../services/storageService';
import { useToast } from './ToastContext';
import { usePreferences } from './PreferencesProvider';
import { useCategories } from './CategoriesProvider';
import { calculateStreak, generateId, getTodayISO, audioManager, dayjs } from '../utils';

import { generateTestHabits } from '../mock/habitsMock';

const STORAGE_KEY = 'tickoff_habits';

interface HabitsContextType {
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string, date: string) => void;
  joinChallenge: (challenge: Challenge, existingHabitId?: string) => void;
  populateTestData: () => void;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) throw new Error('useHabits must be used within HabitsProvider');
  return context;
};

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const { preferences } = usePreferences();
  const { categories } = useCategories();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  // Load habits from storage ONCE on mount
  useEffect(() => {
    const loadHabits = async () => {
      const loaded = await storageService.getItemAsync<Habit[]>(STORAGE_KEY, []);
      console.log('Loaded habits:', loaded);

      // Migration: Convert old 'category' string to 'categoryIds' array
      const migrated = loaded.map(h => {
        // @ts-ignore - checking for old property
        if (h.category && !h.categoryIds) {
          // @ts-ignore
          const catLabel = h.category;
          const match = categories.find(c => c.label === catLabel);
          const catId =
            match?.id || DEFAULT_CATEGORIES.find(c => c.label === 'Other')?.id || 'cat_other';

          return {
            ...h,
            categoryIds: [catId],
          };
        }
        return h;
      });

      setHabits(migrated);
      setLoading(false);
    };
    loadHabits();
  }, [categories]);

  const addHabit = (habit: Habit) => {
    const newHabits = [habit, ...habits];
    setHabits(newHabits);
    storageService.setItemAsync(STORAGE_KEY, newHabits);
    addToast('Habit created successfully!', 'success');
  };

  const updateHabit = (updatedHabit: Habit) => {
    const newHabits = habits.map(h => (h.id === updatedHabit.id ? updatedHabit : h));
    setHabits(newHabits);
    storageService.setItemAsync(STORAGE_KEY, newHabits);
    addToast('Habit updated.', 'success');
  };

  const deleteHabit = (id: string) => {
    const newHabits = habits.filter(h => h.id !== id);
    setHabits(newHabits);
    storageService.setItemAsync(STORAGE_KEY, newHabits);
    addToast('Habit deleted.', 'info');
  };

  const toggleHabitCompletion = (id: string, date: string) => {
    const newHabits = habits.map(habit => {
      if (habit.id !== id) return habit;

      const isCompleted = habit.completedDates.includes(date);
      const newCompletedDates = isCompleted
        ? habit.completedDates.filter(d => d !== date)
        : [...habit.completedDates, date];

      const tempHabit = { ...habit, completedDates: newCompletedDates };
      const newStreak = calculateStreak(tempHabit);

      // Play sound for positive habit completion
      if (!isCompleted && habit.habitType === 'positive' && preferences.soundEnabled) {
        audioManager.playSuccess();
      }

      return {
        ...habit,
        completedDates: newCompletedDates,
        streak: newStreak,
      };
    });

    setHabits(newHabits);
    storageService.setItemAsync(STORAGE_KEY, newHabits);
  };

  const joinChallenge = (challenge: Challenge, existingHabitId?: string) => {
    const isActive = habits.some(h => h.challengeId === challenge.id);
    if (isActive) {
      addToast('You are already tracking this challenge!', 'info');
      return;
    }

    if (existingHabitId) {
      const newHabits = habits.map(h => {
        if (h.id === existingHabitId) {
          return {
            ...h,
            challengeId: challenge.id,
            challengeDuration: challenge.durationDays,
          };
        }
        return h;
      });
      setHabits(newHabits);
      storageService.setItemAsync(STORAGE_KEY, newHabits);
      addToast(`Challenge linked to existing habit!`, 'success');
      return;
    }

    const newHabit: Habit = {
      id: generateId(),
      name: challenge.habitTemplate.name,
      description: challenge.habitTemplate.description,
      categoryIds: [
        DEFAULT_CATEGORIES.find(c => c.label === challenge.habitTemplate.category)?.id ||
          DEFAULT_CATEGORIES[0].id,
      ],
      frequency: 'daily',
      habitType: 'positive',
      color: challenge.habitTemplate.color,
      completedDates: [],
      createdAt: getTodayISO(),
      streak: 0,
      challengeId: challenge.id,
      challengeDuration: challenge.durationDays,
    };

    const newHabits = [newHabit, ...habits];
    setHabits(newHabits);
    storageService.setItemAsync(STORAGE_KEY, newHabits);
    addToast(`Joined ${challenge.title}!`, 'success');
  };

  const populateTestData = () => {
    const habitsWithStreaks = generateTestHabits();
    setHabits(habitsWithStreaks);
    storageService.setItemAsync(STORAGE_KEY, habitsWithStreaks);
    addToast('Test data loaded!', 'success');
  };

  // Don't render children until data is loaded to prevent empty state flicker
  if (loading) {
    return null;
  }

  return (
    <HabitsContext.Provider
      value={{
        habits,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitCompletion,
        joinChallenge,
        populateTestData,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};
