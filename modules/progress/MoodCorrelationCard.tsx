import orderBy from 'lodash/orderBy';
import React from 'react';
import { Card, Show } from '../../core';
import {
  Smile,
  Meh,
  Frown,
  Sun,
  Moon,
  Zap,
  TrendingUp,
  BookOpen,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../utils';
import { MoodCorrelationData } from './types';
import { EmptyMoodState } from './EmptyMoodState';

const MoodCorrelationCard: React.FC<{ data: MoodCorrelationData[] }> = ({ data }) => {
  // Sort by completion rate descending
  const sortedData = orderBy(data, ['completionRate'], ['desc']);
  const bestMood = sortedData[0];

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy':
        return <Smile className="w-5 h-5 text-green-500" />;
      case 'motivated':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'neutral':
        return <Meh className="w-5 h-5 text-blue-500" />;
      case 'sad':
        return <Frown className="w-5 h-5 text-slate-400" />;
      case 'tired':
        return <Moon className="w-5 h-5 text-purple-500" />;
      default:
        return <Smile className="w-5 h-5 text-slate-400" />;
    }
  };

  const getMoodLabel = (mood: string) => {
    return mood.charAt(0).toUpperCase() + mood.slice(1);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            Mood & Performance
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            How your mood affects your habits
          </p>
        </div>

        {bestMood && bestMood.completionRate > 0 && (
          <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
            <div className="p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-sm">
              <span className="block text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase">
                Power Mood
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                You're most productive when{' '}
                <span className="text-indigo-600 dark:text-indigo-400">
                  {getMoodLabel(bestMood.mood)}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      <Show
        when={data.length === 0}
        fallback={
          <div className="space-y-4">
            {data.map(item => (
              <div key={item.mood} className="group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 md:group-hover:scale-110 transition-transform">
                    {getMoodIcon(item.mood)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                        {getMoodLabel(item.mood)}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {item.completionRate}% completion
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-1000',
                          item.completionRate >= 80
                            ? 'bg-green-500'
                            : item.completionRate >= 50
                              ? 'bg-indigo-500'
                              : 'bg-orange-400'
                        )}
                        style={{ width: `${item.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      >
        <EmptyMoodState />
      </Show>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 italic">
        <AlertCircle className="w-3 h-3" />
        Based on journal entries and daily habit completion.
      </div>
    </Card>
  );
};

export default MoodCorrelationCard;
