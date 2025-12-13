import React, { useState, useRef, useEffect } from 'react';
import {
  computePosition,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  Placement,
  Strategy,
} from '@floating-ui/dom';
import { cn } from '../utils';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: Placement;
  className?: string;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className,
  delay = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const referenceRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const [floatingStyles, setFloatingStyles] = useState<{
    x: number;
    y: number;
    strategy: Strategy;
    placement: Placement;
    arrow?: { x?: number; y?: number };
  }>({
    x: 0,
    y: 0,
    strategy: 'absolute',
    placement: position,
  });

  const updatePosition = () => {
    if (referenceRef.current && floatingRef.current) {
      computePosition(referenceRef.current, floatingRef.current, {
        placement: position,
        middleware: [
          offset(8),
          flip(),
          shift({ padding: 5 }),
          arrow({ element: arrowRef.current }),
        ],
      }).then(({ x, y, placement, strategy, middlewareData }) => {
        setFloatingStyles({
          x,
          y,
          strategy,
          placement,
          arrow: middlewareData.arrow,
        });
      });
    }
  };

  useEffect(() => {
    if (!isVisible || !referenceRef.current || !floatingRef.current) return;

    // cleanup is returned by autoUpdate
    const cleanup = autoUpdate(referenceRef.current, floatingRef.current, updatePosition);

    return () => cleanup();
  }, [isVisible, position]);

  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  // Determine arrow static side based on placement
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[floatingStyles.placement.split('-')[0]] as string;

  return (
    <>
      <div
        ref={referenceRef}
        className="inline-flex"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={floatingRef}
          role="tooltip"
          className={cn(
            'z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-800 dark:bg-slate-700 rounded-md shadow-lg pointer-events-none whitespace-nowrap animate-fade-in',
            className
          )}
          style={{
            position: floatingStyles.strategy,
            left: floatingStyles.x ?? 0,
            top: floatingStyles.y ?? 0,
          }}
        >
          {content}

          {/* Arrow */}
          <div
            ref={arrowRef}
            className="absolute w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45"
            style={{
              left: floatingStyles.arrow?.x != null ? `${floatingStyles.arrow.x}px` : '',
              top: floatingStyles.arrow?.y != null ? `${floatingStyles.arrow.y}px` : '',
              [staticSide]: '-4px',
            }}
          />
        </div>
      )}
    </>
  );
};

export default Tooltip;
