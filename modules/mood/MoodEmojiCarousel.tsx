import React from 'react';
import { motion } from 'framer-motion';
import { MoodOption } from './types';
import { GEOMETRY, polarToCartesian } from './helpers';

interface MoodEmojiCarouselProps {
  moods: MoodOption[];
  currentAngle: number;
}

export const MoodEmojiCarousel: React.FC<MoodEmojiCarouselProps> = ({ moods, currentAngle }) => {
  const range = GEOMETRY.endAngle - GEOMETRY.startAngle;
  const currentProgress = (currentAngle - GEOMETRY.startAngle) / range;
  const continuousIndex = currentProgress * (moods.length - 1);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {moods.map((mood, idx) => {
        const dist = idx - continuousIndex;
        const finalAngle = 270 + dist * 18;

        const absDist = Math.abs(dist);

        // Scale effect - center is big
        const scale = Math.max(0.6, 1.6 - absDist * 0.4);

        // Opacity - keep neighbors visible
        let opacity = Math.max(0.25, 1 - absDist * 0.25);

        // Only hide if really far
        if (Math.abs(dist) > 4.5) opacity = 0;

        const pos = polarToCartesian(
          GEOMETRY.centerX,
          GEOMETRY.centerY,
          GEOMETRY.emojiRadius,
          finalAngle
        );

        // Convert to % for scaling alignment
        const left = (pos.x / GEOMETRY.viewboxWidth) * 100 + '%';
        const top = (pos.y / GEOMETRY.viewboxHeight) * 100 + '%';

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
  );
};
