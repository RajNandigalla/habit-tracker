import React, { createContext, useContext, useEffect, useState } from 'react';
import { Habit, JournalEntry, UserPreferences, ViewMode, HabitCategory, Challenge } from '../types';
import {
  calculateStreak,
  generateId,
  getTodayISO,
  audioManager,
  sortDatesDesc,
  dayjs,
} from '../utils';
import { storageService } from '../services/storageService';
import { useToast } from './ToastContext';

interface StoreContextType {
  habits: Habit[];
  journalEntries: JournalEntry[];
  preferences: UserPreferences;
  addHabit: (habit: Habit) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string, date: string) => void;
  joinChallenge: (challenge: Challenge, existingHabitId?: string) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  deleteJournalEntry: (id: string) => void;
  toggleDarkMode: () => void;
  toggleSound: () => void;
  setViewMode: (mode: ViewMode) => void;
  populateTestData: () => void;
  clearAllData: () => void;
  importData: (jsonData: string) => Promise<boolean>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

interface StoreProviderProps {
  children: React.ReactNode;
}

const STORAGE_KEYS = {
  HABITS: 'tickoff_habits',
  JOURNAL: 'tickoff_journal',
  PREFS: 'tickoff_prefs',
};

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const { addToast } = useToast();

  // Initialize state from localStorage or defaults
  const [habits, setHabits] = useState<Habit[]>(() => {
    return storageService.getItem<Habit[]>(STORAGE_KEYS.HABITS, []);
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    return storageService.getItem<JournalEntry[]>(STORAGE_KEYS.JOURNAL, []);
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    return storageService.getItem<UserPreferences>(STORAGE_KEYS.PREFS, {
      darkMode: false,
      viewMode: 'list',
      soundEnabled: true,
    });
  });

  // Effects for persistence
  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.HABITS, habits);
  }, [habits]);

  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.JOURNAL, journalEntries);
  }, [journalEntries]);

  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.PREFS, preferences);
    // Apply dark mode class to html element
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
      // Update audio manager
      audioManager.setEnabled(preferences.soundEnabled);
      return;
    }

    document.documentElement.classList.remove('dark');
    // Update audio manager
    audioManager.setEnabled(preferences.soundEnabled);
  }, [preferences]);

  // Actions
  const addHabit = (habit: Habit) => {
    setHabits(prev => [habit, ...prev]);
    addToast('Habit created successfully!', 'success');
  };

  const updateHabit = (updatedHabit: Habit) => {
    setHabits(prev => prev.map(h => (h.id === updatedHabit.id ? updatedHabit : h)));
    addToast('Habit updated.', 'success');
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    addToast('Habit deleted.', 'info');
  };

  const toggleHabitCompletion = (id: string, date: string) => {
    setHabits(prev =>
      prev.map(habit => {
        if (habit.id !== id) return habit;

        const isCompleted = habit.completedDates.includes(date);
        const newCompletedDates = isCompleted
          ? habit.completedDates.filter(d => d !== date)
          : [...habit.completedDates, date];

        // Temporary habit object for calculation
        const tempHabit = { ...habit, completedDates: newCompletedDates };

        // Recalculate streak
        const newStreak = calculateStreak(tempHabit);

        // Play sound for positive habit completion
        if (!isCompleted && habit.habitType === 'positive') {
          if (preferences.soundEnabled) {
            audioManager.playSuccess();
          }
        }

        return {
          ...habit,
          completedDates: newCompletedDates,
          streak: newStreak,
        };
      })
    );
  };

  const joinChallenge = (challenge: Challenge, existingHabitId?: string) => {
    // Check if already active
    const isActive = habits.some(h => h.challengeId === challenge.id);
    if (isActive) {
      addToast('You are already tracking this challenge!', 'info');
      return;
    }

    if (existingHabitId) {
      // Link to existing habit
      setHabits(prev =>
        prev.map(h => {
          if (h.id === existingHabitId) {
            return {
              ...h,
              challengeId: challenge.id,
              challengeDuration: challenge.durationDays,
            };
          }
          return h;
        })
      );
      addToast(`Challenge linked to existing habit!`, 'success');
      return;
    }

    // Create new habit
    const newHabit: Habit = {
      id: generateId(),
      name: challenge.habitTemplate.name,
      description: challenge.habitTemplate.description,
      category: challenge.habitTemplate.category,
      frequency: 'daily',
      habitType: 'positive',
      color: challenge.habitTemplate.color,
      completedDates: [],
      createdAt: getTodayISO(),
      streak: 0,
      challengeId: challenge.id,
      challengeDuration: challenge.durationDays,
    };

    setHabits(prev => [newHabit, ...prev]);
    addToast(`Joined ${challenge.title}!`, 'success');
  };

  const addJournalEntry = (entry: JournalEntry) => {
    setJournalEntries(prev => [entry, ...prev]);
    addToast('Journal entry saved.', 'success');
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries(prev => prev.filter(e => e.id !== id));
    addToast('Entry deleted.', 'info');
  };

  const toggleDarkMode = () => {
    setPreferences(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const toggleSound = () => {
    setPreferences(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const setViewMode = (mode: ViewMode) => {
    setPreferences(prev => ({ ...prev, viewMode: mode }));
  };

  const populateTestData = () => {
    const DAYS_BACK = 180; // 6 months of data
    const today = dayjs();

    // Helper to generate completion dates based on probability
    const generateDates = (consistency: number) => {
      const dates: string[] = [];
      for (let i = 0; i < DAYS_BACK; i++) {
        // Random chance based on consistency (0.0 - 1.0)
        if (Math.random() < consistency) {
          dates.push(today.subtract(i, 'day').format('YYYY-MM-DD'));
        }
      }
      return dates;
    };

    const dummyHabits: Habit[] = [
      {
        id: generateId(),
        name: 'Morning Jog',
        description: 'Run 5km every morning to boost energy.',
        category: HabitCategory.FITNESS,
        frequency: 'daily',
        habitType: 'positive',
        completedDates: generateDates(0.65), // 65% consistent
        createdAt: today.subtract(DAYS_BACK, 'day').toISOString(),
        streak: 0,
        color: '#f59e0b',
      },
      {
        id: generateId(),
        name: 'No Sugar',
        description: 'Avoid processed sugar.',
        category: HabitCategory.HEALTH,
        frequency: 'daily',
        habitType: 'negative',
        completedDates: [today.subtract(5, 'day').format('YYYY-MM-DD')], // One failure 5 days ago
        createdAt: today.subtract(DAYS_BACK, 'day').toISOString(),
        streak: 0,
        color: '#ef4444',
      },
      {
        id: generateId(),
        name: 'Gym (3x/Week)',
        description: 'Strength training.',
        category: HabitCategory.FITNESS,
        frequency: 'weekly',
        habitType: 'positive',
        targetCount: 3,
        completedDates: generateDates(0.5), // rough simulation
        createdAt: today.subtract(DAYS_BACK, 'day').toISOString(),
        streak: 0,
        color: '#3b82f6',
      },
      {
        id: generateId(),
        name: 'Read (Weekends)',
        description: 'Read on Sat/Sun.',
        category: HabitCategory.LEARNING,
        frequency: 'specific_days',
        habitType: 'positive',
        targetDays: [0, 6], // Sun, Sat
        completedDates: generateDates(0.4),
        createdAt: today.subtract(DAYS_BACK, 'day').toISOString(),
        streak: 0,
        color: '#8b5cf6',
      },
    ];

    // Recalculate streaks
    dummyHabits.forEach(h => {
      h.streak = calculateStreak(h);
    });

    const dummyEntries: JournalEntry[] = [];
    const moods = ['happy', 'motivated', 'neutral', 'sad', 'tired'];
    const sampleTexts = [
      'Really felt the burn today. Good progress on the run.',
      'Hard to focus, but got it done eventually.',
      'Amazing session! Feeling a lot of clarity.',
      'Skipped yesterday, but back on track today. Consistency is key.',
      'Need to adjust my schedule, evenings are getting too busy.',
      'Small win: maintained the streak for another day.',
      'Felt tired, but discipline > motivation.',
      'Hit a new personal best!',
      'Struggling a bit with motivation, but I know this will pay off.',
      'Great start to the morning. The water habit is really helping my energy.',
    ];

    for (let i = 0; i < 50; i++) {
      const randomDay = Math.floor(Math.random() * DAYS_BACK);
      const date = today.subtract(randomDay, 'day').toISOString();
      const habit = dummyHabits[Math.floor(Math.random() * dummyHabits.length)];

      dummyEntries.push({
        id: generateId(),
        date: date,
        content: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
        mood: moods[Math.floor(Math.random() * moods.length)] as any,
        habitId: Math.random() > 0.3 ? habit.id : undefined,
        aiAnalysis: Math.random() > 0.6 ? 'Consistency builds momentum. Keep going!' : undefined,
      });
    }

    dummyEntries.sort((a, b) => sortDatesDesc(a.date, b.date));

    setHabits(dummyHabits);
    setJournalEntries(dummyEntries);
    addToast('Populated test data with new scheduling types!', 'success');
  };

  const clearAllData = () => {
    setHabits([]);
    setJournalEntries([]);
    addToast('All data cleared.', 'success');
  };

  const importData = async (jsonString: string): Promise<boolean> => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.habits)) {
        // Migration check: add default fields if missing
        const migratedHabits = data.habits.map((h: any) => ({
          ...h,
          habitType: h.habitType || 'positive',
          frequency: h.frequency || 'daily',
        }));
        setHabits(migratedHabits);
      }
      if (Array.isArray(data.journalEntries)) {
        setJournalEntries(data.journalEntries);
      }
      addToast('Data imported successfully!', 'success');
      return true;
    } catch (e) {
      console.error('Import failed', e);
      addToast('Invalid data file.', 'error');
      return false;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        habits,
        journalEntries,
        preferences,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitCompletion,
        joinChallenge,
        addJournalEntry,
        deleteJournalEntry,
        toggleDarkMode,
        toggleSound,
        setViewMode,
        populateTestData,
        clearAllData,
        importData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
