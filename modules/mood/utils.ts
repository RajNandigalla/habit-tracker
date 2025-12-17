import { MoodOption, MOOD_OPTIONS } from './constants';
import { first } from 'lodash';

export const getMoodById = (moodId: string): MoodOption | undefined => {
  return MOOD_OPTIONS.find(mood => mood.id === moodId);
};

export const getMoodIcon = (moodId: string): string => {
  const mood = getMoodById(moodId);
  return mood?.emoji || '😐';
};

export const getMoodLabel = (moodId: string): string => {
  const mood = getMoodById(moodId);
  return mood?.label || 'Unknown';
};

export const getMoodColor = (moodId: string): string => {
  const mood = getMoodById(moodId);
  return mood?.color || '#64748b';
};

export const getMoodBgClass = (moodId: string): string => {
  const mood = getMoodById(moodId);
  return mood?.bgClass || 'bg-slate-100 dark:bg-slate-800';
};

export const getDefaultMood = (): MoodOption => {
  return MOOD_OPTIONS[2]; // Neutral by default
};

export const getMoodByValue = (value: number): MoodOption | undefined => {
  return MOOD_OPTIONS.find(mood => mood.value === value);
};
