import React from 'react';
import { useStore } from '../context/Store';
import { SettingsView } from '../components/views/SettingsView';

export const Settings: React.FC = () => {
  const {
    preferences,
    toggleDarkMode,
    habits,
    journalEntries,
    importData,
    populateTestData,
    clearAllData,
  } = useStore();

  return (
    <SettingsView
      preferences={preferences}
      onToggleDarkMode={toggleDarkMode}
      habits={habits}
      journalEntries={journalEntries}
      onImportData={importData}
      onPopulateTestData={populateTestData}
      onClearAllData={clearAllData}
    />
  );
};
