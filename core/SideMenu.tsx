import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useScrollLock } from 'usehooks-ts';
import useAnimationFrame from '../hooks/useAnimationFrame';
import { useTimeout } from 'usehooks-ts';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, children }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Lock scroll when menu is open
  useScrollLock({ autoLock: isOpen });

  useEffect(() => {
    if (!isOpen) {
      setIsActive(false);
      return;
    }

    setIsMounted(true);

    return;
  }, [isOpen]);

  // Trigger CSS transition after mount (double-rAF pattern)
  useAnimationFrame(() => {
    if (isOpen) {
      setIsActive(true);
    }
  }, [isOpen]);

  // Wait for transition before unmounting
  useTimeout(
    () => {
      setIsMounted(false);
    },
    !isOpen && isActive === false ? 500 : null
  );

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
        className={`bg-white dark:bg-slate-900 h-full w-full max-w-xs flex flex-col transform transition-transform duration-500 ease-ios will-change-transform shadow-2xl ${isActive ? 'translate-x-0' : '-translate-x-full'}`}
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
