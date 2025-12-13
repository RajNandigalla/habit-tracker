import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { acquireScrollLock, releaseScrollLock } from './../../utils/scrollLock';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, children }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const isLockedRef = useRef(false);

  useEffect(() => {
    let closingTimer: ReturnType<typeof setTimeout>;

    if (isOpen) {
      if (!isLockedRef.current) {
        acquireScrollLock();
        isLockedRef.current = true;
      }
      setIsMounted(true);
      // Small delay to allow mount before starting transition
      const openingTimer = setTimeout(() => {
        setIsActive(true);
      }, 20);

      return () => clearTimeout(openingTimer);
    } else {
      setIsActive(false);
      // Wait for transition to finish before unmounting
      closingTimer = setTimeout(() => {
        setIsMounted(false);
        if (isLockedRef.current) {
          releaseScrollLock();
          isLockedRef.current = false;
        }
      }, 500); // Matches the duration-500
    }
    return () => clearTimeout(closingTimer);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (isLockedRef.current) {
        releaseScrollLock();
      }
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isActive) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isActive, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const menuContent = (
    <div
      className={`fixed inset-0 bg-black/60 z-50 flex justify-start transition-opacity duration-500 ease-ios ${isActive ? 'opacity-100' : 'opacity-0'}`}
      aria-modal="true"
      role="dialog"
      onClick={handleBackdropClick}
    >
      <div
        ref={menuRef}
        className={`bg-white dark:bg-slate-950 h-full w-full max-w-xs flex flex-col transform transition-transform duration-500 ease-ios will-change-transform shadow-2xl ${isActive ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {children}
      </div>
    </div>
  );

  if (!isMounted) {
    return null;
  }

  return ReactDOM.createPortal(menuContent, document.body);
};

export default SideMenu;
