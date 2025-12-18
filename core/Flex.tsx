import React from 'react';
import { cn } from '../utils';

interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: 'wrap' | 'wrap-reverse' | 'nowrap';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
  className?: string;
  as?: React.ElementType;
}

export const Flex: React.FC<FlexProps> = ({
  children,
  direction = 'row',
  align,
  justify,
  wrap,
  gap,
  className,
  as: Component = 'div',
}) => {
  const directionMap = {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    column: 'flex-col',
    'column-reverse': 'flex-col-reverse',
  };

  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const wrapMap = {
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse',
    nowrap: 'flex-nowrap',
  };

  const gapMap = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
    16: 'gap-16',
    20: 'gap-20',
    24: 'gap-24',
  };

  return (
    <Component
      className={cn(
        'flex',
        directionMap[direction],
        align && alignMap[align],
        justify && justifyMap[justify],
        wrap && wrapMap[wrap],
        gap !== undefined && gapMap[gap],
        className
      )}
    >
      {children}
    </Component>
  );
};

export default Flex;
