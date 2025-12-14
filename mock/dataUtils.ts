import { storageService } from '../services/storageService';

/**
 * Clear all application data from storage
 */
export const clearAllData = async (): Promise<void> => {
  console.warn('[DataUtils] clearAllData called - clearing all storage');
  console.trace(); // Show stack trace to see where it was called from
  await storageService.clear();
};

/**
 * Import data from JSON string
 * @param jsonData - JSON string containing exported data
 * @returns true if successful, false otherwise
 */
export const importData = async (jsonData: string): Promise<boolean> => {
  try {
    const data = JSON.parse(jsonData);

    // Validate data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format');
    }

    // Import each data type if present
    if (data.habits) {
      await storageService.setItemAsync('tickoff_habits', data.habits);
    }
    if (data.journal) {
      await storageService.setItemAsync('tickoff_journal', data.journal);
    }
    if (data.preferences) {
      await storageService.setItemAsync('tickoff_prefs', data.preferences);
    }
    if (data.categories) {
      await storageService.setItemAsync('tickoff_categories', data.categories);
    }

    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
};

/**
 * Export all data as JSON string
 */
export const exportData = async (): Promise<string> => {
  const data = {
    habits: await storageService.getItemAsync('tickoff_habits', []),
    journal: await storageService.getItemAsync('tickoff_journal', []),
    preferences: await storageService.getItemAsync('tickoff_prefs', {}),
    categories: await storageService.getItemAsync('tickoff_categories', []),
    exportedAt: new Date().toISOString(),
  };

  return JSON.stringify(data, null, 2);
};
