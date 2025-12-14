import React, { useState } from 'react';
import filter from 'lodash/filter';
import { Category } from '../types';
import { Button, Container, Modal } from '../core';
import { Plus, AlertTriangle } from 'lucide-react';
import { PageTitle } from '../modules/PageTitle';
import { CategoryForm } from '../modules/categories/CategoryForm';
import { CategoryList } from '../modules/categories/CategoryList';
import { ArchivedCategoriesList } from '../modules/categories/ArchivedCategoriesList';

interface CategoriesViewProps {
  categories: Category[];
  onAddCategory: (data: { label: string; icon: string; color: string }) => void;
  onUpdateCategory: (category: Category) => void;
  onArchiveCategory: (categoryId: string) => void;
  onRestoreCategory: (categoryId: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onArchiveCategory,
  onRestoreCategory,
}) => {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingCategory, setEditingCategory] = useState<Partial<Category>>({});
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    category: Category | null;
    isDefault: boolean;
  }>({
    isOpen: false,
    category: null,
    isDefault: false,
  });

  const activeCategories = filter(categories, c => !c.isArchived);
  const archivedCategories = filter(categories, c => c.isArchived);

  const handleFormSubmit = (data: { label: string; icon: string; color: string }) => {
    if (view === 'create') {
      onAddCategory(data);
    } else if (view === 'edit' && editingCategory.id) {
      onUpdateCategory({
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
    setConfirmModal({
      isOpen: true,
      category: cat,
      isDefault: cat.isDefault || false,
    });
  };

  const confirmArchive = () => {
    if (confirmModal.category && !confirmModal.isDefault) {
      onArchiveCategory(confirmModal.category.id);
    }
    setConfirmModal({ isOpen: false, category: null, isDefault: false });
  };

  return (
    <Container className="py-6">
      <div className="max-w-4xl mx-auto">
        <PageTitle
          title="Categories"
          description="Organize your habits with custom categories"
          className="mb-6"
        />

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
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
                    Manage Your Categories
                  </h4>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                    Create unique labels for your habits
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    resetForm();
                    setView('create');
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" /> New
                </Button>
              </div>

              <CategoryList
                categories={activeCategories}
                onEdit={startEdit}
                onArchive={handleArchive}
              />
            </div>
          )}
        </div>

        {view === 'list' && archivedCategories.length > 0 && (
          <div className="mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                Archived Categories
              </h3>
              <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                {archivedCategories.length}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              These categories are hidden but can be restored anytime.
            </p>
            <ArchivedCategoriesList
              archivedCategories={archivedCategories}
              onRestore={onRestoreCategory}
            />
          </div>
        )}
      </div>

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, category: null, isDefault: false })}
        title={confirmModal.isDefault ? 'Cannot Archive' : 'Archive Category'}
        size="md"
      >
        {confirmModal.isDefault ? (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl flex gap-4 items-start border border-amber-100 dark:border-amber-800/50">
              <div className="p-3 bg-amber-100 dark:bg-amber-800/50 rounded-full text-amber-600 dark:text-amber-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-1">
                  Default Category
                </h4>
                <p className="text-base text-amber-700 dark:text-amber-300 leading-relaxed">
                  <strong>{confirmModal.category?.label}</strong> is a default category and cannot
                  be archived.
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setConfirmModal({ isOpen: false, category: null, isDefault: false })}
              >
                OK
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl flex gap-4 items-start border border-red-100 dark:border-red-800/50">
              <div className="p-3 bg-red-100 dark:bg-red-800/50 rounded-full text-red-600 dark:text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-red-900 dark:text-red-100 mb-1">
                  Are you absolutely sure?
                </h4>
                <p className="text-base text-red-700 dark:text-red-300 leading-relaxed">
                  Archive <strong>{confirmModal.category?.label}</strong>? It will be hidden but can
                  be restored later from the Archived section below.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setConfirmModal({ isOpen: false, category: null, isDefault: false })}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmArchive}>
                Yes, Archive It
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Container>
  );
};
