import { Habit, Category } from '../../types';
import { Button } from '../../core';
import { Edit3, Trash2, Bell, Timer, Crown } from 'lucide-react';

interface HabitViewHeaderProps {
  habit: Habit;
  habitCategories: Category[];
  onEdit: () => void;
  onDelete: () => void;
  onFocus?: () => void;
  formatTimeDisplay: (time: string) => string;
}

export const HabitViewHeader: React.FC<HabitViewHeaderProps> = ({
  habit,
  habitCategories,
  onEdit,
  onDelete,
  onFocus,
  formatTimeDisplay,
}) => {
  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{habit.name}</h2>
            {habit.habitType === 'negative' && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded-full uppercase tracking-wide">
                To-Don't
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {habitCategories.length > 0 ? (
              habitCategories.map(cat => (
                <span
                  key={cat!.id}
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                >
                  <span>{cat!.icon}</span> {cat!.label}
                </span>
              ))
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Uncategorized
              </span>
            )}

            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 capitalize">
              {habit.frequency.replace('_', ' ')}
            </span>
            {habit.reminderTime && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 flex items-center gap-1">
                <Bell className="w-3 h-3" />
                {formatTimeDisplay(habit.reminderTime)}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {onFocus && habit.habitType === 'positive' && (
            <Button variant="ghost" size="icon-sm" onClick={onFocus} title="Start Focus Timer">
              <Timer className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </Button>
          )}
          <Button variant="ghost" size="icon-sm" onClick={onEdit} title="Edit Habit">
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button variant="danger-ghost" size="icon-sm" onClick={onDelete} title="Delete Habit">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {habit.description && (
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{habit.description}</p>
      )}

      {/* Challenge Info */}
      {habit.challengeId && habit.challengeDuration && (
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg text-base font-semibold border border-yellow-200 dark:border-yellow-800/50">
          <Crown className="h-4 w-4" />
          Day {Math.min(habit.streak, habit.challengeDuration)} of {habit.challengeDuration}{' '}
          Challenge
        </div>
      )}
    </div>
  );
};

export default HabitViewHeader;
