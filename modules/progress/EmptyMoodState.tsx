import React from 'react';
import { Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmptyMoodState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
        <Smile className="h-8 w-8 text-slate-500 dark:text-slate-400" />
      </div>
      <h4 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-2">
        No mood data yet
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-xs mx-auto">
        Log your mood in the journal to see how it affects your productivity
      </p>
      <button
        onClick={() => navigate('/mood')}
        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold transition-colors active:scale-95"
      >
        <Smile className="w-4 h-4" />
        Log Mood
      </button>
    </div>
  );
};
