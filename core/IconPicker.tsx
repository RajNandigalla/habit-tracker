import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker, { Theme, EmojiStyle } from 'emoji-picker-react';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useDismiss,
  useInteractions,
  useClick,
  FloatingPortal,
} from '@floating-ui/react';
import { cn } from '../utils';

interface IconPickerProps {
  currentIcon: string;
  onSelect: (icon: string) => void;
  className?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({ currentIcon, onSelect, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: 'bottom-start',
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  // Dark mode detection logic could be improved with context, using simple class check for now
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        type="button"
        className={cn(
          'w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl text-2xl border-2 transition-all cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95',
          isOpen ? 'border-indigo-500' : 'border-transparent',
          className
        )}
      >
        {currentIcon || '🏷️'}
      </button>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, zIndex: 9999 }}
            {...getFloatingProps()}
            className="shadow-2xl rounded-xl"
          >
            <EmojiPicker
              onEmojiClick={emojiData => {
                onSelect(emojiData.emoji);
                setIsOpen(false);
              }}
              theme={isDark ? Theme.DARK : Theme.LIGHT}
              emojiStyle={EmojiStyle.NATIVE}
              width={350}
              height={400}
              searchDisabled={false}
              skinTonesDisabled
              previewConfig={{ showPreview: false }}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
