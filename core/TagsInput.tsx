import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { XIcon, PlusIcon } from '../icons';
import { Tag } from '../types';
import useOnClickOutside from '../hooks/useOnClickOutside';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';

interface TagsInputProps {
  allTags: Tag[];
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  onAddTag: (name: string) => Tag;
}

// Added named export
export const TagsInput: React.FC<TagsInputProps> = ({
  allTags,
  selectedTagIds,
  onChange,
  onAddTag,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({
    position: 'fixed',
    top: 0,
    left: 0,
    opacity: 0,
    pointerEvents: 'none',
  });

  const updatePosition = useCallback(() => {
    if (!inputRef.current || !dropdownRef.current) return;
    const inputContainer = inputRef.current.parentElement;
    if (!inputContainer) return;

    computePosition(inputContainer, dropdownRef.current, {
      placement: 'bottom-start',
      strategy: 'fixed',
      middleware: [offset(4), flip(), shift({ padding: 8 })],
    }).then(({ x, y, strategy }) => {
      setDropdownStyles({
        position: strategy,
        left: `${x}px`,
        top: `${y}px`,
        width: `${inputContainer.offsetWidth}px`,
        opacity: 1,
        pointerEvents: 'auto',
      });
    });
  }, []);

  useEffect(() => {
    if (isDropdownOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    } else {
      setDropdownStyles(prev => ({ ...prev, opacity: 0, pointerEvents: 'none' }));
    }
  }, [isDropdownOpen, updatePosition]);

  useOnClickOutside([inputRef, dropdownRef], () => setIsDropdownOpen(false));

  const selectedTags = useMemo(() => {
    return selectedTagIds.map(id => allTags.find(t => t.id === id)).filter(Boolean) as Tag[];
  }, [selectedTagIds, allTags]);

  const availableTags = useMemo(() => {
    return allTags.filter(
      tag =>
        !selectedTagIds.includes(tag.id) &&
        tag.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [allTags, selectedTagIds, inputValue]);

  const exactMatch = useMemo(() => {
    return allTags.find(tag => tag.name.toLowerCase() === inputValue.trim().toLowerCase());
  }, [allTags, inputValue]);

  const handleAddTag = (tag: Tag) => {
    if (!selectedTagIds.includes(tag.id)) {
      onChange([...selectedTagIds, tag.id]);
    }
    setInputValue('');
  };

  const handleCreateAndAddTag = () => {
    if (inputValue.trim() && !exactMatch) {
      const newTag = onAddTag(inputValue);
      onChange([...selectedTagIds, newTag.id]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onChange(selectedTagIds.filter(id => id !== tagId));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        if (exactMatch) {
          handleAddTag(exactMatch);
        } else {
          handleCreateAndAddTag();
        }
      }
    } else if (e.key === 'Backspace' && inputValue === '' && selectedTags.length > 0) {
      handleRemoveTag(selectedTags[selectedTags.length - 1].id);
    }
  };

  const DropdownContent = (
    <div
      ref={dropdownRef}
      style={dropdownStyles}
      className="z-50 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 focus:outline-none transition-opacity duration-150"
    >
      <div className="max-h-48 overflow-y-auto">
        {inputValue.trim() && !exactMatch && (
          <button
            onClick={handleCreateAndAddTag}
            className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <PlusIcon className="w-4 h-4" /> Create "{inputValue.trim()}"
          </button>
        )}
        {availableTags.map(tag => (
          <button
            key={tag.id}
            onClick={() => handleAddTag(tag)}
            className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <label className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-2">
        Tags
      </label>
      <div
        className="flex flex-wrap items-baseline gap-2 p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"
        onClick={() => inputRef.current?.focus()}
      >
        {selectedTags.map(tag => (
          <div
            key={tag.id}
            className="flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm font-semibold px-2 py-0.5 rounded-full"
          >
            <span>{tag.name}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(tag.id)}
              className="rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-500/30"
            >
              <XIcon className="w-3 h-3" />
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length === 0 ? 'Add tags...' : ''}
          className="flex-grow bg-transparent focus:outline-none text-base min-w-[80px] py-0.5 text-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
        />
      </div>
      {isDropdownOpen && ReactDOM.createPortal(DropdownContent, document.body)}
    </div>
  );
};

export default TagsInput;
