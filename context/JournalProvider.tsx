import React, { createContext, useContext, useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { storageService } from '../services/storageService';
import { useToast } from './ToastContext';

const STORAGE_KEY = 'tickoff_journal';

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
      const loaded = await storageService.getItemAsync<JournalEntry[]>(STORAGE_KEY, []);
      setJournalEntries(loaded);
      setLoading(false);
    };
    loadEntries();
  }, []);

  const addJournalEntry = (entry: JournalEntry) => {
    const newEntries = [entry, ...journalEntries];
    setJournalEntries(newEntries);
    storageService.setItemAsync(STORAGE_KEY, newEntries);
    addToast('Journal entry saved.', 'success');
  };

  const deleteJournalEntry = (id: string) => {
    const newEntries = journalEntries.filter(e => e.id !== id);
    setJournalEntries(newEntries);
    storageService.setItemAsync(STORAGE_KEY, newEntries);
    addToast('Entry deleted.', 'info');
  };

  if (loading) return null;

  return (
    <JournalContext.Provider value={{ journalEntries, addJournalEntry, deleteJournalEntry }}>
      {children}
    </JournalContext.Provider>
  );
};
