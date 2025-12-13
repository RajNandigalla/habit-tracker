import React, { useState } from 'react';
import { JournalEntry, Habit } from '../types';
import { Button, Show, FAB } from '../core';
import { Plus, Sparkles } from 'lucide-react';
import { JournalTimelineItem, AddJournalEntryModal } from '../modules/journal';
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
    <PageTransition className="bg-slate-50 dark:bg-slate-950">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 pb-24 md:pb-8">
          <div className="flex items-center justify-between mb-8">
            <PageTitle title="Journey Log" description="Reflect on your progress and milestones." />
            <Button
              size="sm"
              onClick={() => setModalOpen(true)}
              className="hidden md:flex shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" /> New Entry
            </Button>
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
            <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-900/30 rounded-full blur-xl"></div>
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 border border-indigo-100 dark:border-slate-700 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-900/10">
                  <Sparkles className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Start Your Journal
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8 max-w-md mx-auto leading-relaxed">
                Documenting your journey boosts success rates by 40%. Record your first milestone,
                thought, or feeling today.
              </p>
              <Button
                size="lg"
                onClick={() => setModalOpen(true)}
                className="hidden md:inline-flex px-8 shadow-xl shadow-indigo-600/20 dark:shadow-indigo-900/20"
              >
                Write First Entry
              </Button>
            </div>
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
