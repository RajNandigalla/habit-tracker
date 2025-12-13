import React from 'react';
import { useStore } from '../context/Store';
import { SettingsView } from '../components/views/SettingsView';
import { getTodayISO } from '../utils';
import { useToast } from '../context/ToastContext';

export const Settings: React.FC = () => {
  const { preferences, toggleDarkMode, habits, journalEntries, importData, populateTestData, clearAllData } = useStore();
  const { addToast } = useToast();

  const handleExportData = () => {
    const data = {
        habits,
        journalEntries,
        exportDate: getTodayISO()
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `tickoff_backup_${getTodayISO()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportData = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
        const text = e.target?.result as string;
        if(text) {
           await importData(text);
        }
    };
    reader.readAsText(file);
  };

  const handlePrivacyPolicy = () => {
      addToast("Privacy Policy coming soon!", "info");
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