import React, { useState } from 'react';
import { Modal, Button, Show, Select, Textarea } from '../../core';
import { dayjs } from '../../utils';
import { ImageIcon as ImageIconLucide, Sparkles, Smile, Meh, Frown } from 'lucide-react';
import { cn, generateId, toBase64 } from '../../utils';
import { JournalEntry, Habit } from '../../types';
import { analyzeJournalEntry } from '../../services/geminiService';
import { clsx } from 'clsx';

const ImageIcon = ImageIconLucide;

interface AddJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entry: JournalEntry) => void;
  habits: Habit[];
}

const AddJournalEntryModal: React.FC<AddJournalEntryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  habits,
}) => {
  const [content, setContent] = useState('');
  const [habitId, setHabitId] = useState('');
  const [mood, setMood] = useState('neutral');
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await toBase64(e.target.files[0]);
        setImage(base64);
      } catch (err) {
        console.error('Failed to read image', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsAnalyzing(true);
    // Get AI analysis implicitly on submit for instant value
    const aiAnalysis = await analyzeJournalEntry(content, mood);

    const newEntry: JournalEntry = {
      id: generateId(),
      date: dayjs().toISOString(),
      content,
      habitId: habitId || undefined,
      mood: mood as any,
      imageUrl: image || undefined,
      aiAnalysis,
    };

    onAdd(newEntry);
    setIsAnalyzing(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setContent('');
    setHabitId('');
    setMood('neutral');
    setImage(null);
  };

  const habitOptions = [
    { value: '', label: '-- General Reflection --' },
    ...habits.map(h => ({ value: h.id, label: h.name })),
  ];

  const moodOptions = [
    { value: 'happy', label: 'Happy / Proud' },
    { value: 'motivated', label: 'Motivated / Energetic' },
    { value: 'neutral', label: 'Neutral / Calm' },
    { value: 'sad', label: 'Tired / Frustrated' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Journal Entry">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Related Habit (Optional)"
          value={habitId}
          onChange={val => setHabitId(val as string)}
          options={habitOptions}
        />

        <Textarea
          id="journal-entry"
          label="Journal Entry"
          placeholder="What's on your mind? Did you hit a milestone? How do you feel?"
          rows={4}
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Current Mood"
            value={mood}
            onChange={val => setMood(val as string)}
            options={moodOptions}
          />

          <div>
            <label className="mb-1.5 block text-base font-medium text-slate-700 dark:text-slate-300">
              Photo Evidence
            </label>
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className={clsx(
                  'flex items-center justify-center w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-500 transition-colors',
                  'dark:border-slate-600 dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-700'
                )}
              >
                <ImageIcon
                  className={cn('h-4 w-4 mr-2', image && 'text-indigo-500 dark:text-indigo-400')}
                />
                <span
                  className={cn(
                    'text-base truncate',
                    image && 'text-indigo-600 dark:text-indigo-400 font-medium'
                  )}
                >
                  {image ? 'Photo Added' : 'Add Photo'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!content || isAnalyzing} isLoading={isAnalyzing}>
            Save & Analyze
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddJournalEntryModal;
