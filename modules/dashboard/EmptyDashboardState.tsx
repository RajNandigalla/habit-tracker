import React from 'react';
import { EmptyState } from '../../core';
import { Target } from 'lucide-react';

interface EmptyDashboardStateProps {
  onCreateHabit: () => void;
}

export const EmptyDashboardState: React.FC<EmptyDashboardStateProps> = ({ onCreateHabit }) => {
  return (
    <EmptyState
      icon={<Target className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />}
      title="No habits yet"
      description="Your journey to success starts with a single step. Add your first habit to begin tracking your potential."
      actionLabel="Create Habit"
      onAction={onCreateHabit}
    />
  );
};
