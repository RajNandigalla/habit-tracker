import React from 'react';
import { Habit } from '../../types';
import { Button, Input } from '../../core';
import { TimePicker } from '../../core/TimePicker';
import { X, Plus } from 'lucide-react';
import { cn } from '../../utils';
import { useStore } from '../../context/Store';
import { useNavigate } from 'react-router-dom';
import { HABIT_COLOR_VALUES, HABIT_COLOR_NAMES } from '../../constants/colors';

interface HabitEditFormProps {
  habit: Habit;
  editName: string;
  editDesc: string;
  editColor: string;
  editReminder: string;
  editCategoryIds: string[];
  onNameChange: (value: string) => void;
  onDescChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onReminderChange: (value: string) => void;
  onCategoryToggle: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

const COLORS = ['#6366f1', '#ef4444', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#3b82f6'];

export const HabitEditForm: React.FC<HabitEditFormProps> = ({
  editName,
  editDesc,
  editColor,
  editReminder,
  editCategoryIds,
  onNameChange,
  onDescChange,
  onColorChange,
  onReminderChange,
  onCategoryToggle,
  onSave,
  onCancel,
  onDelete,
}) => {
  const { categories } = useStore();
  const navigate = useNavigate();
  const [errors, setErrors] = React.useState<{ name?: string }>({});

  const handleManageCategories = () => {
    navigate('/categories');
  };

  const handleSave = () => {
    if (!editName.trim()) {
      setErrors({ name: 'Habit name is required' });
      return;
    }
    setErrors({});
    onSave();
  };

  return (
    <div className="space-y-4 animate-fade-scale">
      <Input
        id="edit-habit-name"
        label="Name"
        value={editName}
        onChange={e => {
          onNameChange(e.target.value);
          if (errors.name) setErrors({ ...errors, name: undefined });
        }}
        error={errors.name}
        required
      />
      <Input
        id="edit-habit-desc"
        label="Description"
        value={editDesc}
        onChange={e => onDescChange(e.target.value)}
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Categories</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {editCategoryIds.map(id => {
            const cat = categories.find(c => c.id === id);
            if (!cat) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                <span>{cat.icon}</span>
                {cat.label}
                <button
                  type="button"
                  onClick={() => onCategoryToggle(id)}
                  aria-label={`Remove ${cat.label} category`}
                  className="ml-1 hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </span>
            );
          })}
          <button
            type="button"
            onClick={handleManageCategories}
            aria-label="Manage categories"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-colors"
          >
            <Plus size={12} /> Manage Categories
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TimePicker label="Daily Reminder" value={editReminder} onChange={onReminderChange} />
      </div>

      <div>
        <label className="mb-1.5 block text-base font-medium text-slate-700 dark:text-slate-300">
          Color
        </label>
        <div
          className="flex items-center gap-3 h-[42px]"
          role="radiogroup"
          aria-label="Color selection"
        >
          {HABIT_COLOR_VALUES.map((c, index) => {
            return (
              <button
                key={c}
                type="button"
                onClick={() => onColorChange(c)}
                role="radio"
                aria-checked={editColor === c}
                aria-label={HABIT_COLOR_NAMES[index]}
                className={cn(
                  'w-6 h-6 rounded-full ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 transition-all duration-300 ease-spring',
                  editColor === c
                    ? 'ring-slate-400 scale-125'
                    : 'ring-transparent md:hover:scale-110'
                )}
                style={{ backgroundColor: c }}
              />
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button variant="danger-ghost" onClick={onDelete} className="mr-auto">
          Delete
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default HabitEditForm;
