import React from 'react';
import { useStore } from '../context/Store';
import { DashboardView } from '../components/views/DashboardView';

export const Dashboard: React.FC = () => {
  const { habits, preferences, setViewMode, toggleDarkMode, addHabit, deleteHabit, toggleHabitCompletion } = useStore();

  return (
    <DashboardView 
      habits={habits}
      viewMode={preferences.viewMode}
      darkMode={preferences.darkMode}
      onViewModeChange={setViewMode}
      onToggleDarkMode={toggleDarkMode}
      onAddHabit={addHabit}
      onDeleteHabit={deleteHabit}
      onToggleCompletion={toggleHabitCompletion}
    />
  );
};
