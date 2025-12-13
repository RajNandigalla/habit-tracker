import React from 'react';
import { useStore } from '../context/Store';
import { ChallengesView } from '../components/views/ChallengesView';

export const Challenges: React.FC = () => {
    const { habits, joinChallenge, preferences, toggleDarkMode } = useStore();

    return (
        <ChallengesView 
            habits={habits}
            onJoinChallenge={joinChallenge}
            darkMode={preferences.darkMode}
            onToggleDarkMode={toggleDarkMode}
        />
    );
};