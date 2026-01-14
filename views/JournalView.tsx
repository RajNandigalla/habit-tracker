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

import { useNavigate, useLocation } from 'react-router-dom';

export const JournalView: React.FC<JournalViewProps> = ({ entries, habits, onAddEntry }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sortedEntries = [...entries].sort((a, b) => sortDatesDesc(a.date, b.date));

  const handleOpenModal = () => {
    navigate('/journal/new', { state: { background: location } });
  };

  return (
    <PageTransition>
      <main className="flex-1" aria-label="Journal">
        <h1 className="sr-only">Journey Log</h1>
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 pb-24 md:pb-8">
          <div className="flex items-center justify-between mb-8">
            <PageTitle title="Journey Log" description="Reflect on your progress and milestones." />
            {sortedEntries.length > 0 && (
              <Button
                size="sm"
                onClick={handleOpenModal}
                className="hidden md:flex shadow-md px-4 py-2.5"
              >
                <Plus className="h-4 w-4 mr-2" /> New Entry
              </Button>
            )}
          </div>

          <section aria-labelledby="journal-entries-heading">
            <h2 id="journal-entries-heading" className="sr-only">
              Journal Entries
            </h2>
            <Show
              when={sortedEntries.length === 0}
              fallback={
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-6 space-y-8 my-4">
                  {sortedEntries.map((entry, index) => {
                    const habit = habits.find(h => h.id === entry.habitId);
                    return (
                      <JournalTimelineItem
                        key={entry.id}
                        entry={entry}
                        habit={habit}
                        index={index}
                      />
                    );
                  })}
                </div>
              }
            >
              <EmptyJournalState onCreateEntry={handleOpenModal} />
            </Show>
          </section>
        </div>
      </main>

      {/* Mobile FAB - Hide when empty state is showing */}
      {sortedEntries.length > 0 && (
        <FAB
          onClick={handleOpenModal}
          ariaLabel="New Entry"
          isParentOpen={location.pathname === '/journal/new'}
        />
      )}
    </PageTransition>
  );
};
