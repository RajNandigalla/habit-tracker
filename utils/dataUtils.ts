import { Habit, JournalEntry, UserPreferences } from '../types';
import pkg from '../package.json';

interface ExportData {
  habits: Habit[];
  journalEntries: JournalEntry[];
  preferences: UserPreferences;
  exportDate: string;
  version: string;
}

export const exportUserData = (
  habits: Habit[],
  journalEntries: JournalEntry[],
  preferences: UserPreferences
) => {
  const data: ExportData = {
    habits,
    journalEntries,
    preferences,
    exportDate: new Date().toISOString(),
    version: pkg.version,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tickoff-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const parseImportFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target?.result as string;
      if (content) resolve(content);
      else reject(new Error('File is empty'));
    };
    reader.onerror = error => reject(error);
    reader.readAsText(file);
  });
};
