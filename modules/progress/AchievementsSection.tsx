import React from 'react';
import { Card, Show } from '../../core';
import { Medal, Lock, Trophy, Crown, Check } from 'lucide-react';
import { cn } from '../../utils';
import { Achievement } from '../../types';

const AchievementsSection: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {achievements.map((ach, index) => (
          <div
            key={ach.id}
            className="animate-slide-up h-full"
            style={{ animationDelay: `${index * 30}ms`, opacity: 0 }}
          >
            <Card
              className={cn(
                'relative h-full overflow-hidden group p-4 border transition-all duration-300 ease-ios',
                ach.isUnlocked
                  ? 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-slate-700 md:hover:shadow-lg md:hover:-translate-y-1'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-80'
              )}
            >
              <Show
                when={ach.isUnlocked}
                fallback={
                  <div className="absolute top-0 right-0 p-1 bg-slate-200 dark:bg-slate-700 text-slate-400 rounded-bl-lg">
                    <Lock className="h-3 w-3" />
                  </div>
                }
              >
                <div className="absolute top-0 right-0 p-1 bg-green-500 text-white rounded-bl-lg shadow-sm">
                  <Check className="h-3 w-3" />
                </div>
              </Show>

              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform duration-300 md:group-hover:scale-110',
                    ach.isUnlocked
                      ? ach.color
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 grayscale'
                  )}
                >
                  <ach.icon className="h-6 w-6" />
                </div>
                <h4
                  className={cn(
                    'font-bold text-sm mb-1',
                    ach.isUnlocked
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-500'
                  )}
                >
                  {ach.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  {ach.description}
                </p>

                {!ach.isUnlocked && (
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-3 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-1000"
                      style={{ width: `${Math.min(ach.progress, 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsSection;
