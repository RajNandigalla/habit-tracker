import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/Store';
import { ProgressView } from '../views/ProgressView';
import { useProgressStats } from '../hooks/useProgressStats';

export const Progress: React.FC = () => {
  const { habits, journalEntries, preferences, toggleDarkMode } = useStore();
  const { stats, heatmapData, moodCorrelationData } = useProgressStats(habits, journalEntries);

  // AI Modal State
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenAIModal = () => {
    navigate('/progress/report', { state: { background: location } });
  };

  return (
    <ProgressView
      stats={stats}
      heatmapData={heatmapData}
      moodCorrelationData={moodCorrelationData}
      habits={habits}
      darkMode={preferences.darkMode}
      onToggleDarkMode={toggleDarkMode}
      onOpenAIModal={handleOpenAIModal}
      // AI props handled by route now
      isAIModalOpen={false} // Placeholder to satisfy interface until updated
      onCloseAIModal={() => {}} // Placeholder
      aiReport={null} // Placeholder
      isGeneratingReport={false} // Placeholder
      onGenerateReport={() => {}} // Placeholder
    />
  );
};
