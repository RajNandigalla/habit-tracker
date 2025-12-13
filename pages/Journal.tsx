import React from 'react';
import { useStore } from '../context/Store';
import { JournalView } from '../components/views/JournalView';

export const Journal: React.FC = () => {
  const { journalEntries, habits, addJournalEntry, preferences, toggleDarkMode } = useStore();

  return (
    <JournalView
      entries={journalEntries}
      habits={habits}
      onAddEntry={addJournalEntry}
      darkMode={preferences.darkMode}
      onToggleDarkMode={toggleDarkMode}
    />
  );
};
