import React from 'react';
import { PreferencesProvider, usePreferences } from './PreferencesProvider';
import { JournalProvider, useJournal } from './JournalProvider';
import { CategoriesProvider, useCategories } from './CategoriesProvider';
import { HabitsProvider, useHabits } from './HabitsProvider';
import { clearAllData, importData } from '../mock/dataUtils';

/**
 * Combined Store Provider - wraps all individual providers
 */
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PreferencesProvider>
      <CategoriesProvider>
        <JournalProvider>
          <HabitsProvider>{children}</HabitsProvider>
        </JournalProvider>
      </CategoriesProvider>
    </PreferencesProvider>
  );
};

/**
 * Combined useStore hook for backward compatibility
 * Use individual hooks (useHabits, useJournal, etc.) for better performance
 */
export const useStore = () => {
  const habits = useHabits();
  const journal = useJournal();
  const preferences = usePreferences();
  const categories = useCategories();

  return {
    // Habits
    habits: habits.habits,
    addHabit: habits.addHabit,
    updateHabit: habits.updateHabit,
    deleteHabit: habits.deleteHabit,
    toggleHabitCompletion: habits.toggleHabitCompletion,
    joinChallenge: habits.joinChallenge,
    populateTestData: habits.populateTestData,

    // Journal
    journalEntries: journal.journalEntries,
    addJournalEntry: journal.addJournalEntry,
    deleteJournalEntry: journal.deleteJournalEntry,

    // Preferences
    preferences: preferences.preferences,
    toggleDarkMode: preferences.toggleDarkMode,
    toggleSound: preferences.toggleSound,
    setViewMode: preferences.setViewMode,

    // Categories
    categories: categories.categories,
    addCategory: categories.addCategory,
    updateCategory: categories.updateCategory,
    archiveCategory: categories.archiveCategory,
    restoreCategory: categories.restoreCategory,

    // Data management
    clearAllData,
    importData,
  };
};

// Export individual hooks for better performance
export { useHabits } from './HabitsProvider';
export { useJournal } from './JournalProvider';
export { usePreferences } from './PreferencesProvider';
export { useCategories } from './CategoriesProvider';
