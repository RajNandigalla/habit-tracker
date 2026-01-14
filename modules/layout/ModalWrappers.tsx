import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { HabitDetailsModal } from '../habits';
import { ChallengeDetailsModal } from '../challenges/ChallengeDetailsModal';
import { FocusTimer } from '../FocusTimer';
import AIReportModal from '../progress/AIReportModal';
import { CHALLENGES } from '../../data/challenges';
// Fix: Import specific types instead of using any
import { Habit, Challenge } from '../../types';
import { useTimeout } from 'usehooks-ts';

// Helper for modal closing
export const useModalNavigation = () => {
  const navigate = useNavigate();
  return {
    closeModal: () => navigate(-1),
  };
};

export const HabitDetailsModalWrapper = ({
  onClose,
  habits,
  onUpdate,
  onDelete,
}: {
  onClose: () => void;
  habits: Habit[];
  onUpdate: (habit: Habit) => void;
  onDelete: (id: string) => void;
}) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as { mode?: 'view' | 'edit' | 'delete' } | undefined;
  const habit = habits.find(h => h.id === id);

  if (!habit) return null;

  return (
    <HabitDetailsModal
      habit={habit}
      isOpen={true}
      onClose={onClose}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onFocus={() => {}} // Focus is handled by separate route now
      initialMode={state?.mode || 'view'}
    />
  );
};

export const FocusTimerWrapper = ({
  onClose,
  habits,
  onToggleCompletion,
}: {
  onClose: () => void;
  habits: Habit[];
  onToggleCompletion: (id: string, date: string) => void;
}) => {
  const { id } = useParams<{ id: string }>();
  const today = new Date().toISOString().split('T')[0];
  const habit = habits.find(h => h.id === id);

  const handleComplete = (habitId: string) => {
    onToggleCompletion(habitId, today);
    onClose();
  };

  return (
    <FocusTimer isOpen={true} onClose={onClose} habit={habit || null} onComplete={handleComplete} />
  );
};

export const ChallengeDetailsWrapper = ({
  onClose,
  habits,
  onJoinChallenge,
}: {
  onClose: () => void;
  habits: Habit[];
  onJoinChallenge: (challenge: Challenge, habitId?: string) => void;
}) => {
  const { id } = useParams<{ id: string }>();
  const challenge = CHALLENGES.find(c => c.id === id);

  if (!challenge) return null;

  return (
    <ChallengeDetailsModal
      isOpen={true}
      onClose={onClose}
      challenge={challenge}
      habits={habits}
      onJoinChallenge={onJoinChallenge}
    />
  );
};

export const AIReportModalWrapper = ({ onClose }: { onClose: () => void }) => {
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
  };

  // Placeholder: Simulate AI report generation (TODO: Replace with actual API call)
  useTimeout(
    () => {
      if (isGeneratingReport) {
        setAiReport('AI report will be generated here...');
        setIsGeneratingReport(false);
      }
    },
    isGeneratingReport ? 2000 : null
  );

  return (
    <AIReportModal
      isOpen={true}
      onClose={onClose}
      report={aiReport}
      isLoading={isGeneratingReport}
      onGenerate={handleGenerateReport}
    />
  );
};
