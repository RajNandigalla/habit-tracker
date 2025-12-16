import React, { createContext, useContext, useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { journalRepository } from '../core/repositories/LocalJournalRepository';
import { useToast } from './ToastContext';

interface JournalContextType {
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => void;
  deleteJournalEntry: (id: string) => void;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) throw new Error('useJournal must be used within JournalProvider');
  return context;
};

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      const loaded = await journalRepository.getEntries();
      setJournalEntries(loaded);
      setLoading(false);
    };
    loadEntries();
  }, []);

  const addJournalEntry = async (entry: JournalEntry) => {
    await journalRepository.addEntry(entry);
    setJournalEntries([entry, ...journalEntries]);
    addToast('Journal entry saved.', 'success');
  };

  const deleteJournalEntry = async (id: string) => {
    await journalRepository.deleteEntry(id);
    setJournalEntries(journalEntries.filter(e => e.id !== id));
    addToast('Entry deleted.', 'info');
  };

  if (loading) return null;

  return (
    <JournalContext.Provider value={{ journalEntries, addJournalEntry, deleteJournalEntry }}>
      {children}
    </JournalContext.Provider>
  );
};
