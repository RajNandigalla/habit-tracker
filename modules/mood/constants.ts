export type MoodOption = {
  value: number;
  label: string;
  emoji: string;
  color: string;
  id: string;
  description: string;
  bgClass: string;
};

export const MOOD_OPTIONS: MoodOption[] = [
  {
    value: 0,
    label: 'Angry',
    emoji: '😠',
    color: '#ef4444',
    id: 'angry',
    description: 'Feeling frustrated or upset',
    bgClass: 'bg-red-100 dark:bg-red-900/30',
  },
  {
    value: 1,
    label: 'Sad',
    emoji: '😢',
    color: '#f59e0b',
    id: 'sad',
    description: 'Feeling down or blue',
    bgClass: 'bg-slate-100 dark:bg-slate-800',
  },
  {
    value: 2,
    label: 'Neutral',
    emoji: '😐',
    color: '#64748b',
    id: 'neutral',
    description: 'Feeling okay, nothing special',
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    value: 3,
    label: 'Good',
    emoji: '🙂',
    color: '#84cc16',
    id: 'good',
    description: 'Feeling pretty good',
    bgClass: 'bg-lime-100 dark:bg-lime-900/30',
  },
  {
    value: 4,
    label: 'Happy',
    emoji: '😄',
    color: '#22c55e',
    id: 'happy',
    description: 'Feeling great and energized',
    bgClass: 'bg-green-100 dark:bg-green-900/30',
  },
];
