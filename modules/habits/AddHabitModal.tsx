import React, { useState, useMemo } from 'react';
import { Habit, HabitFrequency, HabitType } from '../../types';
import { cn, generateId, getTodayISO } from '../../utils';
import { Plus } from 'lucide-react';
import {
  Button,
  Input,
  Select,
  Modal,
  Textarea,
  Slider,
  MultiSelect,
  MultiSelectOption,
  ColorPicker,
  Tooltip,
} from '../../core';
import { TimePicker } from '../../core/TimePicker';
import { X, Calendar, Bell, Check, ChevronRight, Palette, Hash, AlignLeft } from 'lucide-react';
import { useStore } from '../../context/Store';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../../context/NavigationContext'; // Import navigation context
import { HABIT_COLOR_VALUES, HABIT_COLOR_NAMES } from '../../constants/colors';
import { useAnnouncer } from '../../hooks/useAnnouncer';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: Habit) => void;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [reminderTime, setReminderTime] = useState('');

  const [habitType, setHabitType] = useState<HabitType>('positive');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [targetCount, setTargetCount] = useState(3);
  const [targetDays, setTargetDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const { categories, addCategory } = useStore();
  const navigate = useNavigate();
  const { closeSideMenu } = useNavigation(); // Use navigation context to close side menu
  const { announce } = useAnnouncer();

  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ name?: string }>({});

  // Prepare category options for MultiSelect
  const categoryOptions: MultiSelectOption[] = useMemo(
    () =>
      categories
        .filter(c => !c.isArchived)
        .map(cat => ({
          value: cat.id,
          label: cat.label,
          icon: cat.icon,
        })),
    [categories]
  );

  // Set default category on open if empty
  React.useEffect(() => {
    if (isOpen && categoryIds.length === 0 && categories.length > 0) {
      const defaultCat = categories.find(c => c.isDefault && c.label === 'Health');
      if (defaultCat) setCategoryIds([defaultCat.id]);
    }
  }, [isOpen, categories]);

  const reset = () => {
    setName('');
    setDescription('');
    setColor('#6366f1');
    setReminderTime('');
    setHabitType('positive');
    setFrequency('daily');
    setTargetCount(3);
    setTargetDays([1, 2, 3, 4, 5]);
    setErrors({});
    // Reset category to default
    const defaultCat = categories.find(c => c.isDefault && c.label === 'Health');
    setCategoryIds(defaultCat ? [defaultCat.id] : []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      setErrors({ name: 'Habit name is required' });
      return;
    }

    setErrors({});

    onAdd({
      id: generateId(),
      name,
      description,
      categoryIds,

      frequency,
      habitType,
      targetCount: frequency === 'weekly' ? targetCount : undefined,
      targetDays: frequency === 'specific_days' ? targetDays : undefined,
      completedDates: [],
      createdAt: getTodayISO(),
      streak: 0,
      color,
      reminderTime: reminderTime || undefined,
    });

    reset();
    onClose();
  };

  const toggleTargetDay = (dayIndex: number) => {
    setTargetDays(prev =>
      prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  const handleCategoryToggle = (id: string) => {
    setCategoryIds(prev => (prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Create New Habit" mobileFullScreen>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-4">
            <Input
              id="habit-name"
              label="Name"
              placeholder="e.g., Read 10 pages, No Sugar..."
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              error={errors.name}
              required
              autoFocus
            />
            <Textarea
              id="habit-description"
              label="Description (Optional)"
              placeholder="Why is this important?"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <Select
              label="Goal Type"
              value={habitType}
              onChange={val => setHabitType(val as HabitType)}
              options={[
                { label: 'Build Habit', value: 'positive' },
                { label: 'Quit Habit', value: 'negative' },
              ]}
            />

            <div className="space-y-2">
              <MultiSelect
                options={categoryOptions}
                value={categoryIds}
                onChange={value => setCategoryIds(value as string[])}
                label="Categories"
                placeholder="Select habit categories"
                maxDisplay={4}
              />

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/categories');
                }}
                aria-label="Manage categories"
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors flex items-center gap-1"
              >
                <Plus size={14} />
                Manage Categories
              </button>
            </div>

            {/* Frequency Config */}
            <div className="space-y-3">
              <label className="block text-base font-medium text-slate-700 dark:text-slate-300">
                Frequency
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['daily', 'specific_days', 'weekly'] as const).map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFrequency(f)}
                    aria-label={`Set frequency to ${f.replace('_', ' ')}`}
                    className={cn(
                      'py-2 px-1 text-base rounded-lg border text-center transition-all capitalize',
                      frequency === f
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Dynamic Frequency Inputs */}
              {frequency === 'specific_days' && (
                <div className="flex justify-between gap-1 pt-2 animate-fade-in">
                  {weekDays.map((d, i) => {
                    const dayNames = [
                      'Sunday',
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                    ];
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleTargetDay(i)}
                        aria-label={`Toggle ${dayNames[i]}`}
                        className={cn(
                          'w-9 h-9 rounded-full text-base font-bold flex items-center justify-center transition-all',
                          targetDays.includes(i)
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                        )}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              )}

              {frequency === 'weekly' && (
                <div className="pt-4 pb-2 animate-fade-in px-1">
                  <Slider
                    label="Weekly Goal"
                    min={1}
                    max={7}
                    step={1}
                    value={targetCount}
                    onChange={setTargetCount}
                    formatValue={v => `${v} days`}
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    How many days per week do you want to complete this habit?
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <TimePicker label="Daily Reminder" value={reminderTime} onChange={setReminderTime} />
            </div>

            <div>
              <ColorPicker colors={HABIT_COLOR_VALUES} selectedColor={color} onChange={setColor} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={!name} leftIcon={<Plus className="w-4 h-4" />}>
              Create Habit
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddHabitModal;
