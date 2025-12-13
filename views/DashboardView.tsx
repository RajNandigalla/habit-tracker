import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Habit, ViewMode, HabitCategory, JournalEntry } from '../types';
import { HabitListItem, AddHabitModal } from '../modules/habits';
import { Button, Chip, Modal, Show, FAB } from '../core';
import { dayjs } from '../utils';
import { Plus, Sparkles, AlertTriangle } from 'lucide-react';
import { cn, getTodayISO, generateId } from '../utils';
import { PageTitle } from '../modules/PageTitle';
import { FocusTimer } from '../modules/FocusTimer';
import { DailyOverview } from '../modules/DashboardWidgets';
import { EmptyDashboardState } from '../modules/dashboard';
import { useStore } from '../context/Store';
import PageTransition from '../core/PageTransition';

interface DashboardViewProps {
  habits: Habit[];
  viewMode: ViewMode;
  darkMode: boolean;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleDarkMode: () => void;
  onAddHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  onToggleCompletion: (id: string, date: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  habits,
  onAddHabit,
  onDeleteHabit,
  onToggleCompletion,
}) => {
  const { journalEntries, addJournalEntry } = useStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'All'>('All');
  const [focusHabit, setFocusHabit] = useState<Habit | null>(null);

  const filteredHabits = useMemo(() => {
    if (selectedCategory === 'All') return habits;
    return habits.filter(h => h.category === selectedCategory);
  }, [habits, selectedCategory]);

  const categories = ['All', ...Object.values(HabitCategory)];

  const handleQuickMoodLog = (mood: 'happy' | 'motivated' | 'neutral' | 'sad' | 'tired') => {
    const entry: JournalEntry = {
      id: generateId(),
      date: dayjs().toISOString(),
      content: `Daily check-in: Feeling ${mood}.`,
      mood: mood,
    };
    addJournalEntry(entry);
  };

  return (
    <PageTransition>
      <main className="flex-1 relative scroll-smooth">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 pb-24 md:pb-8">
          <DailyOverview
            habits={habits}
            journalEntries={journalEntries}
            onLogMood={handleQuickMoodLog}
          />

          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-4 gap-4">
            <PageTitle
              title="Your Habits"
              description="Focus on the process, not just the result."
              className=""
            />

            {/* Desktop Actions Toolbar */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                onClick={() => setModalOpen(true)}
                size="sm"
                className="shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/20 h-10 px-4 py-2.5"
              >
                <Plus className="h-4 w-4" /> New Habit
              </Button>
            </div>
          </div>

          {/* Category Filter - Increased Spacing */}
          <div className="sticky top-0 z-30 -mx-4 px-4 pt-2 pb-4 bg-slate-50/95 dark:bg-slate-950/95 border-b border-slate-200/50 dark:border-slate-800/50 mb-8 transition-all duration-300 md:static md:bg-transparent md:dark:bg-transparent md:border-none md:p-0 md:m-0 md:mb-6">
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar w-full md:w-auto md:flex-wrap p-1">
              {categories.map(cat => (
                <Chip
                  key={cat}
                  isActive={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat as HabitCategory | 'All')}
                >
                  {cat}
                </Chip>
              ))}
            </div>
          </div>

          <Show
            when={habits.length === 0}
            fallback={
              <Show
                when={filteredHabits.length === 0}
                fallback={
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {filteredHabits.map(habit => (
                        <motion.div
                          key={habit.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <HabitListItem
                            habit={habit}
                            toggleHabitCompletion={onToggleCompletion}
                            onFocus={setFocusHabit}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                }
              >
                <div className="text-center py-12 text-slate-500 dark:text-slate-400 animate-fade-scale">
                  No habits found in{' '}
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {selectedCategory}
                  </span>
                  .
                </div>
              </Show>
            }
          >
            <EmptyDashboardState onCreateHabit={() => setModalOpen(true)} />
          </Show>
        </div>
      </main>

      {/* Mobile FAB */}
      <FAB
        onClick={() => setModalOpen(true)}
        ariaLabel="Create new habit"
        isParentOpen={isModalOpen}
      />

      <AddHabitModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onAdd={onAddHabit} />

      <FocusTimer
        habit={focusHabit}
        isOpen={!!focusHabit}
        onClose={() => setFocusHabit(null)}
        onComplete={id => {
          onToggleCompletion(id, getTodayISO());
        }}
      />
    </PageTransition>
  );
};
