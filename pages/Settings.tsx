import React from 'react';
import { useStore } from '../context/Store';
import { SettingsView } from '../views/SettingsView';
import { exportUserData, parseImportFile } from '../utils/dataUtils';

export const Settings: React.FC = () => {
  const {
    preferences,
    habits,
    journalEntries,
    toggleDarkMode,
    importData,
    populateTestData,
    clearAllData,
  } = useStore();

  const handleImportData = async (file: File): Promise<void> => {
    try {
      const content = await parseImportFile(file);
      await importData(content);
    } catch (err) {
      console.error('Import failed', err);
    }
  };

  const handleExportData = () => {
    exportUserData(habits, journalEntries, preferences);
  };

  return (
    <SettingsView
      preferences={preferences}
      onToggleDarkMode={toggleDarkMode}
      onExportData={handleExportData}
      onImportData={handleImportData}
      onPopulateTestData={populateTestData}
      onClearAllData={clearAllData}
    />
  );
};
