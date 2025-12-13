import React, { useMemo, useEffect, useState } from 'react';
import { Card, Modal } from '../core';
import { Habit, JournalEntry } from '../../types';
import { getTodayISO, cn } from '../../utils';
import { Smile, Meh, Frown, Zap, Trophy, CloudRain, Sun, Moon, Flame } from 'lucide-react';
import dayjs from 'dayjs';

interface DailyOverviewProps {
  habits: Habit[];
  journalEntries: JournalEntry[];
  onLogMood: (mood: 'happy' | 'motivated' | 'neutral' | 'sad' | 'tired') => void;
  username?: string;
}

export const DailyOverview: React.FC<DailyOverviewProps> = ({
  habits,
  journalEntries,
  onLogMood,
  username = 'Achiever',
}) => {
  const todayISO = getTodayISO();
  const currentHour = new Date().getHours();
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);

  // Animation state for progress ring
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Greeting Logic
  const greeting = useMemo(() => {
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, [currentHour]);

  const GreetingIcon = useMemo(() => {
    if (currentHour < 12) return Sun;
    if (currentHour < 18) return CloudRain;
    return Moon;
  }, [currentHour]);

  // Progress Logic
  const activeHabits = habits.filter(h => h.frequency === 'daily');
  const totalHabits = activeHabits.length;
  const completedHabits = activeHabits.filter(h => h.completedDates.includes(todayISO)).length;
  const progressPercentage =
    totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  useEffect(() => {
    // Slight delay to trigger animation after mount
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  // Mood Logic
  const todayEntry = journalEntries.find(j => j.date.startsWith(todayISO));
  const currentMood = todayEntry?.mood;

  const moodOptions = [
    {
      value: 'motivated',
      icon: Zap,
      label: 'Motivated',
      color: 'text-amber-500',
      bg: 'bg-amber-100 dark:bg-amber-900/30',
    },
    {
      value: 'happy',
      icon: Smile,
      label: 'Great',
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      value: 'neutral',
      icon: Meh,
      label: 'Okay',
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      value: 'tired',
      icon: Moon,
      label: 'Tired',
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      value: 'sad',
      icon: Frown,
      label: 'Down',
      color: 'text-slate-500',
      bg: 'bg-slate-100 dark:bg-slate-800',
    },
  ];

  const CurrentMoodIcon = currentMood
    ? moodOptions.find(m => m.value === currentMood)?.icon || Smile
    : Smile;

  return (
    <>
      {/* --- Mobile View: High-Density Command Bar --- */}
      <div className="lg:hidden mb-6 animate-slide-up">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl shadow-indigo-900/20">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90"></div>

          {/* Content Container */}
          <div className="relative z-10 flex items-center justify-between p-3.5 h-[88px]">
            {/* Left: Progress Ring */}
            <div className="relative w-[52px] h-[52px] flex-shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="26"
                  cy="26"
                  r="23"
                  className="stroke-white/20"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="26"
                  cy="26"
                  r="23"
                  className="stroke-white transition-all duration-1000 ease-out"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="144.5"
                  strokeDashoffset={144.5 - (144.5 * animatedProgress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>

            {/* Center: Greeting & Summary */}
            <div className="flex-grow px-3.5 flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 text-indigo-100 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                <span>{dayjs().format('MMM D')}</span>
                <span className="w-0.5 h-0.5 bg-indigo-200 rounded-full"></span>
                <span>{activeHabits.length - completedHabits} Remaining</span>
              </div>
              <h2 className="text-base font-bold text-white truncate leading-tight">
                {greeting}, {username}
              </h2>
            </div>

            {/* Right: Actions (Streak & Mood) */}
            <div className="flex items-center gap-2 flex-shrink-0 border-l border-white/20 pl-3">
              {/* Streak Badge */}
              <div className="flex flex-col items-center justify-center w-10">
                <Flame className="w-5 h-5 text-orange-400 fill-orange-400 mb-0.5" />
                <span className="text-[10px] font-bold text-white">{bestStreak}</span>
              </div>

              {/* Mood Trigger */}
              <button
                onClick={() => setIsMoodModalOpen(true)}
                className={cn(
                  'flex flex-col items-center justify-center w-11 h-11 rounded-xl transition-all active:scale-95 border border-white/10',
                  currentMood ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'
                )}
              >
                {currentMood ? (
                  <div className={cn('text-white')}>
                    <CurrentMoodIcon className="w-5 h-5 mb-0.5" />
                  </div>
                ) : (
                  <Smile className="w-5 h-5 text-indigo-200 mb-0.5" />
                )}
                <span className="text-[9px] font-medium text-indigo-100 truncate w-full text-center px-0.5">
                  {currentMood ? 'Mood' : 'Log'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Mobile Mood Modal --- */}
      <Modal
        isOpen={isMoodModalOpen}
        onClose={() => setIsMoodModalOpen(false)}
        title="How are you feeling?"
        center
      >
        <div className="grid grid-cols-3 gap-3 py-2">
          {moodOptions.map(m => {
            const isSelected = currentMood === m.value;
            return (
              <button
                key={m.value}
                onClick={() => {
                  onLogMood(m.value as any);
                  setIsMoodModalOpen(false);
                }}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 active:scale-95',
                  isSelected
                    ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 dark:bg-indigo-900/30 dark:border-indigo-400'
                    : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:border-indigo-200'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center mb-2',
                    m.bg,
                    isSelected ? 'scale-110' : ''
                  )}
                >
                  <m.icon className={cn('w-6 h-6', m.color)} />
                </div>
                <span
                  className={cn(
                    'text-xs font-semibold',
                    isSelected
                      ? 'text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400'
                  )}
                >
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </Modal>

      {/* --- Desktop View: Compact Stacked Layout --- */}
      <div className="hidden lg:flex flex-col gap-4 mb-8 animate-slide-up">
        {/* Compact Greeting & Progress Card */}
        <Card className="relative overflow-hidden border-none bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg shadow-indigo-500/20 p-5 group">
          {/* Subtle Backgrounds */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl transition-transform duration-1000 group-hover:scale-110"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl transition-transform duration-1000 group-hover:scale-110"></div>

          <div className="relative z-10 flex items-center justify-between">
            {/* Left: Text */}
            <div className="flex-1 min-w-0 mr-8">
              <div className="flex items-center gap-2 text-indigo-100 mb-1 text-xs font-semibold uppercase tracking-wider">
                <GreetingIcon className="w-3.5 h-3.5" />
                <span>{dayjs().format('dddd, MMM D')}</span>
              </div>
              <h2 className="text-2xl font-bold truncate">
                {greeting}, {username}
              </h2>
              <p className="text-indigo-100/90 text-sm mt-0.5 truncate">
                {progressPercentage === 100
                  ? "All goals crushed! You're on fire."
                  : progressPercentage >= 50
                    ? 'Great momentum. Keep it up!'
                    : 'Small steps lead to big changes.'}
              </p>
            </div>

            {/* Right: Stats & Progress */}
            <div className="flex items-center gap-6">
              {/* Stats */}
              <div className="flex gap-6 text-right">
                <div>
                  <div className="text-xl font-bold leading-none">{completedHabits}</div>
                  <div className="text-[10px] text-indigo-200 uppercase font-bold mt-1">Done</div>
                </div>
                <div>
                  <div className="text-xl font-bold leading-none">
                    {totalHabits - completedHabits}
                  </div>
                  <div className="text-[10px] text-indigo-200 uppercase font-bold mt-1">To Go</div>
                </div>
              </div>

              {/* Ring */}
              <div className="relative w-14 h-14 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-indigo-800/50"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="text-white transition-all duration-1000 ease-out"
                    strokeDasharray={`${animatedProgress}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xs">
                  {Math.round(progressPercentage)}%
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Compact Mood Card (with Features Restored) */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between">
            {/* Left: Info */}
            <div className="flex items-center gap-5">
              <div className="p-3 bg-indigo-50 dark:bg-slate-800 rounded-2xl text-indigo-600 dark:text-indigo-400">
                <Smile className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Mood Check</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  How are you feeling right now?
                </p>
              </div>

              {/* Streak - Restored */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 ml-4">
                <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                    Current Streak
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                    {bestStreak} Days
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            {currentMood ? (
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-5 py-2.5 rounded-xl border border-slate-100 dark:border-slate-700 animate-fade-in">
                <span className="text-sm text-slate-600 dark:text-slate-300">You're feeling</span>
                <div
                  className={cn(
                    'flex items-center gap-2 font-bold px-2 py-0.5 rounded-md text-sm',
                    moodOptions.find(m => m.value === currentMood)?.color,
                    moodOptions.find(m => m.value === currentMood)?.bg
                  )}
                >
                  {React.createElement(
                    moodOptions.find(m => m.value === currentMood)?.icon || Smile,
                    { className: 'w-4 h-4' }
                  )}
                  <span className="capitalize">{currentMood}</span>
                </div>
                <button
                  onClick={() => onLogMood(null as any)}
                  className="ml-2 text-xs text-slate-400 underline hover:text-indigo-500"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {moodOptions.map(mood => (
                  <button
                    key={mood.value}
                    onClick={() => onLogMood(mood.value as any)}
                    className="group relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <mood.icon
                      className={cn(
                        'w-6 h-6 transition-colors duration-200 text-slate-400 dark:text-slate-500',
                        mood.value === 'motivated' && 'group-hover:text-amber-500',
                        mood.value === 'happy' && 'group-hover:text-green-500',
                        mood.value === 'neutral' && 'group-hover:text-blue-500',
                        mood.value === 'tired' && 'group-hover:text-purple-500',
                        mood.value === 'sad' &&
                          'group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      )}
                    />

                    {/* Custom Tooltip - Restored */}
                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap shadow-xl z-20">
                      {mood.label}
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-white"></span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};
