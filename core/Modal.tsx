import React, { useState, useEffect, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { XIcon } from '../icons';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useScrollLock } from 'usehooks-ts';
import { useFocusTrap } from '../hooks/useFocusTrap';
import useAnimationFrame from '../hooks/useAnimationFrame';
import { useTimeout } from 'usehooks-ts';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  center?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  mobileFullScreen?: boolean;
  bottomSheet?: boolean;
  fabPosition?: { x: number; y: number }; // For genie animation
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  mobileFullScreen = false,
  bottomSheet = false,
  fabPosition,
  className,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hasGenieAnimation = !!fabPosition;
  const modalRef = useFocusTrap(isOpen); // Hook returns ref
  useScrollLock({ autoLock: isOpen });

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false);
      return;
    }

    setIsMounted(true);
  }, [isOpen]);

  // Trigger CSS transition after mount (double-rAF pattern)
  useAnimationFrame(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  // Wait for exit animation before unmounting
  useTimeout(
    () => {
      setIsMounted(false);
    },
    !isOpen && isVisible === false ? 300 : null
  );

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isMounted) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
    '2xl': 'max-w-3xl',
    '3xl': 'max-w-4xl',
    '4xl': 'max-w-5xl',
  };

  return ReactDOM.createPortal(
    <div
      className={clsx(
        'fixed inset-0 z-50 flex justify-center transition-opacity duration-300 ease-ios',
        bottomSheet ? 'items-end' : 'items-center',
        mobileFullScreen ? 'p-0 md:p-4' : bottomSheet ? 'p-0 md:p-4' : 'p-4',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />

      <div
        ref={modalRef}
        className={twMerge(
          clsx(
            'relative w-full flex flex-col overflow-hidden bg-white shadow-2xl border border-slate-100 outline-none',
            mobileFullScreen
              ? 'h-full rounded-none md:h-auto md:max-h-[85vh] md:rounded-3xl'
              : bottomSheet
                ? 'max-h-[85vh] rounded-t-2xl rounded-b-none md:rounded-3xl md:mb-auto'
                : 'max-h-[85vh] rounded-3xl',
            // On desktop, even if bottomSheet is true, we might want it centered or at least respected size.
            // Usually bottom sheet is mobile pattern. Let's make it full width on mobile if bottomSheet.
            bottomSheet ? 'w-full' : '',
            sizeClasses[size],
            hasGenieAnimation
              ? isVisible
                ? 'genie-enter'
                : 'genie-exit'
              : twMerge(
                  'transform transition-all duration-300 ease-ios will-change-transform',
                  isVisible
                    ? 'translate-y-0 scale-100 opacity-100'
                    : bottomSheet
                      ? 'translate-y-full opacity-100' // Slide from bottom
                      : 'translate-y-8 scale-95 opacity-0'
                ),
            'dark:bg-slate-900 dark:border-slate-800'
          ),
          className
        )}
        style={
          hasGenieAnimation && fabPosition
            ? ({
                '--genie-translate-x': `${fabPosition.x - window.innerWidth / 2}px`,
                '--genie-translate-y': `${fabPosition.y - window.innerHeight / 2}px`,
              } as React.CSSProperties)
            : undefined
        }
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="text-lg font-bold text-slate-900 dark:text-white">{title}</div>
          <button
            onClick={onClose}
            className="rounded-full p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors active:scale-90 duration-200"
          >
            <XIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
