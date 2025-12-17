import React from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../../core';
import { cn } from '../../utils';
import { MOOD_OPTIONS } from '../mood/constants';

interface MoodSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMood?: string;
  onLogMood: (mood: string) => void;
}

export const MoodSelectionModal: React.FC<MoodSelectionModalProps> = ({
  isOpen,
  onClose,
  currentMood,
  onLogMood,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How are you feeling?">
      <div className="grid grid-cols-3 gap-3 py-2">
        {MOOD_OPTIONS.map((mood, index) => {
          const isSelected = currentMood === mood.id;
          return (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onLogMood(mood.id);
                onClose();
              }}
              className={cn(
                'flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200',
                isSelected
                  ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-400 dark:ring-indigo-800/50'
                  : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              )}
            >
              <motion.div
                className="text-4xl mb-2"
                animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {mood.emoji}
              </motion.div>
              <span
                className={cn(
                  'text-sm font-semibold',
                  isSelected
                    ? 'text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400'
                )}
              >
                {mood.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </Modal>
  );
};

export default MoodSelectionModal;
