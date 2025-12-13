import React from 'react';
import { useStore } from '../context/Store';
import { AchievementsView } from '../components/views/AchievementsView';
import { useAchievements } from '../hooks/useAchievements';

export const Achievements: React.FC = () => {
  const { habits, journalEntries } = useStore();
  const achievements = useAchievements(habits, journalEntries);

  return <AchievementsView achievements={achievements} />;
};
