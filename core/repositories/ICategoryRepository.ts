import { Category } from '../../types';

export interface ICategoryRepository {
  getCategories(): Promise<Category[]>;
  saveCategories(categories: Category[]): Promise<void>;
}
