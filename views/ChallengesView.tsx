import React, { useState } from 'react';
import { Challenge, Habit } from '../types';
import { CHALLENGES } from '../data/challenges';
import { PageTitle } from '../modules/PageTitle';
import { Button, Card, Show } from '../core';
import { Clock, Check, ArrowRight } from 'lucide-react';
import { cn } from '../utils';
import PageTransition from '../core/PageTransition';
import { ChallengeDetailsModal } from '../modules/challenges';

interface ChallengesViewProps {
  habits: Habit[];
  onJoinChallenge: (challenge: Challenge, existingHabitId?: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ habits, onJoinChallenge }) => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const getActiveHabitForChallenge = (challengeId: string) => {
    return habits.find(h => h.challengeId === challengeId);
  };

  return (
    <PageTransition className="bg-slate-50 dark:bg-slate-950">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 pb-24 md:pb-8">
          <PageTitle
            title="Challenges"
            description="Push your limits and build strong habits with community challenges."
            className="mb-8"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHALLENGES.map((challenge, index) => {
              const activeHabit = getActiveHabitForChallenge(challenge.id);
              const isJoined = !!activeHabit;
              const isCompleted = activeHabit && activeHabit.streak >= challenge.durationDays;

              return (
                <div
                  key={challenge.id}
                  className="h-full animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
                >
                  <Card
                    onClick={() => setSelectedChallenge(challenge)}
                    className="relative h-full overflow-hidden cursor-pointer group md:hover:shadow-xl md:hover:-translate-y-1 transition-all duration-300 ease-ios border-l-4"
                    style={{ borderLeftColor: challenge.color }}
                  >
                    {/* Difficulty Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide',
                          challenge.difficulty === 'Easy' &&
                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                          challenge.difficulty === 'Medium' &&
                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                          challenge.difficulty === 'Hard' &&
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        )}
                      >
                        {challenge.difficulty}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform md:group-hover:scale-110',
                          'bg-slate-50 dark:bg-slate-800'
                        )}
                      >
                        <challenge.icon className="h-6 w-6" style={{ color: challenge.color }} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 md:group-hover:text-indigo-600 dark:md:group-hover:text-indigo-400 transition-colors">
                        {challenge.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        <Clock className="h-3 w-3" />
                        {challenge.durationDays} Days
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-6">
                      {challenge.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <Show
                        when={isJoined}
                        fallback={
                          <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 md:group-hover:underline flex items-center gap-1">
                            View Details <ArrowRight className="h-3 w-3" />
                          </div>
                        }
                      >
                        <div className="flex items-center gap-2 text-sm font-bold text-green-600 dark:text-green-400">
                          <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Check className="h-3 w-3" />
                          </div>
                          {isCompleted ? 'Completed!' : 'Active'}
                        </div>
                      </Show>
                    </div>

                    {/* Progress Bar for Active Challenges */}
                    {isJoined && activeHabit && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full bg-green-500 transition-all duration-500"
                          style={{
                            width: `${Math.min((activeHabit.streak / challenge.durationDays) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <ChallengeDetailsModal
        isOpen={!!selectedChallenge}
        onClose={() => setSelectedChallenge(null)}
        challenge={selectedChallenge}
        habits={habits}
        onJoinChallenge={onJoinChallenge}
      />
    </PageTransition>
  );
};
