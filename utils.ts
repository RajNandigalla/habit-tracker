import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Habit } from './types';
import { dayjs, getTodayISO, sortDatesDesc, sortDatesAsc, getCurrentTimestamp } from './utils/date';

export * from './utils/date';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateId = () => {
  // Use getCurrentTimestamp helper instead of Date.now()
  return Math.random().toString(36).substring(2, 9) + getCurrentTimestamp().toString(36);
};

// Check if a habit is scheduled for today
export const isHabitScheduledForDate = (habit: Habit, date: string): boolean => {
  if (habit.frequency === 'daily' || habit.frequency === 'weekly') return true;
  if (habit.frequency !== 'specific_days' || !habit.targetDays) return true;

  const dayOfWeek = dayjs(date).day();
  return habit.targetDays.includes(dayOfWeek);
};

export const calculateStreak = (habit: Habit): number => {
  const { completedDates, frequency, habitType, targetDays, targetCount, createdAt } = habit;
  const today = dayjs();
  const todayISO = today.format('YYYY-MM-DD');

  // Sort dates descending logic replaced with helper
  const sortedDates = [...completedDates].sort(sortDatesDesc);

  if (habitType === 'negative') {
    // completedDates represents "Incidents" (failures)
    if (sortedDates.length === 0) {
      // No incidents ever? Streak is days since creation
      return today.diff(dayjs(createdAt), 'day');
    }

    const lastIncident = dayjs(sortedDates[0]);
    if (lastIncident.format('YYYY-MM-DD') === todayISO) {
      // Incident today, streak broken
      return 0;
    }

    return today.diff(lastIncident, 'day');
  }

  // 1. Weekly Frequency (X times per week)
  if (frequency === 'weekly') {
    const target = targetCount || 1;
    let currentStreakWeeks = 0;
    let checkWeek = today.startOf('isoWeek');
    let isStreaking = true;

    // Iterate backwards by week
    while (isStreaking) {
      if (dayjs(createdAt).diff(checkWeek, 'week') > 1) {
        isStreaking = false;
      }

      if (isStreaking) {
        const weekCompletions = sortedDates.filter(d => {
          const dObj = dayjs(d);
          return (
            dObj.isAfter(checkWeek.subtract(1, 'second')) &&
            dObj.isBefore(checkWeek.endOf('isoWeek').add(1, 'second'))
          );
        }).length;

        let processedThisWeek = false;

        if (weekCompletions >= target) {
          currentStreakWeeks++;
          checkWeek = checkWeek.subtract(1, 'week');
          processedThisWeek = true;
        }

        if (!processedThisWeek && checkWeek.isSame(today.startOf('isoWeek'), 'day')) {
          checkWeek = checkWeek.subtract(1, 'week');
          processedThisWeek = true;
        }

        if (!processedThisWeek) {
          isStreaking = false;
        }
      }
    }
    return currentStreakWeeks;
  }

  // 2. Daily or Specific Days
  // Filter relevant dates first if specific days
  let relevantDates = sortedDates;
  // For streak calculation logic, we check day by day backwards

  let currentStreak = 0;
  let checkDate = today;

  const isCompletedToday = sortedDates.includes(todayISO);

  if (!isCompletedToday) {
    // If not completed today, we start checking from yesterday
    checkDate = today.subtract(1, 'day');
  }

  // Max iterations (e.g. 365 days or until creation)
  let isCounting = true;
  for (let i = 0; i < 365 * 2; i++) {
    if (!isCounting) break;

    const dateStr = checkDate.format('YYYY-MM-DD');

    // Stop if before creation
    if (checkDate.isBefore(dayjs(createdAt), 'day')) {
      isCounting = false;
    }

    if (isCounting) {
      const isScheduled = isHabitScheduledForDate(habit, dateStr);
      let proceedToNextDay = false;

      if (!isScheduled) {
        proceedToNextDay = true;
      }

      if (isScheduled && sortedDates.includes(dateStr)) {
        currentStreak++;
        proceedToNextDay = true;
      }

      if (proceedToNextDay) {
        checkDate = checkDate.subtract(1, 'day');
      }

      if (!proceedToNextDay) {
        isCounting = false;
      }
    }
  }

  return currentStreak;
};

export const calculateHabitStats = (habit: Habit) => {
  const { completedDates } = habit;
  const totalCompletions = completedDates.length;

  // Calculate Longest Streak (Simplified approximation using current calculateStreak logic iteratively would be slow)
  // We'll stick to a simple daily consecutive check for "Longest Streak" statistic for now.

  let longestStreak = 0;

  // Fallback for complex habits
  if (habit.frequency !== 'daily' || habit.habitType !== 'positive') {
    return {
      totalCompletions,
      longestStreak: habit.streak,
      completionRate: Math.round(
        (completedDates.filter(d =>
          Array.from({ length: 30 }, (_, i) =>
            dayjs().subtract(i, 'day').format('YYYY-MM-DD')
          ).includes(d)
        ).length /
          30) *
          100
      ),
    };
  }

  // Daily Positive Logic
  longestStreak = 0;
  let currentCount = 0;
  const sortedDatesAscData = [...completedDates].sort(sortDatesAsc);

  if (sortedDatesAscData.length > 0) {
    currentCount = 1;
    longestStreak = 1;
  }

  for (let i = 1; i < sortedDatesAscData.length; i++) {
    const prev = dayjs(sortedDatesAscData[i - 1]);
    const curr = dayjs(sortedDatesAscData[i]);
    const diff = curr.diff(prev, 'day');

    if (diff === 1) {
      currentCount++;
    }

    if (diff > 1) {
      currentCount = 1;
    }

    longestStreak = Math.max(longestStreak, currentCount);
  }

  // Completion Rate (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) =>
    dayjs().subtract(i, 'day').format('YYYY-MM-DD')
  );
  const completionsInLast30 = completedDates.filter(d => last30Days.includes(d)).length;
  const completionRate = Math.round((completionsInLast30 / 30) * 100);

  return { totalCompletions, longestStreak, completionRate };
};

export const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Re-export habit utilities
export { calculateWeeklyProgress } from './utils/habitUtils';

// Audio playback - using centralized AudioManager to prevent memory leaks
export { audioManager } from './utils/audioManager';
