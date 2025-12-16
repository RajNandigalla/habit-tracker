import { IJournalRepository } from './IJournalRepository';
import { JournalEntry } from '../../types';
import { storageService } from '../../services/storageService';

const STORAGE_KEY = 'tickoff_journal';

export class LocalJournalRepository implements IJournalRepository {
  async getEntries(): Promise<JournalEntry[]> {
    return await storageService.getItemAsync<JournalEntry[]>(STORAGE_KEY, []);
  }

  async saveEntries(entries: JournalEntry[]): Promise<void> {
    await storageService.setItemAsync(STORAGE_KEY, entries);
  }

  async addEntry(entry: JournalEntry): Promise<void> {
    const entries = await this.getEntries();
    const newEntries = [entry, ...entries];
    await this.saveEntries(newEntries);
  }

  async updateEntry(entry: JournalEntry): Promise<void> {
    const entries = await this.getEntries();
    const newEntries = entries.map(e => (e.id === entry.id ? entry : e));
    await this.saveEntries(newEntries);
  }

  async deleteEntry(id: string): Promise<void> {
    const entries = await this.getEntries();
    const newEntries = entries.filter(e => e.id !== id);
    await this.saveEntries(newEntries);
  }
}

export const journalRepository = new LocalJournalRepository();
