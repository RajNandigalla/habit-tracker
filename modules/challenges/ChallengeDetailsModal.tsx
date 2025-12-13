import React, { useState } from 'react';
import { Challenge, Habit } from '../../types';
import { Button, Modal, Select } from '../../core';
import { Plus, Layers } from 'lucide-react';
import { cn } from '../../utils';

interface ChallengeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: Challenge | null;
  habits: Habit[];
  onJoinChallenge: (challenge: Challenge, existingHabitId?: string) => void;
}

export const ChallengeDetailsModal: React.FC<ChallengeDetailsModalProps> = ({
  isOpen,
  onClose,
  challenge,
  habits,
  onJoinChallenge,
}) => {
  const [linkMode, setLinkMode] = useState<'new' | 'existing'>('new');
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');

  const getActiveHabitForChallenge = (challengeId: string) => {
    return habits.find(h => h.challengeId === challengeId);
  };

  const handleJoin = () => {
    if (challenge) {
      if (linkMode === 'existing' && selectedHabitId) {
        onJoinChallenge(challenge, selectedHabitId);
      } else {
        onJoinChallenge(challenge);
      }
      handleClose();
    }
  };

  const handleClose = () => {
    setLinkMode('new');
    setSelectedHabitId('');
    onClose();
  };

  if (!challenge) return null;

  const eligibleHabits = habits.filter(h => !h.challengeId);
  const habitOptions = [
    { value: '', label: 'Select a habit...' },
    ...eligibleHabits.map(h => ({ value: h.id, label: h.name })),
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={challenge.title}>
      <div className="space-y-6">
        <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 animate-fade-scale">
          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <challenge.icon className="h-8 w-8" style={{ color: challenge.color }} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              The Goal
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                {challenge.category}
              </span>
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
              {challenge.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg text-center">
            <div className="text-slate-400 text-xs font-bold uppercase mb-1">Duration</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {challenge.durationDays} Days
            </div>
          </div>
          <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg text-center">
            <div className="text-slate-400 text-xs font-bold uppercase mb-1">Difficulty</div>
            <div
              className={cn(
                'text-xl font-bold',
                challenge.difficulty === 'Easy' && 'text-green-500',
                challenge.difficulty === 'Medium' && 'text-yellow-500',
                challenge.difficulty === 'Hard' && 'text-red-500'
              )}
            >
              {challenge.difficulty}
            </div>
          </div>
        </div>

        {!getActiveHabitForChallenge(challenge.id) && (
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
                  {linkMode === 'new' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Habit
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Create "{challenge.habitTemplate.name}"
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
          <Button variant="ghost" onClick={handleClose}>
            Close
          </Button>
          {getActiveHabitForChallenge(challenge.id) ? (
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
    </Modal>
  );
};

export default ChallengeDetailsModal;
