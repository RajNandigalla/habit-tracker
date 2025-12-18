import React from 'react';
import { cn } from '../utils';

interface FlexItemProps {
  children: React.ReactNode;
  flex?: '1' | 'auto' | 'initial' | 'none';
  grow?: 0 | 1;
  shrink?: 0 | 1;
  basis?: 'auto' | 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4';
  order?: 1 | 2 | 3 | 4 | 5 | 6 | 'first' | 'last' | 'none';
  alignSelf?: 'auto' | 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  className?: string;
  as?: React.ElementType;
}

export const FlexItem: React.FC<FlexItemProps> = ({
  children,
  flex,
  grow,
  shrink,
  basis,
  order,
  alignSelf,
  className,
  as: Component = 'div',
}) => {
  const flexMap = {
    '1': 'flex-1',
    auto: 'flex-auto',
    initial: 'flex-initial',
    none: 'flex-none',
  };

  const growMap = {
    0: 'grow-0',
    1: 'grow',
  };

  const shrinkMap = {
    0: 'shrink-0',
    1: 'shrink',
  };

  const basisMap = {
    auto: 'basis-auto',
    full: 'basis-full',
    '1/2': 'basis-1/2',
    '1/3': 'basis-1/3',
    '2/3': 'basis-2/3',
    '1/4': 'basis-1/4',
    '3/4': 'basis-3/4',
  };

  const orderMap = {
    1: 'order-1',
    2: 'order-2',
    3: 'order-3',
    4: 'order-4',
    5: 'order-5',
    6: 'order-6',
    first: 'order-first',
    last: 'order-last',
    none: 'order-none',
  };

  const alignSelfMap = {
    auto: 'self-auto',
    start: 'self-start',
    center: 'self-center',
    end: 'self-end',
    stretch: 'self-stretch',
    baseline: 'self-baseline',
  };

  return (
    <Component
      className={cn(
        flex && flexMap[flex],
        grow !== undefined && growMap[grow],
        shrink !== undefined && shrinkMap[shrink],
        basis && basisMap[basis],
        order && orderMap[order],
        alignSelf && alignSelfMap[alignSelf],
        className
      )}
    >
      {children}
    </Component>
  );
};

export default FlexItem;
