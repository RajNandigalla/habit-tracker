import React, { useState } from 'react';
import filter from 'lodash/filter';
import { Category } from '../types';
import { Button, Container, Modal } from '../core';
import { Plus, AlertTriangle, Tags, Layers, Archive } from 'lucide-react';
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

  // Helper to robustly check if a category is default
  const isDefaultCategory = (cat: Category) => {
    if (cat.isDefault) return true;
    return [
      'cat_health',
      'cat_work',
      'cat_learning',
      'cat_mindfulness',
      'cat_fitness',
      'cat_other',
    ].includes(cat.id);
  };

  const defaultCategories = filter(activeCategories, isDefaultCategory);
  const customCategories = filter(activeCategories, c => !isDefaultCategory(c));

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
        <div className="flex justify-between items-start mb-6">
          <PageTitle
            title="Categories"
            description="Organize your habits with custom categories"
            className="mb-0"
          />
          {view === 'list' && customCategories.length > 0 && (
            <Button
              size="sm"
              onClick={() => {
                resetForm();
                setView('create');
              }}
              className="shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1" /> New Category
            </Button>
          )}
        </div>

        {view !== 'list' ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <CategoryForm
              mode={view}
              existingCategories={categories}
              editingCategory={editingCategory}
              onSubmit={handleFormSubmit}
              onCancel={resetForm}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Custom Categories */}
            {customCategories.length > 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Tags className="w-5 h-5 text-indigo-500" />
                    Your Categories
                  </h3>
                </div>
                <CategoryList
                  categories={customCategories}
                  onEdit={startEdit}
                  onArchive={handleArchive}
                />
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm text-indigo-500">
                  <Tags className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">
                    No Custom Categories
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Create your own categories to organize your habits.
                  </p>
                </div>
                <Button onClick={() => setView('create')} size="sm" className="shadow-sm">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Create
                </Button>
              </div>
            )}

            {/* Application Defaults Card */}
            {defaultCategories.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-slate-400" />
                      Default Categories
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 ml-3">
                    These are the built-in categories provided by the app.
                  </p>
                </div>
                <CategoryList
                  categories={defaultCategories}
                  onEdit={startEdit}
                  onArchive={handleArchive}
                />
              </div>
            )}
          </div>
        )}

        {view === 'list' && archivedCategories.length > 0 && (
          <div className="mt-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Archive className="w-5 h-5 text-slate-400" />
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
