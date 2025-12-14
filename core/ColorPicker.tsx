import { cn, getColorValue } from '../utils';

interface ColorPickerProps {
  colors: string[];
  selectedColor: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onChange,
  label = 'Color',
  className,
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="mb-3 block text-base font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-3">
        {colors.map(c => {
          const colorValue = getColorValue(c);
          const isSelected = selectedColor === c;

          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              className={cn(
                'w-8 h-8 rounded-full transition-transform duration-300 ease-spring focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 border-2',
                isSelected
                  ? 'scale-110 border-slate-600 dark:border-slate-300 ring-2 ring-offset-2 ring-slate-400'
                  : 'border-transparent md:hover:scale-110'
              )}
              style={{ backgroundColor: colorValue }}
              aria-label={`Select color ${c}`}
              aria-selected={isSelected}
            />
          );
        })}
      </div>
    </div>
  );
};
