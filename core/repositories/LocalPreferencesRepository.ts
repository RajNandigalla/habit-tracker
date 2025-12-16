import { IPreferencesRepository } from './IPreferencesRepository';
import { UserPreferences } from '../../types';
import { storageService } from '../../services/storageService';

const STORAGE_KEY = 'tickoff_prefs';

export class LocalPreferencesRepository implements IPreferencesRepository {
  async getPreferences(): Promise<UserPreferences | null> {
    return await storageService.getItemAsync<UserPreferences | null>(STORAGE_KEY, null);
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    await storageService.setItemAsync(STORAGE_KEY, preferences);
  }
}

export const preferencesRepository = new LocalPreferencesRepository();
