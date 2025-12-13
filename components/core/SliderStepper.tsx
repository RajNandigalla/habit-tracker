import React from 'react';

interface SliderStepperProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
}

// Added named export
export const SliderStepper: React.FC<SliderStepperProps> = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
  unit = ''
}) => {
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  const steps = [];
  for (let i = min; i <= max; i += step) {
    steps.push(i);
  }

  const progressPercent = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex items-center gap-4 w-full">
      <div className="relative w-full flex items-center">
        {/* Custom Track with Ticks */}
        <div className="absolute top-1/2 -translate-y-1/2 left-[12px] right-[12px] h-2">
            {/* Base Track */}
            <div className="absolute w-full h-full bg-slate-200 dark:bg-slate-700 rounded-full" />
            
            {/* Progress Fill */}
            <div 
                className="absolute h-full bg-indigo-500 rounded-l-full" 
                style={{ width: `${progressPercent}%` }} 
            />

            {/* Ticks */}
            <div className="absolute w-full h-full flex justify-between items-center pointer-events-none px-1">
                {steps.map((stepValue) => (
                    <div
                        key={stepValue}
                        className="w-px h-2 bg-black/20 dark:bg-white/20"
                    />
                ))}
            </div>
        </div>

        <label htmlFor={label} className="sr-only">{label}</label>
        <input
          id={label}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleValueChange}
          className="w-full relative z-10"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </div>
      <span className="font-semibold text-slate-800 dark:text-slate-200 w-14 text-center">
        {value.toFixed(1)}{unit}
      </span>
    </div>
  );
};

export default SliderStepper;