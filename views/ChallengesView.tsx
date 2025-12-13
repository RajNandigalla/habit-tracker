import React, { useState } from 'react';
import { Challenge, Habit } from '../types';
import { CHALLENGES } from '../data/challenges';
import { PageTitle } from '../modules/PageTitle';
import { Button, Card, Modal, Select } from '../core';
import { Clock, Check, ArrowRight, Layers, Plus } from 'lucide-react';
import { cn } from '../utils';
import PageTransition from '../core/PageTransition';

interface ChallengesViewProps {
  habits: Habit[];
  onJoinChallenge: (challenge: Challenge, existingHabitId?: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ habits, onJoinChallenge }) => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [linkMode, setLinkMode] = useState<'new' | 'existing'>('new');
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');

  const getActiveHabitForChallenge = (challengeId: string) => {
    return habits.find(h => h.challengeId === challengeId);
  };

  const handleJoin = () => {
    if (selectedChallenge) {
      if (linkMode === 'existing' && selectedHabitId) {
        onJoinChallenge(selectedChallenge, selectedHabitId);
      } else {
        onJoinChallenge(selectedChallenge);
      }
      setSelectedChallenge(null);
      setLinkMode('new');
      setSelectedHabitId('');
    }
  };

  const eligibleHabits = habits.filter(h => !h.challengeId);

  const habitOptions = [
    { value: '', label: 'Select a habit...' },
    ...eligibleHabits.map(h => ({ value: h.id, label: h.name })),
  ];

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
                      {isJoined ? (
                        <div className="flex items-center gap-2 text-sm font-bold text-green-600 dark:text-green-400">
                          <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Check className="h-3 w-3" />
                          </div>
                          {isCompleted ? 'Completed!' : 'Active'}
                        </div>
                      ) : (
                        <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 md:group-hover:underline flex items-center gap-1">
                          View Details <ArrowRight className="h-3 w-3" />
                        </div>
                      )}
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

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedChallenge}
        onClose={() => {
          setSelectedChallenge(null);
          setLinkMode('new');
          setSelectedHabitId('');
        }}
        title={selectedChallenge?.title || ''}
      >
        {selectedChallenge && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 animate-fade-scale">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <selectedChallenge.icon
                  className="h-8 w-8"
                  style={{ color: selectedChallenge.color }}
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  The Goal
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                    {selectedChallenge.category}
                  </span>
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                  {selectedChallenge.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg text-center">
                <div className="text-slate-400 text-xs font-bold uppercase mb-1">Duration</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedChallenge.durationDays} Days
                </div>
              </div>
              <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg text-center">
                <div className="text-slate-400 text-xs font-bold uppercase mb-1">Difficulty</div>
                <div
                  className={cn(
                    'text-xl font-bold',
                    selectedChallenge.difficulty === 'Easy' && 'text-green-500',
                    selectedChallenge.difficulty === 'Medium' && 'text-yellow-500',
                    selectedChallenge.difficulty === 'Hard' && 'text-red-500'
                  )}
                >
                  {selectedChallenge.difficulty}
                </div>
              </div>
            </div>

            {!getActiveHabitForChallenge(selectedChallenge.id) && (
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                  How do you want to track this?
                </h4>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setLinkMode('new')}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-300 ease-ios',
                      linkMode === 'new'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400 scale-[1.02]'
                        : 'border-slate-200 dark:border-slate-700 md:hover:bg-slate-50 dark:md:hover:bg-slate-800'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                        linkMode === 'new' ? 'border-indigo-500' : 'border-slate-300'
                      )}
                    >
                      {linkMode === 'new' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create New Habit
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Create "{selectedChallenge.habitTemplate.name}"
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setLinkMode('existing')}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-300 ease-ios',
                      linkMode === 'existing'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400 scale-[1.02]'
                        : 'border-slate-200 dark:border-slate-700 md:hover:bg-slate-50 dark:md:hover:bg-slate-800'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                        linkMode === 'existing' ? 'border-indigo-500' : 'border-slate-300'
                      )}
                    >
                      {linkMode === 'existing' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        Link Existing Habit
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Apply challenge to one of your habits
                      </div>
                    </div>
                  </button>

                  {linkMode === 'existing' && (
                    <div className="pl-8 pt-1 animate-slide-up">
                      {eligibleHabits.length > 0 ? (
                        <Select
                          value={selectedHabitId}
                          onChange={val => setSelectedHabitId(val as string)}
                          options={habitOptions}
                          placeholder="Select a habit to link..."
                        />
                      ) : (
                        <p className="text-xs text-orange-500 italic">
                          No eligible habits found (already in challenges).
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setSelectedChallenge(null)}>
                Close
              </Button>
              {getActiveHabitForChallenge(selectedChallenge.id) ? (
                <Button disabled className="opacity-50 cursor-not-allowed">
                  Already Joined
                </Button>
              ) : (
                <Button
                  onClick={handleJoin}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                  disabled={linkMode === 'existing' && !selectedHabitId}
                >
                  Start Challenge
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </PageTransition>
  );
};
