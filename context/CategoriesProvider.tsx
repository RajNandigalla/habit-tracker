import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, DEFAULT_CATEGORIES } from '../types';
import { storageService } from '../services/storageService';
import { useToast } from './ToastContext';
import { generateId } from '../utils';

const STORAGE_KEY = 'tickoff_categories';

interface CategoriesContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'isArchived'>) => void;
  updateCategory: (category: Category) => void;
  archiveCategory: (id: string) => void;
  restoreCategory: (id: string) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) throw new Error('useCategories must be used within CategoriesProvider');
  return context;
};

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  // Load categories from storage
  useEffect(() => {
    const loadCategories = async () => {
      const loaded = await storageService.getItemAsync<Category[] | string[]>(STORAGE_KEY, []);

      if (!loaded || loaded.length === 0) {
        setCategories(DEFAULT_CATEGORIES);
        return;
      }

      setCategories(loaded as Category[]);
      setLoading(false);
    };
    loadCategories();
  }, []);

  const addCategory = (categoryData: Omit<Category, 'id' | 'isArchived'>) => {
    const newCategory: Category = {
      id: generateId(),
      ...categoryData,
      isArchived: false,
    };
    const newCategories = [...categories, newCategory];
    setCategories(newCategories);
    storageService.setItemAsync(STORAGE_KEY, newCategories);
    addToast(`Category "${newCategory.label}" created!`, 'success');
  };

  const updateCategory = (category: Category) => {
    const newCategories = categories.map(c => (c.id === category.id ? category : c));
    setCategories(newCategories);
    storageService.setItemAsync(STORAGE_KEY, newCategories);
    addToast('Category updated.', 'success');
  };

  const archiveCategory = (id: string) => {
    const newCategories = categories.map(c => (c.id === id ? { ...c, isArchived: true } : c));
    setCategories(newCategories);
    storageService.setItemAsync(STORAGE_KEY, newCategories);
    addToast('Category archived.', 'info');
  };

  const restoreCategory = (id: string) => {
    const newCategories = categories.map(c => (c.id === id ? { ...c, isArchived: false } : c));
    setCategories(newCategories);
    storageService.setItemAsync(STORAGE_KEY, newCategories);
    addToast('Category restored.', 'success');
  };

  if (loading) return null;

  return (
    <CategoriesContext.Provider
      value={{ categories, addCategory, updateCategory, archiveCategory, restoreCategory }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
