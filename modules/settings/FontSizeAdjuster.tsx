import React from 'react';
import { motion, Variant } from 'framer-motion';
import Slider from '../../core/Slider';
import Button from '../../core/Button';

type SlideVariants = {
  enter: Variant;
  center: Variant;
  exit: Variant;
};

interface FontSizeAdjusterProps {
  tempFontSize: number;
  currentFontSize: number;
  onTempChange: (size: number) => void;
  onApply: () => void;
  direction: number;
  slideVariants: SlideVariants;
  minFont: number;
  maxFont: number;
  step: number;
}

export const FontSizeAdjuster: React.FC<FontSizeAdjusterProps> = ({
  tempFontSize,
  currentFontSize,
  onTempChange,
  onApply,
  direction,
  slideVariants,
  minFont,
  maxFont,
  step,
}) => {
  return (
    <motion.div
      key="font"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
      className="flex flex-col bg-white dark:bg-slate-900 min-h-[500px] sm:min-h-[600px]"
    >
      {/* Preview Text */}
      <div className="w-full mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-y-auto max-h-[40vh] sm:max-h-[50vh]">
        <h3
          className="font-bold mb-2 text-slate-900 dark:text-white transition-all duration-200"
          style={{ fontSize: `${tempFontSize * 1.2}px` }}
        >
          The Wizard of Oz
        </h3>
        <div className="space-y-4">
          <p
            className="text-slate-600 dark:text-slate-300 leading-relaxed transition-all duration-200"
            style={{ fontSize: `${tempFontSize}px` }}
          >
            Chapter XI: The Wonderful Emerald City of Oz
          </p>
          <p
            className="text-slate-600 dark:text-slate-300 leading-relaxed transition-all duration-200"
            style={{ fontSize: `${tempFontSize}px` }}
          >
            Even with their eyes protected by the green spectacles, Dorothy and her friends were at
            first dazzled by the brilliancy of the wonderful City. The streets were lined with
            beautiful houses all built of green marble and studded everywhere with sparkling
            emeralds.
          </p>
          <p
            className="text-slate-600 dark:text-slate-300 leading-relaxed transition-all duration-200"
            style={{ fontSize: `${tempFontSize}px` }}
          >
            They walked over a pavement of the same green marble, and where the blocks were joined
            together were rows of emeralds, set closely, and glittering in the brightness of the
            sun. The window panes were of green glass; even the sky above the City had a green tint,
            and the rays of the sun were green.
          </p>
          <p
            className="text-slate-600 dark:text-slate-300 leading-relaxed transition-all duration-200"
            style={{ fontSize: `${tempFontSize}px` }}
          >
            There were many people—men, women, and children—walking about, and these were all
            dressed in green clothes and had greenish skins. They looked at Dorothy and her
            strangely assorted company with wondering eyes, and the children all ran away and hid
            behind their mothers when they saw the Lion.
          </p>
        </div>
      </div>

      {/* Slider Container */}
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Font size</span>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
            {tempFontSize}px
          </span>
        </div>
        <Slider
          value={tempFontSize}
          onChange={onTempChange}
          min={minFont}
          max={maxFont}
          step={step}
          showValue={false}
          formatValue={v => `${v}px`}
          leftIcon={
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Aa</span>
          }
          rightIcon={
            <span className="text-xl font-bold text-slate-600 dark:text-slate-300">Aa</span>
          }
        />

        <Button onClick={onApply} className="w-full" disabled={tempFontSize === currentFontSize}>
          Apply Changes
        </Button>
      </div>
    </motion.div>
  );
};

export default FontSizeAdjuster;
