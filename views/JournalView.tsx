import React, { useState } from 'react';
import { JournalEntry, Habit } from '../types';
import { Button, Show, FAB } from '../core';
import { Plus, Sparkles } from 'lucide-react';
import { JournalTimelineItem, AddJournalEntryModal, EmptyJournalState } from '../modules/journal';
import { PageTitle } from '../modules/PageTitle';
import PageTransition from '../core/PageTransition';
import { sortDatesDesc } from '../utils'; // Added this import

interface JournalViewProps {
  entries: JournalEntry[];
  habits: Habit[];
  onAddEntry: (entry: JournalEntry) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ entries, habits, onAddEntry }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const sortedEntries = [...entries].sort((a, b) => sortDatesDesc(a.date, b.date));

  return (
    <PageTransition>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 pb-24 md:pb-8">
          <div className="flex items-center justify-between mb-8">
            <PageTitle title="Journey Log" description="Reflect on your progress and milestones." />
            {sortedEntries.length > 0 && (
              <Button
                size="sm"
                onClick={() => setModalOpen(true)}
                className="hidden md:flex shadow-md px-4 py-2.5"
              >
                <Plus className="h-4 w-4 mr-2" /> New Entry
              </Button>
            )}
          </div>

          <Show
            when={sortedEntries.length === 0}
            fallback={
              <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-6 space-y-8 my-4">
                {sortedEntries.map((entry, index) => {
                  const habit = habits.find(h => h.id === entry.habitId);
                  return (
                    <JournalTimelineItem key={entry.id} entry={entry} habit={habit} index={index} />
                  );
                })}
              </div>
            }
          >
            <EmptyJournalState onCreateEntry={() => setModalOpen(true)} />
          </Show>
        </div>
      </main>

      {/* Mobile FAB */}
      <FAB onClick={() => setModalOpen(true)} ariaLabel="New Entry" isParentOpen={isModalOpen} />

      <AddJournalEntryModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={onAddEntry}
        habits={habits}
      />
    </PageTransition>
  );
};
