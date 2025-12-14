import React, { useState, useEffect } from 'react';
import toLower from 'lodash/toLower';
import trim from 'lodash/trim';
import find from 'lodash/find';
import { Category } from '../../types';
import { Button, Input, IconPicker, CategoryColorPicker } from '../../core';
import { X } from 'lucide-react';

interface CategoryFormProps {
  mode: 'create' | 'edit';
  existingCategories: Category[];
  editingCategory?: Partial<Category>;
  onSubmit: (data: { label: string; icon: string; color: string }) => void;
  onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  mode,
  existingCategories,
  editingCategory,
  onSubmit,
  onCancel,
}) => {
  const [label, setLabel] = useState(editingCategory?.label || '');
  const [icon, setIcon] = useState(editingCategory?.icon || '🏷️');
  const [color, setColor] = useState(editingCategory?.color || 'indigo-600');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setLabel(editingCategory.label || '');
      setIcon(editingCategory.icon || '🏷️');
      setColor(editingCategory.color || 'indigo-600');
    }
  }, [editingCategory]);

  const validateDuplicateName = (name: string): boolean => {
    const normalizedName = toLower(trim(name));

    const duplicate = find(existingCategories, cat => {
      // Skip the current category when editing
      if (mode === 'edit' && editingCategory?.id === cat.id) {
        return false;
      }
      return toLower(trim(cat.label)) === normalizedName;
    });

    return !duplicate;
  };

  const handleSubmit = () => {
    const trimmedLabel = trim(label);

    if (!trimmedLabel) {
      setError('Category name is required');
      return;
    }

    if (!validateDuplicateName(trimmedLabel)) {
      setError('A category with this name already exists');
      return;
    }

    setError('');
    onSubmit({ label: trimmedLabel, icon, color });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon-sm" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
        <h3 className="text-lg font-bold">
          {mode === 'create' ? 'Create Category' : 'Edit Category'}
        </h3>
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Icon</label>
          <IconPicker currentIcon={icon} onSelect={setIcon} />
        </div>
        <div className="flex flex-col gap-2">
          <Input
            label="Category Name"
            value={label}
            onChange={e => {
              setLabel(e.target.value);
              setError('');
            }}
            placeholder="e.g. Work"
            autoFocus
          />
          {error && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Color Tag
        </label>
        <CategoryColorPicker selectedColor={color} onColorSelect={setColor} />
      </div>

      <div className="pt-4 flex justify-end">
        <Button onClick={handleSubmit} disabled={!trim(label)}>
          {mode === 'create' ? 'Create Category' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};
