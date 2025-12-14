/**
 * IndexedDB service using 'idb' library - functional approach
 * Much simpler and more reliable than custom implementation
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

const DB_NAME = 'TickOffDB';
const DB_VERSION = 1;

// Object store names
export const STORES = {
  HABITS: 'habits',
  JOURNAL: 'journal',
  PREFERENCES: 'preferences',
  CATEGORIES: 'categories',
  METADATA: 'metadata',
} as const;

// Make dbPromise global to survive hot reloads in dev mode
declare global {
  interface Window {
    __tickoffDB?: Promise<IDBPDatabase<TickOffDB>>;
  }
}

// Database schema type
interface TickOffDB extends DBSchema {
  habits: {
    key: string;
    value: any;
  };
  journal: {
    key: string;
    value: any;
  };
  preferences: {
    key: string;
    value: any;
  };
  categories: {
    key: string;
    value: any;
  };
  metadata: {
    key: string;
    value: any;
  };
}

/**
 * Check if IndexedDB is supported and available
 */
export const isIndexedDBSupported = (): boolean => {
  try {
    return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
  } catch (error) {
    console.warn('IndexedDB not available:', error);
    return false;
  }
};

/**
 * Get or initialize the IndexedDB database
 * Uses global window.__tickoffDB to survive hot reloads in dev
 */
const getDB = async (): Promise<IDBPDatabase<TickOffDB>> => {
  if (!isIndexedDBSupported()) {
    throw new Error('IndexedDB not supported');
  }

  // Check global first (survives hot reload)
  if (typeof window !== 'undefined' && window.__tickoffDB) {
    console.log('[IndexedDB] Using existing database connection');
    return window.__tickoffDB;
  }

  console.log('[IndexedDB] Initializing new database connection');

  const dbPromise = openDB<TickOffDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      console.log(`[IndexedDB] Upgrading database from v${oldVersion} to v${newVersion}`);

      // Create object stores if they don't exist
      const storeNames = Object.values(STORES);
      storeNames.forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          console.log(`[IndexedDB] Creating store: ${storeName}`);
          db.createObjectStore(storeName);
        }
      });
    },
  });

  // Store globally to survive hot reloads
  if (typeof window !== 'undefined') {
    window.__tickoffDB = dbPromise;
  }

  return dbPromise;
};

/**
 * Get item from IndexedDB store
 */
export const getItem = async <T>(storeName: string, key: string, defaultValue: T): Promise<T> => {
  try {
    const db = await getDB();
    const value = await db.get(storeName as any, key);
    return value !== undefined ? value : defaultValue;
  } catch (error) {
    console.error(`IndexedDB getItem error for ${storeName}:${key}:`, error);
    return defaultValue;
  }
};

/**
 * Set item in IndexedDB store
 */
export const setItem = async <T>(storeName: string, key: string, value: T): Promise<boolean> => {
  try {
    const db = await getDB();
    await db.put(storeName as any, value, key);
    return true;
  } catch (error) {
    console.error(`IndexedDB setItem error for ${storeName}:${key}:`, error);
    return false;
  }
};

/**
 * Remove item from IndexedDB store
 */
export const removeItem = async (storeName: string, key: string): Promise<boolean> => {
  try {
    const db = await getDB();
    await db.delete(storeName as any, key);
    return true;
  } catch (error) {
    console.error(`IndexedDB removeItem error for ${storeName}:${key}:`, error);
    return false;
  }
};

/**
 * Clear all items in a store
 */
export const clear = async (storeName: string): Promise<boolean> => {
  console.warn(`[IndexedDB] Clearing store: ${storeName}`);
  try {
    const db = await getDB();
    await db.clear(storeName as any);
    return true;
  } catch (error) {
    console.error(`IndexedDB clear error for ${storeName}:`, error);
    return false;
  }
};

/**
 * Get all keys in a store
 */
export const getAllKeys = async (storeName: string): Promise<string[]> => {
  try {
    const db = await getDB();
    const keys = await db.getAllKeys(storeName as any);
    return keys.map(String);
  } catch (error) {
    console.error(`IndexedDB getAllKeys error for ${storeName}:`, error);
    return [];
  }
};
