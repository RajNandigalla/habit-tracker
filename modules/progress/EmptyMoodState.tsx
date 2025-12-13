import React from 'react';
import { BookOpen } from 'lucide-react';

export const EmptyMoodState: React.FC = () => {
  return (
    <div className="text-center py-8 text-slate-400 flex flex-col items-center">
      <BookOpen className="h-8 w-8 mb-2 opacity-50" />
      <p>Log your mood in the journal to see insights here.</p>
    </div>
  );
};
