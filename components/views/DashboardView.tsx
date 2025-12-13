import React, { useState, useMemo } from 'react';
import { Habit, ViewMode, HabitCategory, JournalEntry } from '../../types';
import { HabitListItem, AddHabitModal } from '../modules/HabitModules';
import { Button, Chip, Modal } from '../UI';
import { Plus, Sparkles, AlertTriangle } from 'lucide-react';
import { cn, getTodayISO, generateId } from '../../utils';
import { PageTitle } from '../modules/PageTitle';
import { FocusTimer } from '../modules/FocusTimer';
import { DailyOverview } from '../modules/DashboardWidgets';
import { useStore } from '../../context/Store';
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
      date: new Date().toISOString(),
      content: `Daily check-in: Feeling ${mood}.`,
      mood: mood,
    };
    addJournalEntry(entry);
  };

  return (
    <PageTransition className="bg-slate-50 dark:bg-slate-950">
      {/* Content */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth">
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
                className="shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/20 h-10"
              >
                <Plus className="h-4 w-4 mr-2" /> New Habit
              </Button>
            </div>
          </div>

          {/* Category Filter - Increased Spacing */}
          <div className="sticky top-0 z-30 -mx-4 px-4 pt-2 pb-4 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 mb-8 transition-all duration-300 md:static md:bg-transparent md:dark:bg-transparent md:backdrop-blur-none md:border-none md:p-0 md:m-0 md:mb-6">
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar w-full md:w-auto md:flex-wrap pb-1 md:pb-0">
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

          {habits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-enter">
              <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-900/30 rounded-full blur-xl group-hover:bg-indigo-500/30 dark:group-hover:bg-indigo-900/40 transition-all duration-1000"></div>
                <div
                  className="relative w-24 h-24 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-500/10 dark:shadow-indigo-900/10 border border-indigo-100 dark:border-slate-700 animate-bounce"
                  style={{ animationDuration: '3s' }}
                >
                  <Sparkles className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                No habits yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed text-base">
                Your journey to success starts with a single step. Add your first habit to begin
                tracking your potential.
              </p>

              <Button
                onClick={() => setModalOpen(true)}
                size="lg"
                className="hidden md:inline-flex shadow-xl shadow-indigo-600/20 dark:shadow-indigo-900/20 px-8"
              >
                Create Habit
              </Button>
            </div>
          ) : (
            <>
              {filteredHabits.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400 animate-fade-scale">
                  No habits found in{' '}
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {selectedCategory}
                  </span>
                  .
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredHabits.map((habit, index) => (
                    <div
                      key={habit.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <HabitListItem
                        habit={habit}
                        toggleHabitCompletion={onToggleCompletion}
                        onFocus={setFocusHabit}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Mobile FAB */}
      <button
        onClick={() => setModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 dark:shadow-indigo-900/30 active:scale-90 transition-transform z-40 animate-pop"
      >
        <Plus className="h-6 w-6" />
      </button>

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
