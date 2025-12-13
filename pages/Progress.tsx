import React from 'react';
import { useStore } from '../context/Store';
import { ProgressView } from '../views/ProgressView';
import { useProgressStats } from '../hooks/useProgressStats';

export const Progress: React.FC = () => {
  const { habits, journalEntries, preferences, toggleDarkMode } = useStore();
  const { stats, heatmapData, moodCorrelationData } = useProgressStats(habits, journalEntries);

  return (
    <ProgressView
      stats={stats}
      heatmapData={heatmapData}
      moodCorrelationData={moodCorrelationData}
      habits={habits}
      darkMode={preferences.darkMode}
      onToggleDarkMode={toggleDarkMode}
    />
  );
};
