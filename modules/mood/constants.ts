export type MoodOption = {
  value: number;
  label: string;
  emoji: string;
  color: string;
  id: string;
};

export const MOOD_OPTIONS: MoodOption[] = [
  { value: 0, label: 'Angry', emoji: '😠', color: '#ef4444', id: 'angry' },
  { value: 1, label: 'Sad', emoji: '😢', color: '#f59e0b', id: 'sad' },
  { value: 2, label: 'Neutral', emoji: '😐', color: '#64748b', id: 'neutral' }, // Or "Stumped" as per image, but Neutral is more standard
  { value: 3, label: 'Good', emoji: '🙂', color: '#84cc16', id: 'good' },
  { value: 4, label: 'Happy', emoji: '😄', color: '#22c55e', id: 'happy' },
];
