import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../core/Modal';
import { MOOD_OPTIONS } from './constants';
import { MoodSlider } from './MoodSlider';
import { MoodEmojiCarousel } from './MoodEmojiCarousel';
import { getAngleForIndex } from './helpers';
import { dayjs, generateId } from '../../utils';
import { useStore } from '../../context/Store';

export const MoodCheckIn: React.FC = () => {
  const navigate = useNavigate();
  const { addJournalEntry } = useStore();

  const [selectedMoodIndex, setSelectedMoodIndex] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(
    getAngleForIndex(selectedMoodIndex, MOOD_OPTIONS.length)
  );

  const currentMood = MOOD_OPTIONS[selectedMoodIndex];

  useEffect(() => {
    if (!isDragging) {
      setCurrentAngle(getAngleForIndex(selectedMoodIndex, MOOD_OPTIONS.length));
    }
  }, [selectedMoodIndex, isDragging]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setCurrentAngle(getAngleForIndex(selectedMoodIndex, MOOD_OPTIONS.length));
  };

  const handleAngleChange = (angle: number) => {
    setCurrentAngle(angle);
  };

  const handleIndexChange = (index: number) => {
    setSelectedMoodIndex(index);
  };

  const handleSubmit = () => {
    const entry = {
      id: generateId(),
      date: dayjs().toISOString(),
      content: `Mood check-in: ${currentMood.label}`,
      mood: currentMood.id as any,
      aiAnalysis: '',
    };
    addJournalEntry(entry);
    navigate('/');
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title="How are you feeling?"
      bottomSheet={true}
      size="lg"
      className="h-[70vh]"
    >
      {/* Main Content */}
      <div className="flex flex-col items-center relative z-10 w-full mx-auto overflow-hidden h-full -mt-6">
        {/* Subtitle */}
        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-[280px] mx-auto mb-4 text-center">
          Select the mood that best represents your state.
        </p>

        {/* Active Mood Label */}
        <div className="flex-1 w-full relative flex items-center justify-center pointer-events-none">
          <div className="absolute top-[35%] left-0 right-0 flex justify-center z-10">
            <motion.div
              key={currentMood.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-xl text-slate-900 dark:text-slate-200 font-bold text-sm"
            >
              {currentMood.label}
            </motion.div>
          </div>
        </div>

        {/* Slider Container */}
        <div className="w-full h-[320px] relative shrink-0">
          <MoodSlider
            currentAngle={currentAngle}
            selectedMoodIndex={selectedMoodIndex}
            totalMoods={MOOD_OPTIONS.length}
            isDragging={isDragging}
            onAngleChange={handleAngleChange}
            onIndexChange={handleIndexChange}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />

          <MoodEmojiCarousel moods={MOOD_OPTIONS} currentAngle={currentAngle} />

          {/* Submit Button */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto">
            <button
              onClick={handleSubmit}
              className="w-16 h-16 bg-slate-900 dark:bg-slate-700 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-1 rounded-full border border-slate-700/50" />
              <ChevronRight size={28} className="translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
