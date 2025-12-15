import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { MOOD_OPTIONS } from './constants';
import { useNavigate } from 'react-router-dom';
import { dayjs, generateId } from '../../utils';
import { useStore } from '../../context/Store';

export const MoodCheckIn: React.FC = () => {
  const navigate = useNavigate();
  const { addJournalEntry } = useStore();
  const [selectedMoodIndex, setSelectedMoodIndex] = useState(2); // Start at neutral
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Configuration for the arc
  // We'll use range [180, 0] mapped to [180, 360] for calculations
  const ARC_RADIUS = 160;
  const ARCH_START = 180;
  const ARCH_END = 360;

  // Convert degrees to radians
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Calculate polar coordinates
  // SVG: (0,0) is top-left.
  // Pivot point: (Center X, Bottom Y).
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = toRad(angleInDegrees);
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const currentMood = MOOD_OPTIONS[selectedMoodIndex];

  const getAngleForIndex = (index: number) => {
    const range = ARCH_END - ARCH_START;
    const step = range / (MOOD_OPTIONS.length - 1);
    return ARCH_START + index * step;
  };

  const [rotation, setRotation] = useState(getAngleForIndex(selectedMoodIndex));

  useEffect(() => {
    if (!isDragging) {
      setRotation(getAngleForIndex(selectedMoodIndex));
    }
  }, [selectedMoodIndex, isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as Element).setPointerCapture(e.pointerId);
    updateFromPointer(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateFromPointer(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
    snapToNearest();
  };

  const updateFromPointer = (e: React.PointerEvent) => {
    if (!containerRef.current) return;

    // We assume the arc spans the full width of the container
    // Pivot is visually at Bottom-Center of the container.
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height; // Bottom edge

    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;

    // Calculate angle
    let angle = Math.atan2(y, x) * (180 / Math.PI);

    // We want to map to 180 - 360 range for convenience
    if (angle < 0) angle += 360;

    // Clamp
    const clamped = Math.max(ARCH_START, Math.min(ARCH_END, angle));
    setRotation(clamped);

    // Index
    const range = ARCH_END - ARCH_START;
    const progress = (clamped - ARCH_START) / range;
    const newIndex = Math.round(progress * (MOOD_OPTIONS.length - 1));

    if (newIndex !== selectedMoodIndex) {
      setSelectedMoodIndex(newIndex);
    }
  };

  const snapToNearest = () => {
    setRotation(getAngleForIndex(selectedMoodIndex));
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

  // Ticks
  const ticks = Array.from({ length: 41 }).map((_, i) => {
    const t = i / 40;
    const angle = ARCH_START + t * (ARCH_END - ARCH_START);
    const isMajor = i % 10 === 0;
    // Highlight logic: fill from left
    const isActive = angle <= rotation;
    return { angle, isMajor, isActive };
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 overflow-hidden touch-none no-scrollbar">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 z-20 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm text-slate-700 dark:text-slate-300 active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-700 dark:text-slate-300 text-sm font-semibold transition-colors"
        >
          Skip
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center pt-8 relative z-10 w-full max-w-lg mx-auto">
        {/* Title */}
        <div className="text-center px-8 mb-8 shrink-0">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
            How are you
            <br />
            feeling today?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-[280px] mx-auto">
            Embark on a profound journey, exploring the intricate emotional landscape.
          </p>
        </div>

        {/* Emojis Layout */}
        <div className="flex-1 w-full relative flex flex-col justify-center items-center pb-20">
          <div className="flex items-center justify-center gap-4 sm:gap-8 h-40">
            {MOOD_OPTIONS.map((mood, idx) => {
              const isSelected = idx === selectedMoodIndex;
              const dist = Math.abs(idx - selectedMoodIndex);

              let scale = 1;
              let opacity = 1;

              if (isSelected) {
                scale = 2.5;
                opacity = 1;
              } else if (dist === 1) {
                scale = 1.2;
                opacity = 0.5;
              } else {
                scale = 0.8;
                opacity = 0.2;
              }

              return (
                <motion.div
                  key={mood.id}
                  className="text-[40px] transform transition-all duration-300 origin-center absolute"
                  initial={false}
                  animate={{
                    scale,
                    opacity,
                    x: (idx - selectedMoodIndex) * 90,
                    y: isSelected ? 0 : 40,
                  }}
                >
                  {mood.emoji}
                </motion.div>
              );
            })}
          </div>

          {/* Label */}
          <motion.div
            key={currentMood.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <span className="px-6 py-2 bg-white dark:bg-slate-800 rounded-full text-slate-900 dark:text-white font-bold shadow-sm text-lg border border-slate-100 dark:border-slate-700">
              {currentMood.label}
            </span>
          </motion.div>
        </div>

        {/* Bottom Arc Slider - Fixed at bottom */}
        {/* We want it to span the full width of the screen/container roughly */}
        <div className="absolute bottom-0 w-full h-[200px] pointer-events-none">
          <div
            className="w-full h-full relative"
            ref={containerRef}
            style={{ touchAction: 'none', pointerEvents: 'auto' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* SVG should fill width. ViewBox needs to be wide enough. */}
            {/* Visual arc radius is large. */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 200"
              preserveAspectRatio="xMidYMax"
              className="overflow-visible"
            >
              {/* Center X is 200. Pivot Y is 200 (bottom). */}
              {ticks.map((tick, i) => {
                const rInner = 160;
                const rOuter = 175;
                const p1 = polarToCartesian(200, 200, rInner, tick.angle);
                const p2 = polarToCartesian(200, 200, rOuter, tick.angle);

                return (
                  <line
                    key={i}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={tick.isActive ? '#94a3b8' : '#e2e8f0'}
                    strokeWidth={tick.isMajor ? 3 : 1.5}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {/* Draggable Handle */}
            <motion.div
              className="absolute w-8 h-8 bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-100 rounded-full shadow-lg z-20 flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-none"
              style={{
                left: '50%',
                top: '100%', // Pivot at bottom center
                marginLeft: -16,
                marginTop: -16,
              }}
              animate={{
                // We need to calculate X/Y offsets from pivot
                // angle is 180 to 360.
                // 167 radius
                x: Math.cos(toRad(rotation)) * 167,
                y: Math.sin(toRad(rotation)) * 167,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
              <div className="w-2 h-2 bg-slate-900 dark:bg-white rounded-full" />
            </motion.div>
          </div>
        </div>

        {/* Floating Action Button with Pulse */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <div className="relative">
            {/* Pulse ring */}
            <div className="absolute inset-0 bg-slate-900 dark:bg-indigo-600 rounded-full animate-ping opacity-20"></div>
            <button
              onClick={handleSubmit}
              className="relative w-16 h-16 bg-slate-900 dark:bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-slate-800 dark:hover:bg-indigo-500 active:scale-95 transition-all"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
