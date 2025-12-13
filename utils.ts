import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Habit } from './types';

dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(isoWeek);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateId = () => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

export const formatDate = (date: string | Date, format: string = 'MMM D, YYYY') => {
  return dayjs(date).format(format);
};

export const getRelativeTime = (date: string | Date) => {
  return dayjs(date).fromNow();
};

export const getTodayISO = () => {
  return dayjs().format('YYYY-MM-DD');
};

// Check if a habit is scheduled for today
export const isHabitScheduledForDate = (habit: Habit, date: string): boolean => {
    if (habit.frequency === 'daily' || habit.frequency === 'weekly') return true;
    if (habit.frequency === 'specific_days' && habit.targetDays) {
        const dayOfWeek = dayjs(date).day();
        return habit.targetDays.includes(dayOfWeek);
    }
    return true;
};

export const calculateStreak = (habit: Habit): number => {
  const { completedDates, frequency, habitType, targetDays, targetCount, createdAt } = habit;
  const today = dayjs();
  const todayISO = today.format('YYYY-MM-DD');
  
  // Sort dates descending
  const sortedDates = [...completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // --- Negative Habits (To-Don't) ---
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

  // --- Positive Habits ---
  
  // 1. Weekly Frequency (X times per week)
  if (frequency === 'weekly') {
      const target = targetCount || 1;
      let currentStreakWeeks = 0;
      let checkWeek = today.startOf('isoWeek');
      
      // Iterate backwards by week
      while (true) {
          // Count completions in this ISO week
          const weekStart = checkWeek.format('YYYY-MM-DD');
          const weekEnd = checkWeek.endOf('isoWeek').format('YYYY-MM-DD');
          
          const weekCompletions = sortedDates.filter(d => {
             const dObj = dayjs(d);
             return (dObj.isAfter(checkWeek.subtract(1, 'second')) && dObj.isBefore(checkWeek.endOf('isoWeek').add(1, 'second')));
          }).length;
          
          if (weekCompletions >= target) {
              currentStreakWeeks++;
              checkWeek = checkWeek.subtract(1, 'week');
          } else {
              // If it's the CURRENT week, we haven't failed yet unless the week is over (which it isn't if it's "today")
              // BUT, we don't count the current week towards streak unless it IS completed.
              // So if current week is incomplete, we just check the previous week.
              // If previous week is complete, streak continues. If not, streak ends.
              
              if (checkWeek.isSame(today.startOf('isoWeek'), 'day')) {
                  checkWeek = checkWeek.subtract(1, 'week');
                  continue; 
              } else {
                  // A past week failed
                  break; 
              }
          }
          
          // Safety break
          if (dayjs(createdAt).diff(checkWeek, 'week') > 1) break;
      }
      return currentStreakWeeks;
  }

  // 2. Daily or Specific Days
  // Filter relevant dates first if specific days
  let relevantDates = sortedDates; 
  // For streak calculation logic, we check day by day backwards
  
  let currentStreak = 0;
  let checkDate = today;

  // If today is completed, start check from today.
  // If today is NOT completed, but today is NOT a scheduled day, check yesterday.
  // If today is NOT completed and IS scheduled, check yesterday (streak is 0 unless we implemented a grace period, usually 0).
  // Actually, standard logic: 
  // If I did it today -> streak includes today.
  // If I didn't do it today -> streak is calculated from yesterday. 
  //   If I didn't do it yesterday (and it was scheduled) -> streak 0.
  
  const isCompletedToday = sortedDates.includes(todayISO);
  
  if (!isCompletedToday) {
      // If not completed today, we start checking from yesterday
      checkDate = today.subtract(1, 'day');
      
      // Edge case: If today IS scheduled and missed, streak is potentially broken, 
      // but usually we display the streak from yesterday until today is "over". 
      // Most apps show streak X (from yesterday) and if you miss today it becomes 0 tomorrow.
  }

  // Max iterations (e.g. 365 days or until creation)
  for (let i = 0; i < 365 * 2; i++) {
      const dateStr = checkDate.format('YYYY-MM-DD');
      
      // Stop if before creation
      if (checkDate.isBefore(dayjs(createdAt), 'day')) break;

      const isScheduled = isHabitScheduledForDate(habit, dateStr);

      if (!isScheduled) {
          // If not scheduled, we skip this day and continue streak check backwards
          checkDate = checkDate.subtract(1, 'day');
          continue;
      }

      if (sortedDates.includes(dateStr)) {
          currentStreak++;
          checkDate = checkDate.subtract(1, 'day');
      } else {
          // Missed a scheduled day
          break;
      }
  }
  
  return currentStreak;
};

export const calculateHabitStats = (habit: Habit) => {
  const { completedDates } = habit;
  const totalCompletions = completedDates.length;
  
  // Calculate Longest Streak (Simplified approximation using current calculateStreak logic iteratively would be slow)
  // We'll stick to a simple daily consecutive check for "Longest Streak" statistic for now, 
  // or just use the basic logic for daily habits as a fallback for complex ones to avoid heavy computation.
  // Ideally this should be robust, but for this demo, we can use the `streak` field which is updated on toggle.
  // However, `longestStreak` is usually derived.
  
  // Simple iteration for "Best Streak" on daily habits. 
  // For complex schedules, "Best Streak" calculation is complex. 
  // We will return the current streak as best streak if calculation is too complex, or implemented simple consecutive sort.
  
  let longestStreak = 0;
  
  if (habit.frequency === 'daily' && habit.habitType === 'positive') {
      let currentCount = 0;
      const sortedDatesAsc = [...completedDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      
      for (let i = 0; i < sortedDatesAsc.length; i++) {
          if (i === 0) {
              currentCount = 1;
          } else {
              const prev = dayjs(sortedDatesAsc[i-1]);
              const curr = dayjs(sortedDatesAsc[i]);
              if (curr.diff(prev, 'day') === 1) {
                  currentCount++;
              } else if (curr.diff(prev, 'day') > 1) {
                  currentCount = 1;
              }
          }
          if (currentCount > longestStreak) longestStreak = currentCount;
      }
  } else {
      // Fallback for complex habits: just use current streak as best guess or 0
      longestStreak = habit.streak; 
  }

  // Completion Rate (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
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

// Simple success sound using AudioContext
export const playSuccessSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Sine wave for a pleasant "ding"
    oscillator.type = 'sine';
    
    // Frequency sweep: Start high, go slightly higher, then fade
    oscillator.frequency.setValueAtTime(500, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);

    // Envelope
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};