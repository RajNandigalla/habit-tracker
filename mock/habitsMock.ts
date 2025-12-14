import { Habit, DEFAULT_CATEGORIES } from '../types';
import { generateId, calculateStreak, dayjs } from '../utils';

const DAYS_BACK = 180;

/**
 * Generate random completion dates based on consistency percentage
 */
const generateDates = (consistency: number): string[] => {
  const today = dayjs();
  const dates: string[] = [];

  for (let i = 0; i < DAYS_BACK; i++) {
    if (Math.random() < consistency) {
      dates.push(today.subtract(i, 'day').format('YYYY-MM-DD'));
    }
  }

  return dates;
};

/**
 * Generate test habits with realistic data for demos
 */
export const generateTestHabits = (): Habit[] => {
  const today = dayjs();

  const testHabits: Habit[] = [
    {
      id: generateId(),
      name: 'Morning Meditation',
      description: '10 minutes of mindfulness',
      categoryIds: [DEFAULT_CATEGORIES.find(c => c.label === 'Health')?.id || 'cat_health'],
      frequency: 'daily',
      habitType: 'positive',
      color: '#10b981',
      completedDates: generateDates(0.85),
      createdAt: today.subtract(DAYS_BACK, 'day').format('YYYY-MM-DD'),
      streak: 0,
    },
    {
      id: generateId(),
      name: 'Read 20 Pages',
      description: 'Daily reading habit',
      categoryIds: [DEFAULT_CATEGORIES.find(c => c.label === 'Learning')?.id || 'cat_learning'],
      frequency: 'daily',
      habitType: 'positive',
      color: '#3b82f6',
      completedDates: generateDates(0.7),
      createdAt: today.subtract(DAYS_BACK, 'day').format('YYYY-MM-DD'),
      streak: 0,
    },
    {
      id: generateId(),
      name: 'Exercise',
      description: '30 min workout',
      categoryIds: [DEFAULT_CATEGORIES.find(c => c.label === 'Fitness')?.id || 'cat_fitness'],
      frequency: 'daily',
      habitType: 'positive',
      color: '#ef4444',
      completedDates: generateDates(0.6),
      createdAt: today.subtract(DAYS_BACK, 'day').format('YYYY-MM-DD'),
      streak: 0,
    },
  ];

  // Recalculate streaks
  return testHabits.map(h => ({
    ...h,
    streak: calculateStreak(h),
  }));
};
