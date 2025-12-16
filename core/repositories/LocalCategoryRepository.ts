import { ICategoryRepository } from './ICategoryRepository';
import { Category } from '../../types';
import { storageService } from '../../services/storageService';

const STORAGE_KEY = 'tickoff_categories';

export class LocalCategoryRepository implements ICategoryRepository {
  async getCategories(): Promise<Category[]> {
    return await storageService.getItemAsync<Category[]>(STORAGE_KEY, []);
  }

  async saveCategories(categories: Category[]): Promise<void> {
    await storageService.setItemAsync(STORAGE_KEY, categories);
  }
}

export const categoryRepository = new LocalCategoryRepository();
