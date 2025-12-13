import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { XIcon } from '../icons';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { acquireScrollLock, releaseScrollLock } from '../../lib/scrollLock';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  center?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  mobileFullScreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  mobileFullScreen = false,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      acquireScrollLock();
      // Slight delay to allow DOM mount before triggering transition
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      // Wait for animation to finish before unmounting
      const timer = setTimeout(() => {
        setIsMounted(false);
        releaseScrollLock();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
        'fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-ios',
        mobileFullScreen ? 'p-0 md:p-4' : 'p-4',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />

      <div
        className={twMerge(
          clsx(
            'relative w-full flex flex-col overflow-hidden bg-white shadow-2xl border border-slate-100',
            mobileFullScreen
              ? 'h-full rounded-none md:h-auto md:max-h-[85vh] md:rounded-2xl'
              : 'max-h-[85vh] rounded-2xl',
            sizeClasses[size],
            'transform transition-all duration-300 ease-ios will-change-transform',
            isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0',
            'dark:bg-slate-900 dark:border-slate-800'
          )
        )}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="text-xl font-bold text-slate-900 dark:text-white">{title}</div>
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
