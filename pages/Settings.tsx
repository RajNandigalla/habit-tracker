import React from 'react';
import { useStore } from '../context/Store';
import { SettingsView } from '../views/SettingsView';

export const Settings: React.FC = () => {
  const { preferences, toggleDarkMode, importData, populateTestData, clearAllData } = useStore();

  const handleImportData = async (file: File): Promise<void> => {
    const reader = new FileReader();
    reader.onload = async e => {
      const content = e.target?.result as string;
      await importData(content);
    };
    reader.readAsText(file);
  };

  const handleExportData = () => {
    // TODO: Implement export functionality
    console.log('Export data not yet implemented');
  };

  const handlePrivacyPolicy = () => {
    // TODO: Implement privacy policy modal/page
    console.log('Privacy policy not yet implemented');
  };

  return (
    <SettingsView
      preferences={preferences}
      onToggleDarkMode={toggleDarkMode}
      onExportData={handleExportData}
      onImportData={handleImportData}
      onPopulateTestData={populateTestData}
      onClearAllData={clearAllData}
      onPrivacyPolicy={handlePrivacyPolicy}
    />
  );
};
