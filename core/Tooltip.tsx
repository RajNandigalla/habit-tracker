import React, { useRef, useState } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingArrow,
  Placement,
} from '@floating-ui/react';
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
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: position,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip(),
      shift(),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const hover = useHover(context, { move: false, delay: { open: delay } });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()} className="inline-flex">
        {children}
      </div>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={cn(
              'z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-800 dark:bg-slate-700 rounded-md shadow-lg pointer-events-none whitespace-nowrap animate-fade-in',
              className
            )}
          >
            {content}
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className="fill-slate-800 dark:fill-slate-700"
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default Tooltip;
