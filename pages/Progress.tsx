import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { ProgressView } from '../views/ProgressView';
import { useProgressStats } from '../hooks/useProgressStats';

export const Progress: React.FC = () => {
  const { habits, journalEntries, preferences, toggleDarkMode } = useStore();
  const { stats, heatmapData, moodCorrelationData } = useProgressStats(habits, journalEntries);

  // AI Modal State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleOpenAIModal = () => {
    setIsAIModalOpen(true);
  };

  const handleCloseAIModal = () => {
    setIsAIModalOpen(false);
  };

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    // TODO: Implement AI report generation logic here
    // For now, just set a placeholder
    setTimeout(() => {
      setAiReport('AI report will be generated here...');
      setIsGeneratingReport(false);
    }, 2000);
  };

  return (
    <ProgressView
      stats={stats}
      heatmapData={heatmapData}
      moodCorrelationData={moodCorrelationData}
      habits={habits}
      darkMode={preferences.darkMode}
      onToggleDarkMode={toggleDarkMode}
      isAIModalOpen={isAIModalOpen}
      onOpenAIModal={handleOpenAIModal}
      onCloseAIModal={handleCloseAIModal}
      aiReport={aiReport}
      isGeneratingReport={isGeneratingReport}
      onGenerateReport={handleGenerateReport}
    />
  );
};
