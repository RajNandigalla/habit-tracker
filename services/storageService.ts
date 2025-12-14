/**
 * Unified storage service supporting both IndexedDB and localStorage
 * Uses IndexedDB when available, localStorage as fallback
 * NO MIGRATION - clean separation between the two
 */

import * as indexedDB from './indexedDBService';
import { STORES } from './indexedDBService';

export interface StorageData {
  habits?: unknown;
  journal?: unknown;
  prefs?: unknown;
}

// Storage keys for localStorage
const STORAGE_KEYS = {
  HABITS: 'tickoff_habits',
  JOURNAL: 'tickoff_journal',
  PREFS: 'tickoff_prefs',
  CATEGORIES: 'tickoff_categories',
} as const;

// Map storage keys to IndexedDB store names
const KEY_TO_STORE_MAP: Record<string, string> = {
  [STORAGE_KEYS.HABITS]: STORES.HABITS,
  [STORAGE_KEYS.JOURNAL]: STORES.JOURNAL,
  [STORAGE_KEYS.PREFS]: STORES.PREFERENCES,
  [STORAGE_KEYS.CATEGORIES]: STORES.CATEGORIES,
};

class StorageService {
  private useIndexedDB: boolean = false;
  private initialized: boolean = false;

  constructor() {
    this.useIndexedDB = indexedDB.isIndexedDBSupported();
    if (this.useIndexedDB) {
      console.log('✓ Using IndexedDB for storage');
    } else {
      console.log('✓ Using localStorage for storage (IndexedDB not available)');
    }
    this.initialized = true;
  }

  /**
   * Get item from storage (async)
   */
  async getItemAsync<T>(key: string, defaultValue: T): Promise<T> {
    if (this.useIndexedDB) {
      try {
        const storeName = KEY_TO_STORE_MAP[key];
        if (storeName) {
          return await indexedDB.getItem<T>(storeName, 'data', defaultValue);
        }
      } catch (error) {
        console.error(`IndexedDB getItem failed for ${key}, falling back to localStorage:`, error);
        this.useIndexedDB = false;
      }
    }

    // Fallback to localStorage
    return this.getItemFromLocalStorage(key, defaultValue);
  }

  /**
   * Synchronous getItem (uses localStorage only)
   */
  getItem<T>(key: string, defaultValue: T): T {
    return this.getItemFromLocalStorage(key, defaultValue);
  }

  /**
   * Get item from localStorage
   */
  private getItemFromLocalStorage<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;

      const parsed = JSON.parse(item);
      return parsed as T;
    } catch (error) {
      console.error(`Failed to parse localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Set item in storage (async)
   */
  async setItemAsync<T>(key: string, value: T): Promise<boolean> {
    if (this.useIndexedDB) {
      try {
        const storeName = KEY_TO_STORE_MAP[key];
        if (storeName) {
          return await indexedDB.setItem(storeName, 'data', value);
        }
      } catch (error) {
        console.error(`IndexedDB setItem failed for ${key}, falling back to localStorage:`, error);
        this.useIndexedDB = false;
      }
    }

    // Fallback to localStorage
    return this.setItemToLocalStorage(key, value);
  }

  /**
   * Synchronous setItem (uses localStorage only)
   */
  setItem<T>(key: string, value: T): boolean {
    return this.setItemToLocalStorage(key, value);
  }

  /**
   * Set item to localStorage
   */
  private setItemToLocalStorage<T>(key: string, value: T): boolean {
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
   * Remove item from storage
   */
  async removeItem(key: string): Promise<void> {
    if (this.useIndexedDB) {
      const storeName = KEY_TO_STORE_MAP[key];
      if (storeName) {
        try {
          await indexedDB.removeItem(storeName, 'data');
          return;
        } catch (error) {
          console.error(`Failed to remove from IndexedDB for ${key}:`, error);
          this.useIndexedDB = false;
        }
      }
    }

    // Fallback to localStorage
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove localStorage key "${key}":`, error);
    }
  }

  /**
   * Clear all storage data
   */
  async clear(): Promise<void> {
    if (this.useIndexedDB) {
      // Clear IndexedDB
      for (const storeName of Object.values(STORES)) {
        try {
          await indexedDB.clear(storeName);
        } catch (error) {
          console.error(`Failed to clear IndexedDB store ${storeName}:`, error);
        }
      }
    } else {
      // Clear localStorage
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Failed to clear localStorage:', error);
      }
    }
  }

  /**
   * Check if using IndexedDB
   */
  isUsingIndexedDB(): boolean {
    return this.useIndexedDB && this.initialized;
  }
}

export const storageService = new StorageService();
