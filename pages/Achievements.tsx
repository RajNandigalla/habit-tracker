import React, { useMemo } from 'react';
import { useStore } from '../context/Store';
import { AchievementsView } from '../components/views/AchievementsView';
import { useAchievements } from '../hooks/useAchievements';
import dayjs from 'dayjs';

export const Achievements: React.FC = () => {
    const { habits, journalEntries } = useStore();

    // Calculate necessary stats for achievements hook
    const stats = useMemo(() => {
        let totalCompletions = 0;
        let maxGlobalStreak = 0;

        habits.forEach(habit => {
            totalCompletions += habit.completedDates.length;
            if (habit.streak > maxGlobalStreak) maxGlobalStreak = habit.streak;
        });

        return { totalCompletions, longestStreak: maxGlobalStreak };
    }, [habits]);

    const achievements = useAchievements(habits, journalEntries, stats);

    return (
        <AchievementsView achievements={achievements} />
    );
};