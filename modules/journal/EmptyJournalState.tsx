import React from 'react';
import { EmptyState } from '../../core';
import { BookText } from 'lucide-react';

interface EmptyJournalStateProps {
  onCreateEntry: () => void;
}

export const EmptyJournalState: React.FC<EmptyJournalStateProps> = ({ onCreateEntry }) => {
  return (
    <EmptyState
      icon={<BookText className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />}
      title="Start Your Journal"
      description="Documenting your journey boosts success rates by 40%. Record your first milestone, thought, or feeling today."
      actionLabel="Write First Entry"
      onAction={onCreateEntry}
    />
  );
};
