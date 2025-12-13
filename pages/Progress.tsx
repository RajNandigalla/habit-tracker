import React, { useMemo, useState } from 'react';
import { useStore } from '../context/Store';
import { ProgressView } from '../components/views/ProgressView';
import dayjs from 'dayjs';
import {
  GlobalStats,
  HeatmapData,
  MoodCorrelationData,
} from '../components/modules/ProgressModules';
import { generateProgressReport } from '../services/geminiService';

export const Progress: React.FC = () => {
  const { habits, journalEntries, preferences, toggleDarkMode } = useStore();

  // AI State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- Calculation Logic ---

  // 1. Calculate Global Stats
  const stats: GlobalStats = useMemo(() => {
    if (habits.length === 0) {
      return { totalCompletions: 0, completionRate: 0, longestStreak: 0, bestDay: '-' };
    }

    let totalCompletions = 0;
    let maxGlobalStreak = 0;
    const dayCounts: Record<string, number> = {}; // "Monday": 5

    habits.forEach(habit => {
      totalCompletions += habit.completedDates.length;

      if (habit.streak > maxGlobalStreak) maxGlobalStreak = habit.streak;

      // Best Day Calculation
      habit.completedDates.forEach(date => {
        const dayName = dayjs(date).format('dddd');
        dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
      });
    });

    // Best Day
    let bestDay = '-';
    let maxDayCount = 0;
    Object.entries(dayCounts).forEach(([day, count]) => {
      if (count > maxDayCount) {
        maxDayCount = count;
        bestDay = day;
      }
    });

    // 30-Day Completion Rate
    const last30DaysStart = dayjs().subtract(30, 'day');
    let completionsLast30 = 0;
    habits.forEach(h => {
      completionsLast30 += h.completedDates.filter(d => dayjs(d).isAfter(last30DaysStart)).length;
    });

    const possibleCompletions = habits.length * 30;
    const completionRate =
      possibleCompletions > 0 ? Math.round((completionsLast30 / possibleCompletions) * 100) : 0;

    return {
      totalCompletions,
      completionRate,
      longestStreak: maxGlobalStreak,
      bestDay,
    };
  }, [habits]);

  // 2. Heatmap Data (Last 90 Days)
  const heatmapData: HeatmapData[] = useMemo(() => {
    const days = 90;
    const data: HeatmapData[] = [];
    const today = dayjs();

    const completionMap: Record<string, number> = {};
    habits.forEach(h => {
      h.completedDates.forEach(d => {
        completionMap[d] = (completionMap[d] || 0) + 1;
      });
    });

    for (let i = days - 1; i >= 0; i--) {
      const date = today.subtract(i, 'day').format('YYYY-MM-DD');
      data.push({
        date,
        count: completionMap[date] || 0,
      });
    }
    return data;
  }, [habits]);

  // 3. Mood Correlation Data
  const moodCorrelationData: MoodCorrelationData[] = useMemo(() => {
    const moodStats: Record<
      string,
      { totalPossible: number; completed: number; dayCount: number }
    > = {};
    const moodDates: Record<string, string> = {}; // date -> mood

    // 1. Map dates to moods (prioritize latest entry for a day if multiple)
    journalEntries.forEach(entry => {
      if (entry.mood) {
        // simple substring to get YYYY-MM-DD from ISO string
        const dateKey = entry.date.split('T')[0];
        moodDates[dateKey] = entry.mood;
      }
    });

    // 2. Iterate last 30 days to calculate rates
    const today = dayjs();
    for (let i = 0; i < 30; i++) {
      const date = today.subtract(i, 'day').format('YYYY-MM-DD');
      const mood = moodDates[date];

      if (mood) {
        if (!moodStats[mood]) moodStats[mood] = { totalPossible: 0, completed: 0, dayCount: 0 };

        // Active habits on this day?
        // Simplified: Assume all current habits were active.
        // For a more robust app, check 'createdAt'.
        const activeHabitsCount = habits.filter(h =>
          dayjs(h.createdAt).isBefore(dayjs(date).add(1, 'day'))
        ).length;

        if (activeHabitsCount > 0) {
          moodStats[mood].dayCount++;
          moodStats[mood].totalPossible += activeHabitsCount;

          // Count completions on this day
          let dayCompletions = 0;
          habits.forEach(h => {
            if (h.completedDates.includes(date)) dayCompletions++;
          });
          moodStats[mood].completed += dayCompletions;
        }
      }
    }

    // 3. Transform to array
    return Object.entries(moodStats).map(([mood, stats]) => ({
      mood,
      count: stats.dayCount,
      completionRate:
        stats.totalPossible > 0 ? Math.round((stats.completed / stats.totalPossible) * 100) : 0,
    }));
  }, [habits, journalEntries]);

  // AI Handlers
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    const report = await generateProgressReport(habits, stats);
    setAiReport(report);
    setIsGenerating(false);
  };

  return (
    <ProgressView
      stats={stats}
      heatmapData={heatmapData}
      moodCorrelationData={moodCorrelationData}
      habits={habits}
      darkMode={preferences.darkMode}
      onToggleDarkMode={toggleDarkMode}
      isAIModalOpen={isAIModalOpen}
      onOpenAIModal={() => setIsAIModalOpen(true)}
      onCloseAIModal={() => setIsAIModalOpen(false)}
      aiReport={aiReport}
      isGeneratingReport={isGenerating}
      onGenerateReport={handleGenerateReport}
    />
  );
};
