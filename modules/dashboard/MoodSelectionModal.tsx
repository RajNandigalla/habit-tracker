import React from 'react';
import { Modal } from '../../core';
import { cn } from '../../utils';
import { Smile, Meh, Frown, Zap, Moon } from 'lucide-react';

interface MoodSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMood?: string;
  onLogMood: (mood: 'happy' | 'motivated' | 'neutral' | 'sad' | 'tired') => void;
}

export const MoodSelectionModal: React.FC<MoodSelectionModalProps> = ({
  isOpen,
  onClose,
  currentMood,
  onLogMood,
}) => {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How are you feeling?" center>
      <div className="grid grid-cols-3 gap-3 py-2">
        {moodOptions.map(m => {
          const isSelected = currentMood === m.value;
          return (
            <button
              key={m.value}
              onClick={() => {
                onLogMood(m.value as any);
                onClose();
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
  );
};

export default MoodSelectionModal;
