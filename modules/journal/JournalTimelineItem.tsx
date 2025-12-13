import React from 'react';
import { Card } from '../../core';
import { Smile, Meh, Frown, Calendar, Sparkles } from 'lucide-react';
import { cn, formatDate } from '../../utils';
import { JournalEntry, Habit } from '../../types';
import { clsx } from 'clsx';

interface JournalTimelineItemProps {
  entry: JournalEntry;
  habit?: Habit;
  index: number;
}

const JournalTimelineItem: React.FC<JournalTimelineItemProps> = ({ entry, habit, index }) => {
  return (
    <div
      className="relative pl-8 md:pl-10 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms`, opacity: 0 }} // opacity 0 initially handled by keyframes
    >
      {/* Timeline Dot */}
      <div
        className={cn(
          clsx(
            'absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white shadow-sm z-10',
            'dark:border-slate-950',
            index === 0
              ? 'bg-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-900/30'
              : 'bg-slate-300 dark:bg-slate-700'
          )
        )}
      ></div>

      <div className="mb-2 flex flex-col sm:flex-row sm:items-center gap-2">
        <span
          className={clsx(
            'text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 bg-slate-100 px-2 py-1 rounded w-fit',
            'dark:text-slate-400 dark:bg-slate-800'
          )}
        >
          <Calendar className="h-3 w-3 text-slate-400" />
          {formatDate(entry.date, 'MMM D, YYYY • h:mm A')}
        </span>
      </div>

      <Card className="hover:shadow-lg transition-shadow duration-300 ease-ios">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            {habit && (
              <span
                className={clsx(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 mb-2 border border-indigo-100',
                  'dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50'
                )}
              >
                {habit.name}
              </span>
            )}
            <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed text-base">
              {entry.content}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
            {entry.mood === 'happy' && (
              <span title="Happy">
                <Smile className="h-6 w-6 text-green-500" />
              </span>
            )}
            {entry.mood === 'motivated' && (
              <span title="Motivated">
                <Sparkles className="h-6 w-6 text-orange-500" />
              </span>
            )}
            {entry.mood === 'neutral' && (
              <span title="Neutral">
                <Meh className="h-6 w-6 text-yellow-500" />
              </span>
            )}
            {entry.mood === 'sad' && (
              <span title="Sad/Tired">
                <Frown className="h-6 w-6 text-slate-400" />
              </span>
            )}
          </div>
        </div>

        {entry.imageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm group cursor-pointer">
            <img
              src={entry.imageUrl}
              alt="Journal attachment"
              className="w-full h-auto max-h-96 object-cover transition-transform duration-500 ease-ios group-hover:scale-105"
            />
          </div>
        )}

        {entry.aiAnalysis && (
          <div
            className={clsx(
              'relative bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 flex gap-4 mt-4',
              'dark:from-indigo-950/30 dark:to-purple-950/30 dark:border-indigo-800/50'
            )}
          >
            <div className="flex-shrink-0 bg-white dark:bg-slate-800 p-1.5 rounded-full h-fit shadow-sm">
              <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1 uppercase tracking-wide">
                Coach Insight
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic font-medium">
                "{entry.aiAnalysis}"
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default JournalTimelineItem;
