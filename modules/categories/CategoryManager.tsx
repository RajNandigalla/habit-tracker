import React, { useState } from 'react';
import filter from 'lodash/filter';
import { useStore } from '../../context/Store';
import { Category } from '../../types';
import { Button, Modal } from '../../core';
import { Plus } from 'lucide-react';
import { CategoryForm } from './CategoryForm';
import { CategoryList } from './CategoryList';
import { ArchivedCategoriesList } from './ArchivedCategoriesList';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (categoryId: string) => void;
  selectedCategoryIds?: string[];
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedCategoryIds = [],
}) => {
  const { categories, addCategory, updateCategory, archiveCategory, restoreCategory } = useStore();
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingCategory, setEditingCategory] = useState<Partial<Category>>({});

  const activeCategories = filter(categories, c => !c.isArchived);
  const archivedCategories = filter(categories, c => c.isArchived);

  const isSelectionMode = !!onSelect;

  const handleFormSubmit = (data: { label: string; icon: string; color: string }) => {
    if (view === 'create') {
      addCategory(data);
    } else if (view === 'edit' && editingCategory.id) {
      updateCategory({
        ...editingCategory,
        ...data,
        id: editingCategory.id,
        isArchived: editingCategory.isArchived || false,
      } as Category);
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingCategory({});
    setView('list');
  };

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setView('edit');
  };

  const handleArchive = (cat: Category) => {
    if (cat.isDefault) {
      return;
    }
    archiveCategory(cat.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Categories"
      bottomSheet
      mobileFullScreen={false}
      size="xl"
      className="h-[75vh]"
    >
      {view !== 'list' ? (
        <CategoryForm
          mode={view}
          existingCategories={categories}
          editingCategory={editingCategory}
          onSubmit={handleFormSubmit}
          onCancel={resetForm}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl">
            <div>
              <h4 className="font-bold text-indigo-900 dark:text-indigo-100">
                {isSelectionMode ? 'Select Categories' : 'Manage Your Categories'}
              </h4>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                {isSelectionMode
                  ? 'Choose categories for your habit'
                  : 'Create unique labels for your habits'}
              </p>
            </div>
            {!isSelectionMode && (
              <Button
                size="sm"
                onClick={() => {
                  resetForm();
                  setView('create');
                }}
              >
                <Plus className="w-4 h-4 mr-1" /> New
              </Button>
            )}
          </div>

          <CategoryList
            categories={activeCategories}
            onEdit={startEdit}
            onArchive={handleArchive}
            onSelect={onSelect}
            selectedCategoryIds={selectedCategoryIds}
          />

          {!isSelectionMode && (
            <ArchivedCategoriesList
              archivedCategories={archivedCategories}
              onRestore={restoreCategory}
            />
          )}
        </div>
      )}
    </Modal>
  );
};
