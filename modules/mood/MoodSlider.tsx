import React, { useRef, useMemo } from 'react';
import { SliderTick } from './types';
import {
  GEOMETRY,
  polarToCartesian,
  createArcPath,
  generateTicks,
  clampAngle,
  calculateIndexFromAngle,
} from './helpers';

interface MoodSliderProps {
  currentAngle: number;
  selectedMoodIndex: number;
  totalMoods: number;
  isDragging: boolean;
  onAngleChange: (angle: number) => void;
  onIndexChange: (index: number) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export const MoodSlider: React.FC<MoodSliderProps> = ({
  currentAngle,
  selectedMoodIndex,
  totalMoods,
  isDragging,
  onAngleChange,
  onIndexChange,
  onDragStart,
  onDragEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const ticks = useMemo(() => generateTicks(currentAngle), [currentAngle]);

  const handlePointerDown = (e: React.PointerEvent) => {
    onDragStart();
    (e.target as Element).setPointerCapture(e.pointerId);
    updateFromPointer(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateFromPointer(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    onDragEnd();
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const updateFromPointer = (e: React.PointerEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = GEOMETRY.viewboxWidth / rect.width;
    const scaleY = GEOMETRY.viewboxHeight / rect.height;

    const relX = (e.clientX - rect.left) * scaleX;
    const relY = (e.clientY - rect.top) * scaleY;

    const dx = relX - GEOMETRY.centerX;
    const dy = relY - GEOMETRY.centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    if (angle < 0) angle += 360;

    const clamped = clampAngle(angle);
    onAngleChange(clamped);

    const newIndex = calculateIndexFromAngle(clamped, totalMoods);
    if (newIndex !== selectedMoodIndex) {
      onIndexChange(newIndex);
    }
  };

  return (
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
        viewBox={`0 0 ${GEOMETRY.viewboxWidth} ${GEOMETRY.viewboxHeight}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Track Ticks */}
        {ticks.map((tick, i) => {
          const p1 = polarToCartesian(
            GEOMETRY.centerX,
            GEOMETRY.centerY,
            GEOMETRY.arcRadius - 12,
            tick.angle
          );
          const p2 = polarToCartesian(
            GEOMETRY.centerX,
            GEOMETRY.centerY,
            GEOMETRY.arcRadius + 12,
            tick.angle
          );
          return (
            <line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={tick.isActive ? 'transparent' : '#cbd5e1'}
              strokeWidth={2}
              strokeLinecap="round"
            />
          );
        })}

        {/* Active Track Fill */}
        <path
          d={createArcPath(
            GEOMETRY.startAngle,
            currentAngle,
            GEOMETRY.arcRadius,
            GEOMETRY.centerX,
            GEOMETRY.centerY
          )}
          fill="none"
          stroke="url(#trackGradient)"
          strokeWidth="20"
          strokeLinecap="round"
          className="drop-shadow-sm"
        />
      </svg>

      {/* Knob */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${GEOMETRY.viewboxWidth} ${GEOMETRY.viewboxHeight}`}
        >
          <g className="drop-shadow-lg">
            <circle
              cx={
                polarToCartesian(
                  GEOMETRY.centerX,
                  GEOMETRY.centerY,
                  GEOMETRY.arcRadius,
                  currentAngle
                ).x
              }
              cy={
                polarToCartesian(
                  GEOMETRY.centerX,
                  GEOMETRY.centerY,
                  GEOMETRY.arcRadius,
                  currentAngle
                ).y
              }
              r="14"
              fill="white"
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <circle
              cx={
                polarToCartesian(
                  GEOMETRY.centerX,
                  GEOMETRY.centerY,
                  GEOMETRY.arcRadius,
                  currentAngle
                ).x
              }
              cy={
                polarToCartesian(
                  GEOMETRY.centerX,
                  GEOMETRY.centerY,
                  GEOMETRY.arcRadius,
                  currentAngle
                ).y
              }
              r="4"
              fill="#0f766e"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};
