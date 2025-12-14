import React from 'react';
import { CATEGORY_COLORS, ColorOption } from '../constants';
import { cn } from '../utils';

interface CategoryColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const CategoryColorPicker: React.FC<CategoryColorPickerProps> = ({
  selectedColor,
  onColorSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {CATEGORY_COLORS.map((colorOption: ColorOption) => {
        const isSelected =
          selectedColor === colorOption.name || selectedColor === colorOption.cssVar;

        return (
          <button
            key={colorOption.name}
            type="button"
            onClick={() => onColorSelect(colorOption.name)}
            className={cn(
              'w-8 h-8 rounded-full transition-all border-2',
              colorOption.className,
              isSelected
                ? 'scale-110 border-slate-600 dark:border-slate-300'
                : 'border-transparent hover:scale-105'
            )}
            aria-label={`Select ${colorOption.name} color`}
          />
        );
      })}
    </div>
  );
};
