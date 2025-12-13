import React, { useState } from 'react';
import { Habit, HabitCategory, HabitType, HabitFrequency } from '../../types';
import { cn, generateId, getTodayISO } from '../../utils';
import { Plus } from 'lucide-react';
import { Button, Input, Select, Modal, Textarea, TimePicker, Slider } from '../../core';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: Habit) => void;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>(HabitCategory.HEALTH);
  const [color, setColor] = useState('#6366f1');
  const [reminderTime, setReminderTime] = useState('');

  // New Fields
  const [habitType, setHabitType] = useState<HabitType>('positive');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [targetCount, setTargetCount] = useState(3); // Default for weekly
  const [targetDays, setTargetDays] = useState<number[]>([1, 2, 3, 4, 5]); // Default Mon-Fri

  const colors = ['#6366f1', '#ef4444', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#3b82f6'];
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const reset = () => {
    setName('');
    setDescription('');
    setCategory(HabitCategory.HEALTH);
    setColor('#6366f1');
    setReminderTime('');
    setHabitType('positive');
    setFrequency('daily');
    setTargetCount(3);
    setTargetDays([1, 2, 3, 4, 5]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onAdd({
      id: generateId(),
      name,
      description,
      category,
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Habit" mobileFullScreen>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            label="Name"
            placeholder="e.g., Read 10 pages, No Sugar..."
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
          <Textarea
            label="Description (Optional)"
            placeholder="Why is this important?"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Goal Type"
              value={habitType}
              onChange={val => setHabitType(val as HabitType)}
              options={[
                { label: 'Build Habit', value: 'positive' },
                { label: 'Quit Habit', value: 'negative' },
              ]}
            />
            <Select
              label="Category"
              value={category}
              onChange={val => setCategory(val as HabitCategory)}
              options={Object.values(HabitCategory).map(c => ({
                label: c,
                value: c,
              }))}
            />
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
                  className={cn(
                    'py-2 px-1 text-sm rounded-lg border text-center transition-all capitalize',
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
                {weekDays.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleTargetDay(i)}
                    className={cn(
                      'w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center transition-all',
                      targetDays.includes(i)
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                    )}
                  >
                    {d}
                  </button>
                ))}
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
            <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Color
            </label>
            <div className="flex flex-wrap gap-3">
              {colors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'w-8 h-8 rounded-full transition-transform duration-300 ease-spring focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
                    color === c
                      ? 'ring-2 ring-offset-2 ring-slate-400 scale-110'
                      : 'ring-transparent md:hover:scale-110'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
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
  );
};

export default AddHabitModal;
