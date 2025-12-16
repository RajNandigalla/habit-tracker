import { IHabitRepository } from './IHabitRepository';
import { Habit } from '../../types';
import { storageService } from '../../services/storageService';

const STORAGE_KEY = 'tickoff_habits';

export class LocalHabitRepository implements IHabitRepository {
  async getHabits(): Promise<Habit[]> {
    return await storageService.getItemAsync<Habit[]>(STORAGE_KEY, []);
  }

  async saveHabits(habits: Habit[]): Promise<void> {
    await storageService.setItemAsync(STORAGE_KEY, habits);
  }

  async addHabit(habit: Habit): Promise<void> {
    const habits = await this.getHabits();
    // Prepend new habit
    const newHabits = [habit, ...habits];
    await this.saveHabits(newHabits);
  }

  async updateHabit(habit: Habit): Promise<void> {
    const habits = await this.getHabits();
    const newHabits = habits.map(h => (h.id === habit.id ? habit : h));
    await this.saveHabits(newHabits);
  }

  async deleteHabit(id: string): Promise<void> {
    const habits = await this.getHabits();
    const newHabits = habits.filter(h => h.id !== id);
    await this.saveHabits(newHabits);
  }
}

export const habitRepository = new LocalHabitRepository();
