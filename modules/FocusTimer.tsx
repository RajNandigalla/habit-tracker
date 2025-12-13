import React, { useState, useEffect } from 'react';
import { Habit } from '../types';
import { Modal, Slider, Show } from '../core';
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { cn } from '../utils';

interface FocusTimerProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (habitId: string) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ habit, isOpen, onClose, onComplete }) => {
  const [duration, setDuration] = useState(25 * 60); // Default 25 mins in seconds
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const presets = [
    { label: '5m', val: 5 * 60 },
    { label: '15m', val: 15 * 60 },
    { label: '25m', val: 25 * 60 },
    { label: '45m', val: 45 * 60 },
    { label: '60m', val: 60 * 60 },
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      if (habit) onComplete(habit.id);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, habit, onComplete]);

  // Reset when modal opens with a new habit
  useEffect(() => {
    if (isOpen) {
      setIsActive(false);
      setIsFinished(false);
      setTimeLeft(duration);
    }
  }, [isOpen, duration]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(duration);
  };

  const handlePresetChange = (val: number) => {
    setDuration(val);
    setTimeLeft(val);
    setIsActive(false);
    setIsFinished(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    return ((duration - timeLeft) / duration) * 100;
  };

  // Circular Progress Props
  const radius = 80;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (calculateProgress() / 100) * circumference;

  if (!habit) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Focus: ${habit.name}`} center>
      <div className="flex flex-col items-center justify-center py-4">
        <Show
          when={!isFinished}
          fallback={
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Great Work!</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                You completed your focus session!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Done
              </button>
            </div>
          }
        >
          {/* Timer Display */}
          <div className="relative mb-8">
            <svg
              height={radius * 2}
              width={radius * 2}
              className="rotate-[-90deg] transition-all duration-1000 ease-linear"
            >
              <circle
                stroke="currentColor"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset: 0 }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="text-slate-100 dark:text-slate-800"
              />
              <circle
                stroke="currentColor"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className={cn(
                  'transition-all duration-1000 ease-linear',
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-500'
                    : 'text-slate-400 dark:text-slate-600'
                )}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-mono font-bold text-slate-900 dark:text-white">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={resetTimer}
              className="p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>

            <button
              onClick={toggleTimer}
              className={cn(
                'p-4 rounded-full text-white shadow-lg transform transition-all active:scale-95',
                isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
              )}
            >
              <Show when={isActive} fallback={<Play className="w-8 h-8 fill-current pl-1" />}>
                <Pause className="w-8 h-8 fill-current" />
              </Show>
            </button>
          </div>

          {/* Custom Slider */}
          <div className="w-full max-w-[280px] mb-6">
            <Slider
              value={Math.floor(duration / 60)}
              min={1}
              max={120}
              step={1}
              onChange={val => {
                const newDuration = val * 60;
                setDuration(newDuration);
                setTimeLeft(newDuration);
                setIsActive(false);
                setIsFinished(false);
              }}
              formatValue={v => `${v} min`}
              disabled={isActive}
              showValue={true}
            />
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 text-center max-w-xs mb-6">
            Pro Tip: Stay focused for the full duration to build true discipline
          </p>

          {/* Presets */}
          <div className="flex flex-wrap justify-center gap-2 w-full">
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => handlePresetChange(p.val)}
                disabled={isActive}
                className={cn(
                  'px-3 py-1 text-sm font-medium rounded-full transition-colors border',
                  duration === p.val
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300'
                    : 'bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800',
                  isActive && 'opacity-50 cursor-not-allowed'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </Show>
      </div>
    </Modal>
  );
};
