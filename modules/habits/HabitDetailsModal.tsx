import React, { useState, useEffect } from 'react';
import { Habit } from '../../types';
import { calculateHabitStats } from '../../utils';
import { Modal, Show } from '../../core';
import dayjs from 'dayjs';
import { useStore } from '../../context/Store';
import { useTimeout } from 'usehooks-ts';
import { HabitCalendar } from './HabitCalendar';
import { HabitStats } from './HabitStats';
import { HabitEditForm } from './HabitEditForm';
import { DeleteConfirmation } from './DeleteConfirmation';
import { HabitViewHeader } from './HabitViewHeader';

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
  const [isDeleting, setIsDeleting] = useState(initialMode === 'delete');
  const [viewDate, setViewDate] = useState(dayjs());
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editReminder, setEditReminder] = useState('');
  const [editCategoryIds, setEditCategoryIds] = useState<string[]>([]);

  const { categories } = useStore();

  React.useEffect(() => {
    if (isOpen && habit) {
      setEditName(habit.name);
      setEditDesc(habit.description);
      setEditColor(habit.color);
      setEditCategoryIds(habit.categoryIds || []);
      setEditReminder(habit.reminderTime || '');
      setIsEditing(initialMode === 'edit');
      setShowDeleteConfirm(initialMode === 'delete');
      setViewDate(dayjs());
    }
  }, [isOpen, habit, initialMode]);

  if (!habit) return null;

  const stats = calculateHabitStats(habit);

  const handleSave = () => {
    onUpdate({
      ...habit,
      name: editName,
      description: editDesc,
      color: editColor,
      categoryIds: editCategoryIds,
      reminderTime: editReminder,
    });
    setIsEditing(false);
  };

  const confirmDelete = () => {
    setIsDeleting(true);
    onClose();
  };

  // Wait for modal close animation before triggering delete
  useTimeout(
    () => {
      if (isDeleting) {
        onDelete(habit.id);
      }
    },
    isDeleting ? 300 : null
  );

  const handleCancelDelete = () => {
    if (initialMode === 'delete') {
      onClose();
      return;
    }
    setShowDeleteConfirm(false);
  };

  const handleStartFocus = () => {
    if (onFocus) {
      onFocus(habit);
      onClose();
    }
  };

  const handleCategoryToggle = (id: string) => {
    setEditCategoryIds(prev => (prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]));
  };

  const formatTimeDisplay = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  // Resolve habit categories for display
  const habitCategories = (habit.categoryIds || [])
    .map(id => categories.find(c => c.id === id))
    .filter(Boolean);

  const modalTitle = showDeleteConfirm
    ? 'Delete Habit'
    : isEditing
      ? 'Edit Habit'
      : 'Habit Details';

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={modalTitle}
        size={!isEditing && !showDeleteConfirm ? '3xl' : 'md'}
      >
        <Show
          when={showDeleteConfirm}
          fallback={
            <Show
              when={!isEditing}
              fallback={
                <HabitEditForm
                  habit={habit}
                  editName={editName}
                  editDesc={editDesc}
                  editColor={editColor}
                  editReminder={editReminder}
                  editCategoryIds={editCategoryIds}
                  onNameChange={setEditName}
                  onDescChange={setEditDesc}
                  onColorChange={setEditColor}
                  onReminderChange={setEditReminder}
                  onCategoryToggle={handleCategoryToggle}
                  onSave={handleSave}
                  onCancel={() => setIsEditing(false)}
                  onDelete={() => setShowDeleteConfirm(true)}
                />
              }
            >
              <div className="space-y-6">
                {/* Header Info */}
                <HabitViewHeader
                  habit={habit}
                  habitCategories={habitCategories}
                  onEdit={() => setIsEditing(true)}
                  onDelete={() => setShowDeleteConfirm(true)}
                  onFocus={onFocus ? handleStartFocus : undefined}
                  formatTimeDisplay={formatTimeDisplay}
                />

                {/* Main Content Grid */}
                <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:items-start">
                  {/* Left Column: Stats & Heatmap */}
                  <div className="md:col-span-7">
                    <HabitStats habit={habit} stats={stats} />
                  </div>

                  {/* Right Column: Calendar */}
                  <div className="md:col-span-5 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 h-full">
                    <HabitCalendar
                      habit={habit}
                      viewDate={viewDate}
                      onViewDateChange={setViewDate}
                    />
                  </div>
                </div>
              </div>
            </Show>
          }
        >
          <DeleteConfirmation
            itemName={habit.name}
            onConfirm={confirmDelete}
            onCancel={handleCancelDelete}
          />
        </Show>
      </Modal>
    </>
  );
};

export default HabitDetailsModal;
