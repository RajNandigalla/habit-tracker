/**
 * Safe localStorage wrapper with error handling and data validation
 */

export interface StorageData {
  habits?: unknown;
  journal?: unknown;
  prefs?: unknown;
}

class StorageService {
  /**
   * Safely read and parse JSON from localStorage
   */
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;

      const parsed = JSON.parse(item);
      return parsed as T;
    } catch (error) {
      console.error(`Failed to parse localStorage key "${key}":`, error);
      // Clear corrupted data
      this.removeItem(key);
      return defaultValue;
    }
  }

  /**
   * Safely write JSON to localStorage
   */
  setItem<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Failed to save to localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove localStorage key "${key}":`, error);
    }
  }

  /**
   * Clear all localStorage data
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

export const storageService = new StorageService();
