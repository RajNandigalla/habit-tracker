import { useMemo } from 'react';
import { Habit, JournalEntry, Achievement, HabitCategory } from '../types';
import {
  Zap,
  Activity,
  Rocket,
  Star,
  Target,
  Award,
  Shield,
  CheckCircle2,
  Crown,
  Flame,
  Gem,
  Trophy,
  Sun,
  Moon,
  Heart,
  Briefcase,
  Brain,
  Leaf,
  Dumbbell,
  Layers,
  BookOpen,
  Camera,
  Flag,
  Cloud,
  Calendar,
  PartyPopper,
  type LucideIcon,
} from 'lucide-react';

// Achievement template definitions (static data - defined once)
const MILESTONE_LEVELS = [
  {
    count: 1,
    title: 'First Step',
    icon: Zap,
    color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20',
  },
  {
    count: 10,
    title: 'Rolling',
    icon: Activity,
    color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20',
  },
  {
    count: 25,
    title: 'Momentum',
    icon: Rocket,
    color: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/20',
  },
  {
    count: 50,
    title: 'Half Century',
    icon: Star,
    color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/20',
  },
  {
    count: 100,
    title: 'Century Club',
    icon: Target,
    color: 'text-red-500 bg-red-100 dark:bg-red-900/20',
  },
  {
    count: 250,
    title: 'Dedicated',
    icon: Award,
    color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/20',
  },
  {
    count: 500,
    title: 'Committed',
    icon: Shield,
    color: 'text-green-500 bg-green-100 dark:bg-green-900/20',
  },
  {
    count: 750,
    title: 'Disciplined',
    icon: CheckCircle2,
    color: 'text-teal-500 bg-teal-100 dark:bg-teal-900/20',
  },
  {
    count: 1000,
    title: 'Grandmaster',
    icon: Crown,
    color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/20',
  },
  {
    count: 1500,
    title: 'Unstoppable',
    icon: Flame,
    color: 'text-rose-500 bg-rose-100 dark:bg-rose-900/20',
  },
  {
    count: 2000,
    title: 'Virtuoso',
    icon: Gem,
    color: 'text-fuchsia-500 bg-fuchsia-100 dark:bg-fuchsia-900/20',
  },
  {
    count: 3000,
    title: 'Titan',
    icon: Trophy,
    color: 'text-slate-700 bg-slate-200 dark:text-slate-200 dark:bg-slate-700',
  },
  {
    count: 5000,
    title: 'Legend',
    icon: Sun,
    color: 'text-yellow-600 bg-yellow-200 dark:text-yellow-300 dark:bg-yellow-800',
  },
  {
    count: 7500,
    title: 'Mythic',
    icon: Moon,
    color: 'text-violet-600 bg-violet-200 dark:text-violet-300 dark:bg-violet-800',
  },
  {
    count: 10000,
    title: 'Godlike',
    icon: Zap,
    color: 'text-cyan-600 bg-cyan-200 dark:text-cyan-300 dark:bg-cyan-800',
  },
];

const STREAK_MILESTONES = [
  { count: 3, title: 'Hat Trick', icon: Flame },
  { count: 7, title: 'Week Warrior', icon: Calendar },
  { count: 14, title: 'Fortnight', icon: Calendar },
  { count: 21, title: 'Habit Former', icon: CheckCircle2 },
  { count: 30, title: 'Month Master', icon: Star },
  { count: 60, title: 'Two Months', icon: Layers },
  { count: 90, title: 'Quarterly', icon: Shield },
  { count: 100, title: 'Centurion', icon: Target },
  { count: 180, title: 'Half Year', icon: Award },
  { count: 365, title: 'Yearly Focus', icon: Crown },
  { count: 500, title: 'Streak King', icon: Trophy },
  { count: 1000, title: 'Eternal', icon: Gem },
];

const CATEGORY_LEVELS = [
  { count: 10, suffix: 'Novice' },
  { count: 25, suffix: 'Apprentice' },
  { count: 50, suffix: 'Regular' },
  { count: 100, suffix: 'Pro' },
  { count: 250, suffix: 'Expert' },
  { count: 500, suffix: 'Master' },
  { count: 1000, suffix: 'Guru' },
  { count: 2000, suffix: 'Sage' },
];

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  [HabitCategory.HEALTH]: Heart,
  [HabitCategory.WORK]: Briefcase,
  [HabitCategory.LEARNING]: Brain,
  [HabitCategory.MINDFULNESS]: Leaf,
  [HabitCategory.FITNESS]: Dumbbell,
  [HabitCategory.OTHER]: Layers,
};

const CATEGORY_COLORS: Record<string, string> = {
  [HabitCategory.HEALTH]: 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400',
  [HabitCategory.WORK]: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400',
  [HabitCategory.LEARNING]:
    'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400',
  [HabitCategory.MINDFULNESS]: 'text-teal-600 bg-teal-100 dark:bg-teal-900/20 dark:text-teal-400',
  [HabitCategory.FITNESS]:
    'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400',
  [HabitCategory.OTHER]: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400',
};

const JOURNAL_LEVELS = [
  { count: 1, title: 'Dear Diary' },
  { count: 5, title: 'Note Taker' },
  { count: 10, title: 'Reflector' },
  { count: 25, title: 'Chronicler' },
  { count: 50, title: 'Author' },
  { count: 100, title: 'Biographer' },
  { count: 200, title: 'Historian' },
  { count: 365, title: 'Daily Writer' },
  { count: 500, title: 'Scribe' },
  { count: 1000, title: 'Archivist' },
];

const PHOTO_LEVELS = [
  { count: 1, title: 'Shutterbug' },
  { count: 5, title: 'Visualizer' },
  { count: 10, title: 'Photographer' },
  { count: 25, title: 'Artist' },
  { count: 50, title: 'Gallery Curator' },
];

export const useAchievements = (habits: Habit[], journalEntries: JournalEntry[]) => {
  return useMemo(() => {
    const list: Achievement[] = [
      {
        id: 'welcome-aboard',
        title: 'Welcome Aboard',
        description: 'Thanks for joining us on this journey!',
        icon: PartyPopper,
        isUnlocked: true,
        progress: 100,
        color: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400',
      },
    ];

    let totalCompletions = 0;
    let longestStreak = 0;

    habits.forEach(habit => {
      totalCompletions += habit.completedDates.length;
      if (habit.streak > longestStreak) longestStreak = habit.streak;
    });

    const stats = { totalCompletions, longestStreak };

    const categoryCounts: Record<string, number> = {};
    Object.values(HabitCategory).forEach(c => (categoryCounts[c] = 0));

    habits.forEach(h => {
      if (categoryCounts[h.category] !== undefined) {
        categoryCounts[h.category] += h.completedDates.length;
      }
    });

    const photoJournalCount = journalEntries.filter(j => j.imageUrl).length;
    const distinctCategories = new Set(habits.map(h => h.category)).size;

    MILESTONE_LEVELS.forEach(m => {
      list.push({
        id: `milestone-${m.count}`,
        title: m.title,
        description: `Complete ${m.count} habits total.`,
        icon: m.icon,
        isUnlocked: stats.totalCompletions >= m.count,
        progress: Math.min((stats.totalCompletions / m.count) * 100, 100),
        color: m.color,
      });
    });

    STREAK_MILESTONES.forEach(m => {
      list.push({
        id: `streak-${m.count}`,
        title: m.title,
        description: `Reach a ${m.count}-day streak.`,
        icon: m.icon,
        isUnlocked: stats.longestStreak >= m.count,
        progress: Math.min((stats.longestStreak / m.count) * 100, 100),
        color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
      });
    });

    Object.values(HabitCategory).forEach(cat => {
      const currentCount = categoryCounts[cat] || 0;
      CATEGORY_LEVELS.forEach(level => {
        list.push({
          id: `cat-${cat}-${level.count}`,
          title: `${cat} ${level.suffix}`,
          description: `Complete ${level.count} ${cat} habits.`,
          icon: CATEGORY_ICONS[cat],
          isUnlocked: currentCount >= level.count,
          progress: Math.min((currentCount / level.count) * 100, 100),
          color: CATEGORY_COLORS[cat],
        });
      });
    });
    JOURNAL_LEVELS.forEach(l => {
      list.push({
        id: `journal-${l.count}`,
        title: l.title,
        description: `Write ${l.count} journal entries.`,
        icon: BookOpen,
        isUnlocked: journalEntries.length >= l.count,
        progress: Math.min((journalEntries.length / l.count) * 100, 100),
        color: 'text-pink-600 bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400',
      });
    });

    PHOTO_LEVELS.forEach(l => {
      list.push({
        id: `photo-${l.count}`,
        title: l.title,
        description: `Add ${l.count} photos to journal.`,
        icon: Camera,
        isUnlocked: photoJournalCount >= l.count,
        progress: Math.min((photoJournalCount / l.count) * 100, 100),
        color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400',
      });
    });

    list.push({
      id: 'polymath',
      title: 'Polymath',
      description: 'Track habits in 3+ categories.',
      icon: Brain,
      isUnlocked: distinctCategories >= 3,
      progress: Math.min((distinctCategories / 3) * 100, 100),
      color: 'text-fuchsia-600 bg-fuchsia-100 dark:bg-fuchsia-900/20 dark:text-fuchsia-400',
    });

    list.push({
      id: 'early-adopter',
      title: 'Beginner Luck',
      description: 'Create your very first habit.',
      icon: Flag,
      isUnlocked: habits.length > 0,
      progress: habits.length > 0 ? 100 : 0,
      color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400',
    });

    const sadEntries = journalEntries.filter(j => j.mood === 'sad').length;
    list.push({
      id: 'resilient',
      title: 'Resilient',
      description: 'Journal through 5 tough days.',
      icon: Cloud,
      isUnlocked: sadEntries >= 5,
      progress: Math.min((sadEntries / 5) * 100, 100),
      color: 'text-slate-500 bg-slate-200 dark:bg-slate-700 dark:text-slate-300',
    });

    const happyEntries = journalEntries.filter(
      j => j.mood === 'happy' || j.mood === 'motivated'
    ).length;
    list.push({
      id: 'optimist',
      title: 'Optimist',
      description: 'Record 10 positive journal entries.',
      icon: Sun,
      isUnlocked: happyEntries >= 10,
      progress: Math.min((happyEntries / 10) * 100, 100),
      color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400',
    });

    return list;
  }, [habits, journalEntries]);
};
