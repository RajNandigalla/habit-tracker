import { Habit } from '../types';
import dayjs from 'dayjs';

/**
 * Calculate weekly progress for a habit
 * @param habit - The habit to calculate progress for
 * @param weekStart - Optional ISO week start date (defaults to current week)
 * @returns Object with current completions and target count for the week
 */
export const calculateWeeklyProgress = (
  habit: Habit,
  weekStart?: string
): { current: number; target: number } | null => {
  if (habit.frequency !== 'weekly') return null;

  const startOfWeek = weekStart ? dayjs(weekStart) : dayjs().startOf('isoWeek');
  const endOfWeek = startOfWeek.endOf('isoWeek');

  const count = habit.completedDates.filter(d => {
    const dObj = dayjs(d);
    return (
      dObj.isAfter(startOfWeek.subtract(1, 'second')) && dObj.isBefore(endOfWeek.add(1, 'second'))
    );
  }).length;

  return {
    current: count,
    target: habit.targetCount || 1,
  };
};
