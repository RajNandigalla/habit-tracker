import React, { useState, useEffect } from 'react';
import { Habit, HabitCategory } from '../../types';
import { cn, getTodayISO, calculateHabitStats } from '../../utils';
import {
  Edit3,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Bell,
  Timer,
  Crown,
} from 'lucide-react';
import { Button, Input, Select, Modal, Textarea, TimePicker } from '../../core';
import dayjs from 'dayjs';
import { HeatmapGrid, HeatmapData } from '../progress';

export interface HabitActionProps {
  toggleHabitCompletion: (id: string, date: string) => void;
  onFocus?: (habit: Habit) => void;
}

const HabitDetailsModal: React.FC<{
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onFocus?: (habit: Habit) => void;
  initialMode?: 'view' | 'edit' | 'delete';
}> = ({ habit, isOpen, onClose, onUpdate, onDelete, onFocus, initialMode = 'view' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [viewDate, setViewDate] = useState(dayjs());
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editCategory, setEditCategory] = useState<HabitCategory>(HabitCategory.HEALTH);
  const [editReminder, setEditReminder] = useState('');
  React.useEffect(() => {
    if (isOpen && habit) {
      setEditName(habit.name);
      setEditDesc(habit.description);
      setEditColor(habit.color);
      setEditCategory(habit.category);
      setEditReminder(habit.reminderTime || '');
      setIsEditing(initialMode === 'edit');
      setShowDeleteConfirm(initialMode === 'delete');
      setViewDate(dayjs()); // Reset calendar to today
    }
  }, [isOpen, habit, initialMode]);

  if (!habit) return null;

  const stats = calculateHabitStats(habit);
  const today = getTodayISO();

  const handleSave = () => {
    onUpdate({
      ...habit,
      name: editName,
      description: editDesc,
      color: editColor,
      category: editCategory,
      reminderTime: editReminder,
    });
    setIsEditing(false);
  };

  const confirmDelete = () => {
    // Close modal first to trigger exit animation
    onClose();
    // Wait for animation to finish (300ms) before deleting data which unmounts the parent
    setTimeout(() => {
      onDelete(habit.id);
    }, 300);
  };

  const handleCancelDelete = () => {
    if (initialMode === 'delete') {
      onClose();
    } else {
      setShowDeleteConfirm(false);
    }
  };

  const handleStartFocus = () => {
    if (onFocus) {
      onFocus(habit);
      onClose();
    }
  };
  const heatmapData: HeatmapData[] = React.useMemo(() => {
    const days = 105;
    const data: HeatmapData[] = [];
    const todayObj = dayjs();

    for (let i = days - 1; i >= 0; i--) {
      const date = todayObj.subtract(i, 'day').format('YYYY-MM-DD');
      const isCompleted = habit.completedDates.includes(date);
      data.push({
        date,
        count: isCompleted ? 1 : 0,
      });
    }
    return data;
  }, [habit.completedDates]);
  const renderCalendar = () => {
    const currentMonth = viewDate;
    const daysInMonth = currentMonth.daysInMonth();
    const startOfMonth = currentMonth.startOf('month');
    const startDay = startOfMonth.day(); // 0-6
    const days = [];

    // Empty slots for start of month
    for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} />);

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = startOfMonth.date(i).format('YYYY-MM-DD');
      const isCompleted = habit.completedDates.includes(date);
      const isToday = date === today;
      const isNegative = habit.habitType === 'negative';

      // For negative habits, "Completed" means "Incident occurred" (Bad)
      // For positive habits, "Completed" means "Good job"

      const isBadDay = isNegative && isCompleted;
      const isGoodDay = !isNegative && isCompleted;

      days.push(
        <div key={date} className="flex items-center justify-center aspect-square">
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200',
              isBadDay
                ? 'bg-red-500 text-white shadow-sm'
                : isGoodDay
                  ? 'text-white shadow-sm scale-100'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 scale-95',
              isToday &&
                !isCompleted &&
                'ring-2 ring-indigo-500 text-indigo-600 font-extrabold bg-indigo-50 dark:bg-indigo-900/20'
            )}
            style={{ backgroundColor: isGoodDay ? habit.color : undefined }}
          >
            {i}
          </div>
        </div>
      );
    }
    return days;
  };

  const modalTitle = showDeleteConfirm
    ? 'Delete Habit'
    : isEditing
      ? 'Edit Habit'
      : 'Habit Details';
  const formatTimeDisplay = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size={!isEditing && !showDeleteConfirm ? '3xl' : 'md'}
    >
      {showDeleteConfirm ? (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl flex gap-4 items-start border border-red-100 dark:border-red-800/50">
            <div className="p-3 bg-red-100 dark:bg-red-800/50 rounded-full text-red-600 dark:text-red-400 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-red-900 dark:text-red-100 mb-1">
                Are you absolutely sure?
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                This will permanently delete <strong>{habit.name}</strong> and remove all your
                progress history. This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Yes, Delete It
            </Button>
          </div>
        </div>
      ) : !isEditing ? (
        <div className="space-y-6">
          {/* Header Info */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {habit.name}
                  </h2>
                  {habit.habitType === 'negative' && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded-full uppercase tracking-wide">
                      To-Don't
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {habit.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 capitalize">
                    {habit.frequency.replace('_', ' ')}
                  </span>
                  {habit.reminderTime && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 flex items-center gap-1">
                      <Bell className="w-3 h-3" />
                      {formatTimeDisplay(habit.reminderTime)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                {onFocus && habit.habitType === 'positive' && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleStartFocus}
                    title="Start Focus Timer"
                  >
                    <Timer className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsEditing(true)}
                  title="Edit Habit"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="danger-ghost"
                  size="icon-sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  title="Delete Habit"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {habit.description && (
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {habit.description}
              </p>
            )}

            {/* Challenge Info */}
            {habit.challengeId && habit.challengeDuration && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm font-semibold border border-yellow-200 dark:border-yellow-800/50">
                <Crown className="h-4 w-4" />
                Day {Math.min(habit.streak, habit.challengeDuration)} of {habit.challengeDuration}{' '}
                Challenge
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:items-start">
            {/* Left Column: Stats & Heatmap */}
            <div className="md:col-span-7 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center justify-center p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl">
                  <div className="text-3xl font-extrabold text-orange-500 dark:text-orange-400 mb-1">
                    {habit.streak}
                  </div>
                  <div className="text-[10px] font-bold text-orange-400/70 dark:text-orange-300 uppercase tracking-widest">
                    {habit.habitType === 'negative' ? 'Days Free' : 'Current'}
                  </div>
                </div>
                {habit.habitType === 'positive' && (
                  <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl">
                    <div className="text-3xl font-extrabold text-blue-500 dark:text-blue-400 mb-1">
                      {stats.longestStreak}
                    </div>
                    <div className="text-[10px] font-bold text-blue-400/70 dark:text-blue-300 uppercase tracking-widest">
                      Longest
                    </div>
                  </div>
                )}
                <div className="flex flex-col items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl">
                  <div className="text-3xl font-extrabold text-emerald-500 dark:text-emerald-400 mb-1">
                    {stats.totalCompletions}
                  </div>
                  <div className="text-[10px] font-bold text-emerald-400/70 dark:text-emerald-300 uppercase tracking-widest">
                    {habit.habitType === 'negative' ? 'Incidents' : 'Total'}
                  </div>
                </div>
              </div>

              {/* Heatmap Section */}
              <div className="pt-2">
                <div className="flex items-baseline justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide opacity-80 flex items-center gap-2">
                    Recent Activity
                  </h4>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Last 15 Weeks
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-center overflow-x-auto">
                  <HeatmapGrid data={heatmapData} />
                </div>
              </div>
            </div>

            {/* Right Column: Calendar */}
            <div className="md:col-span-5 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 h-full">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide opacity-80 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Monthly
                </h4>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewDate(d => d.subtract(1, 'month'))}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all text-slate-600 dark:text-slate-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-bold w-24 text-center text-slate-700 dark:text-slate-200 select-none">
                    {viewDate.format('MMMM YYYY')}
                  </span>
                  <button
                    onClick={() => setViewDate(d => d.add(1, 'month'))}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all text-slate-600 dark:text-slate-300"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                  <div key={d} className="text-[10px] font-bold text-slate-400 uppercase">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-scale">
          <Input label="Name" value={editName} onChange={e => setEditName(e.target.value)} />
          <Input label="Description" value={editDesc} onChange={e => setEditDesc(e.target.value)} />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={editCategory}
              onChange={v => setEditCategory(v as HabitCategory)}
              options={Object.values(HabitCategory).map(c => ({
                label: c,
                value: c,
              }))}
            />
            <TimePicker label="Daily Reminder" value={editReminder} onChange={setEditReminder} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Color
            </label>
            <div className="flex items-center gap-3 h-[42px]">
              {['#6366f1', '#ef4444', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#3b82f6'].map(
                c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setEditColor(c)}
                    className={cn(
                      'w-6 h-6 rounded-full ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 transition-all duration-300 ease-spring',
                      editColor === c
                        ? 'ring-slate-400 scale-125'
                        : 'ring-transparent md:hover:scale-110'
                    )}
                    style={{ backgroundColor: c }}
                  />
                )
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="danger-ghost"
              onClick={() => setShowDeleteConfirm(true)}
              className="mr-auto"
            >
              Delete
            </Button>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default HabitDetailsModal;
