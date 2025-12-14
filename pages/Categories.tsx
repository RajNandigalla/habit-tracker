import React from 'react';
import { useStore } from '../context/Store';
import { CategoriesView } from '../views/CategoriesView';

export const Categories: React.FC = () => {
  const { categories, addCategory, updateCategory, archiveCategory, restoreCategory } = useStore();

  return (
    <CategoriesView
      categories={categories}
      onAddCategory={addCategory}
      onUpdateCategory={updateCategory}
      onArchiveCategory={archiveCategory}
      onRestoreCategory={restoreCategory}
    />
  );
};
