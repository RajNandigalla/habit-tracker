import React, { useState } from 'react';
import { JournalEntry, Habit } from '../../types';
import { cn, formatDate, generateId, toBase64 } from '../../utils';
import { Button, Textarea, Card, Modal, Select } from '../UI';
import { analyzeJournalEntry } from '../../services/geminiService';
import { Image as ImageIcon, Sparkles, Smile, Meh, Frown, Calendar } from 'lucide-react';
import { clsx } from 'clsx';

interface JournalTimelineItemProps {
    entry: JournalEntry;
    habit?: Habit;
    index: number;
}

export const JournalTimelineItem: React.FC<JournalTimelineItemProps> = ({ entry, habit, index }) => {
    return (
        <div 
            className="relative pl-8 md:pl-10 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms`, opacity: 0 }} // opacity 0 initially handled by keyframes
        >
            {/* Timeline Dot */}
            <div className={cn(
                clsx(
                    "absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white shadow-sm z-10",
                    "dark:border-slate-950",
                    index === 0 ? "bg-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-900/30" : "bg-slate-300 dark:bg-slate-700"
                )
            )}></div>
            
            <div className="mb-2 flex flex-col sm:flex-row sm:items-center gap-2">
            <span className={clsx("text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 bg-slate-100 px-2 py-1 rounded w-fit", "dark:text-slate-400 dark:bg-slate-800")}>
                <Calendar className="h-3 w-3 text-slate-400" />
                {formatDate(entry.date, 'MMM D, YYYY • h:mm A')}
            </span>
            </div>

            <Card className="hover:shadow-lg transition-shadow duration-300 ease-ios">
            <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                    {habit && (
                    <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 mb-2 border border-indigo-100", "dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50")}>
                        {habit.name}
                    </span>
                    )}
                    <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed text-base">
                    {entry.content}
                    </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    {entry.mood === 'happy' && <span title="Happy"><Smile className="h-6 w-6 text-green-500" /></span>}
                    {entry.mood === 'motivated' && <span title="Motivated"><Sparkles className="h-6 w-6 text-orange-500" /></span>}
                    {entry.mood === 'neutral' && <span title="Neutral"><Meh className="h-6 w-6 text-yellow-500" /></span>}
                    {entry.mood === 'sad' && <span title="Sad/Tired"><Frown className="h-6 w-6 text-slate-400" /></span>}
                </div>
            </div>

            {entry.imageUrl && (
                <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm group cursor-pointer">
                    <img src={entry.imageUrl} alt="Journal attachment" className="w-full h-auto max-h-96 object-cover transition-transform duration-500 ease-ios group-hover:scale-105" />
                </div>
            )}

            {entry.aiAnalysis && (
                <div className={clsx("relative bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 flex gap-4 mt-4", "dark:from-indigo-950/30 dark:to-purple-950/30 dark:border-indigo-800/50")}>
                    <div className="flex-shrink-0 bg-white dark:bg-slate-800 p-1.5 rounded-full h-fit shadow-sm">
                    <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <div>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1 uppercase tracking-wide">Coach Insight</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 italic font-medium">"{entry.aiAnalysis}"</p>
                    </div>
                </div>
            )}
            </Card>
        </div>
    );
};

interface AddJournalEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (entry: JournalEntry) => void;
    habits: Habit[];
}

export const AddJournalEntryModal: React.FC<AddJournalEntryModalProps> = ({ isOpen, onClose, onAdd, habits }) => {
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
                console.error("Failed to read image", err);
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
            date: new Date().toISOString(),
            content,
            habitId: habitId || undefined,
            mood: mood as any,
            imageUrl: image || undefined,
            aiAnalysis
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
        ...habits.map(h => ({ value: h.id, label: h.name }))
    ];

    const moodOptions = [
        { value: 'happy', label: 'Happy / Proud' },
        { value: 'motivated', label: 'Motivated / Energetic' },
        { value: 'neutral', label: 'Neutral / Calm' },
        { value: 'sad', label: 'Tired / Frustrated' }
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
                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Photo Evidence</label>
                        <div className="relative group">
                        <input 
                            type="file" 
                            accept="image/*" 
                            capture="environment"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={clsx("flex items-center justify-center w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-500 transition-colors", "dark:border-slate-600 dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-700")}>
                            <ImageIcon className={cn("h-4 w-4 mr-2", image && "text-indigo-500 dark:text-indigo-400")} />
                            <span className={cn("text-sm truncate", image && "text-indigo-600 dark:text-indigo-400 font-medium")}>{image ? 'Photo Added' : 'Add Photo'}</span>
                        </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={!content || isAnalyzing} isLoading={isAnalyzing}>Save & Analyze</Button>
                </div>
            </form>
        </Modal>
    );
};