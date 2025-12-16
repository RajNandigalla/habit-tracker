import { UserPreferences } from '../../types';

export interface IPreferencesRepository {
  getPreferences(): Promise<UserPreferences | null>;
  savePreferences(preferences: UserPreferences): Promise<void>;
}
