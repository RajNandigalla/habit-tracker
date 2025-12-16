import { JournalEntry } from '../../types';

export interface IJournalRepository {
  getEntries(): Promise<JournalEntry[]>;
  saveEntries(entries: JournalEntry[]): Promise<void>;
  addEntry(entry: JournalEntry): Promise<void>;
  updateEntry(entry: JournalEntry): Promise<void>;
  deleteEntry(id: string): Promise<void>;
}
