import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
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

  // --- Geometry Constants ---
  const VIEWBOX_WIDTH = 400;
  const VIEWBOX_HEIGHT = 400;
  const ARC_RADIUS = 350;
  const CENTER_X = 200;
  const CENTER_Y = 420;

  const ARC_SPAN = 80;
  const START_ANGLE = 270 - ARC_SPAN / 2; // 230
  const END_ANGLE = 270 + ARC_SPAN / 2; // 310

  // Adjusted EMOJI_RADIUS to bring them closer to the slider
  // ARC_RADIUS is 350. Slider is at 350.
  // We want emojis "just above". Maybe 350 - 60 = 290?
  // Wait, Y goes down. Center is 420.
  // Radius 350 -> Y = 420 - 350 = 70.
  // If we want emojis above, we need SMALLER radius? No, wait.
  // Center (200, 420).
  // Arc is ABOVE center.
  // Radius 350 -> Y = 70.
  // We want Emojis at Y ~ 20?
  // 420 - 400 = 20. So Radius 400.
  const EMOJI_RADIUS = ARC_RADIUS + 70; // 420

  // --- Helpers ---
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
    const rad = toRad(angleDeg);
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const currentMood = MOOD_OPTIONS[selectedMoodIndex];

  const getAngleForIndex = (index: number) => {
    const pct = index / (MOOD_OPTIONS.length - 1);
    return START_ANGLE + pct * (END_ANGLE - START_ANGLE);
  };

  const [currentAngle, setCurrentAngle] = useState(getAngleForIndex(selectedMoodIndex));

  // Sync angle when index changes programmatically
  useEffect(() => {
    if (!isDragging) {
      setCurrentAngle(getAngleForIndex(selectedMoodIndex));
    }
  }, [selectedMoodIndex, isDragging]);

  // --- Interaction ---
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
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = VIEWBOX_WIDTH / rect.width;
    const scaleY = VIEWBOX_HEIGHT / rect.height;

    const relX = (e.clientX - rect.left) * scaleX;
    const relY = (e.clientY - rect.top) * scaleY;

    const dx = relX - CENTER_X;
    const dy = relY - CENTER_Y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    if (angle < 0) angle += 360;

    const clamped = Math.max(START_ANGLE, Math.min(END_ANGLE, angle));
    setCurrentAngle(clamped);

    const pct = (clamped - START_ANGLE) / (END_ANGLE - START_ANGLE);
    const newIndex = Math.round(pct * (MOOD_OPTIONS.length - 1));
    if (newIndex !== selectedMoodIndex) {
      setSelectedMoodIndex(newIndex);
    }
  };

  const snapToNearest = () => {
    setCurrentAngle(getAngleForIndex(selectedMoodIndex));
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

  // --- SVG Paths ---
  const createArcPath = (start: number, end: number, radius: number) => {
    const startPt = polarToCartesian(CENTER_X, CENTER_Y, radius, start);
    const endPt = polarToCartesian(CENTER_X, CENTER_Y, radius, end);
    const largeArcFlag = end - start <= 180 ? '0' : '1';

    return [
      'M',
      startPt.x,
      startPt.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      1,
      endPt.x,
      endPt.y,
    ].join(' ');
  };

  const ticks = useMemo(() => {
    const count = 41;
    return Array.from({ length: count }).map((_, i) => {
      const t = i / (count - 1);
      const angle = START_ANGLE + t * (END_ANGLE - START_ANGLE);
      const isMajor = i % 10 === 0;
      // Active if angle is less than currentAngle (assuming Left-to-Right / Clockwise fill?)
      // Wait, 230 to 310.
      // 230 is Left-ish of Top. 310 is Right-ish of Top.
      // So increasing angle = moving right.
      const isActive = angle <= currentAngle;

      return { angle, isMajor, isActive };
    });
  }, [START_ANGLE, END_ANGLE, currentAngle]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
        onClick={() => navigate(-1)}
      />

      {/* Bottom Sheet Panel */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full h-[70vh] bg-white dark:bg-slate-900 rounded-t-[32px] overflow-hidden flex flex-col pointer-events-auto shadow-2xl"
      >
        {/* Header - Just the close handle or similar */}
        <div className="w-full flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center relative z-10 w-full max-w-lg mx-auto overflow-hidden">
          {/* Title - Adjust padding since we are in bottom sheet now */}
          <div className="text-center px-8 mb-2 shrink-0">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
              How are you feeling?
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-[280px] mx-auto">
              Select the mood that best represents your state.
            </p>
          </div>

          {/* Emojis Carousel Space - Active Label Only */}
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

          {/* Footer Area with Slider */}
          <div className="w-full h-[320px] relative shrink-0">
            {/* Slider Container */}
            <div
              className="absolute inset-0"
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{ touchAction: 'none' }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                className="overflow-visible"
              >
                <defs>
                  <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2dd4bf" /> {/* Teal-400 */}
                    <stop offset="100%" stopColor="#0f766e" /> {/* Teal-700 */}
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* 1. Track Ticks (Inactive) */}
                {ticks.map((tick, i) => {
                  const p1 = polarToCartesian(CENTER_X, CENTER_Y, ARC_RADIUS - 12, tick.angle);
                  const p2 = polarToCartesian(CENTER_X, CENTER_Y, ARC_RADIUS + 12, tick.angle);
                  const isTickActive = tick.isActive;
                  return (
                    <line
                      key={i}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={isTickActive ? 'transparent' : '#cbd5e1'} // Hide active ticks
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  );
                })}

                {/* 2. Active Track Fill (Solid Bar) */}
                <path
                  d={createArcPath(START_ANGLE, currentAngle, ARC_RADIUS)}
                  fill="none"
                  stroke="url(#trackGradient)"
                  strokeWidth="20"
                  strokeLinecap="round"
                  className="drop-shadow-sm"
                />
              </svg>

              {/* Emojis Overlay - Positioned relative to SVG ViewBox using % */}
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {MOOD_OPTIONS.map((mood, idx) => {
                  const range = END_ANGLE - START_ANGLE;
                  const currentProgress = (currentAngle - START_ANGLE) / range;
                  const continuousIndex = currentProgress * (MOOD_OPTIONS.length - 1);

                  const dist = idx - continuousIndex;
                  // Even tighter spacing to show more
                  const finalAngle = 270 + dist * 18; // Reduced to 18 degrees

                  const absDist = Math.abs(dist);

                  // Scale effect - Center is big
                  const scale = Math.max(0.6, 1.6 - absDist * 0.4); // Slower scaling falloff

                  // Opacity - Keep neighbors visible
                  // Center=1, +-1=0.8, +-2=0.6, +-3=0.4
                  let opacity = Math.max(0.25, 1 - absDist * 0.25);

                  // Only hide if really far
                  if (Math.abs(dist) > 4.5) opacity = 0;

                  const pos = polarToCartesian(CENTER_X, CENTER_Y, EMOJI_RADIUS, finalAngle);

                  // Convert to % for scaling alignment
                  const left = (pos.x / VIEWBOX_WIDTH) * 100 + '%';
                  const top = (pos.y / VIEWBOX_HEIGHT) * 100 + '%';

                  return (
                    <motion.div
                      key={mood.id}
                      className="absolute w-16 h-16 -ml-8 -mt-8 flex items-center justify-center text-[56px] origin-center"
                      style={{ left, top }}
                      animate={{
                        left,
                        top,
                        scale,
                        opacity,
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    >
                      {mood.emoji}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Knob */}
            <div className="absolute inset-0 pointer-events-none">
              <svg width="100%" height="100%" viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}>
                <g className="drop-shadow-lg">
                  <circle
                    cx={polarToCartesian(CENTER_X, CENTER_Y, ARC_RADIUS, currentAngle).x}
                    cy={polarToCartesian(CENTER_X, CENTER_Y, ARC_RADIUS, currentAngle).y}
                    r="14"
                    fill="white"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                  <circle
                    cx={polarToCartesian(CENTER_X, CENTER_Y, ARC_RADIUS, currentAngle).x}
                    cy={polarToCartesian(CENTER_X, CENTER_Y, ARC_RADIUS, currentAngle).y}
                    r="4"
                    fill="#0f766e"
                  />
                </g>
              </svg>
            </div>

            {/* Center Bottom Action Button */}
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
      </motion.div>
    </div>
  );
};
