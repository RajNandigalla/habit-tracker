import React, { useState, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Habit, ViewMode, HabitCategory, JournalEntry } from '../types';
import { HabitListItem, AddHabitModal } from '../modules/habits';
import { Button, Chip, Modal, Show, FAB, Flex, FlexItem, Grid } from '../core';
import { dayjs } from '../utils';
import { Plus, Sparkles, AlertTriangle } from 'lucide-react';
import { cn, getTodayISO, generateId, isHabitScheduledForDate } from '../utils'; // Added isHabitScheduledForDate
import { PageTitle } from '../modules/PageTitle';
import { FocusTimer } from '../modules/FocusTimer';
import { DailyOverview } from '../modules/DashboardWidgets';
import { WeeklyCalendar } from '../modules/dashboard/WeeklyCalendar'; // Import
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
  const { journalEntries, addJournalEntry, categories: storeCategories } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [focusHabit, setFocusHabit] = useState<Habit | null>(null);

  // New State for Weekly Calendar
  const [selectedDate, setSelectedDate] = useState<string>(getTodayISO());

  const filteredHabits = useMemo(() => {
    let filtered = habits;

    // 1. Filter by Category
    if (selectedCategory !== 'All') {
      const targetCat = storeCategories.find(c => c.label === selectedCategory);
      const targetId = targetCat?.id;

      filtered = filtered.filter(h => {
        if (targetId && h.categoryIds && h.categoryIds.includes(targetId)) return true;
        if ((h as any).category === selectedCategory) return true;
        return false;
      });
    }

    // 2. Filter by Date (Scheduled or Active)
    // We show habits that are EITHER:
    // a) Scheduled for this date (Specific Days / Daily)
    // b) Completed on this date (even if not scheduled, though rare for logic)
    // c) Weekly habits (always show, or logic could be refined to 'not completed this week')
    // For now, let's stick to "Scheduled for Date OR Completed on Date"

    // Note: 'weekly' habits usually don't have specific days, so we show them always or if not full?
    // Let's use isHabitScheduledForDate helper but ensure 'weekly' habits are visible
    filtered = filtered.filter(h => {
      const isScheduled = isHabitScheduledForDate(h, selectedDate);
      const isCompletedOnDate = h.completedDates.includes(selectedDate);
      if (h.frequency === 'weekly') return true; // Always show weekly habits? Or maybe just if not done?
      return isScheduled || isCompletedOnDate;
    });

    return filtered;
  }, [habits, selectedCategory, storeCategories, selectedDate]);

  const categories = ['All', ...storeCategories.map(c => c.label)];

  const handleQuickMoodLog = (mood: string | null) => {
    if (!mood) return; // Handle null case (edit/clear)

    const entry: JournalEntry = {
      id: generateId(),
      date: dayjs().toISOString(),
      content: `Daily check-in: Feeling ${mood}.`,
      mood: mood as any,
    };
    addJournalEntry(entry);
  };

  return (
    <PageTransition>
      <main className="flex-1 relative scroll-smooth" aria-label="Dashboard">
        <h1 className="sr-only">Dashboard</h1>
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 pb-24 md:pb-8">
          <section aria-labelledby="daily-overview-heading">
            <h2 id="daily-overview-heading" className="sr-only">
              Daily Overview
            </h2>
            <DailyOverview
              habits={habits}
              journalEntries={journalEntries}
              onLogMood={handleQuickMoodLog}
            />
          </section>

          {/* 1. Header Row (Title + Actions) */}
          <Flex
            direction="column"
            align="start"
            justify="between"
            gap={4}
            className="md:flex-row md:items-end mb-6"
          >
            <FlexItem className="mb-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Habits</h2>
              <p className="text-slate-500 text-sm">Focus on today's goals.</p>
            </FlexItem>

            {habits.length > 0 && (
              <Flex align="center" gap={3} className="hidden md:flex">
                <Button
                  onClick={() => navigate('/habit/add', { state: { background: location } })}
                  size="sm"
                  className="shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/20 h-10 px-4 py-2.5"
                >
                  <Plus className="h-4 w-4" /> New Habit
                </Button>
              </Flex>
            )}
          </Flex>

          {/* Desktop Card Wrapper */}
          <section aria-labelledby="habits-section-heading">
            <h2 id="habits-section-heading" className="sr-only">
              Your Habits
            </h2>
            <div className="md:rounded-4xl md:border md:border-slate-200 md:dark:border-slate-800 md:p-6 mb-8">
              {/* 2. Weekly Calendar */}
              <div className="w-full md:w-auto flex-1 mb-4">
                <WeeklyCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
              </div>

              {/* Category Filter */}
              <div className="sticky top-0 z-30 -mx-4 px-4 pt-2 pb-4 bg-slate-50/95 dark:bg-slate-950/95 border-b border-slate-200/50 dark:border-slate-800/50 mb-8 transition-all duration-300 md:static md:bg-transparent md:dark:bg-transparent md:border-none md:p-0 md:m-0 md:mb-6">
                <Flex
                  gap={2}
                  wrap="wrap"
                  className="overflow-x-auto no-scrollbar w-full md:w-auto p-1"
                >
                  {categories.map(cat => (
                    <Chip
                      key={cat}
                      isActive={selectedCategory === cat}
                      onClick={() => setSelectedCategory(cat as HabitCategory | 'All')}
                    >
                      {cat}
                    </Chip>
                  ))}
                </Flex>
              </div>

              <Show
                when={habits.length === 0}
                fallback={
                  <Show
                    when={filteredHabits.length === 0}
                    fallback={
                      <Grid gap={3} cols={1}>
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
                                selectedDate={selectedDate}
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </Grid>
                    }
                  >
                    <div className="text-center py-12 text-slate-600 dark:text-slate-400 animate-fade-scale">
                      No habits found for this date in{' '}
                      <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                        {selectedCategory}
                      </span>
                      .
                    </div>
                  </Show>
                }
              >
                <EmptyDashboardState
                  onCreateHabit={() => navigate('/habit/add', { state: { background: location } })}
                />
              </Show>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile FAB - Hide when empty state is showing */}
      {habits.length > 0 && (
        <FAB
          onClick={() => navigate('/habit/add', { state: { background: location } })}
          ariaLabel="Create new habit"
          isParentOpen={location.pathname === '/habit/add'}
        />
      )}
    </PageTransition>
  );
};
