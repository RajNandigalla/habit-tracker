import { Habit } from '../../types';

export interface IHabitRepository {
  getHabits(): Promise<Habit[]>;
  saveHabits(habits: Habit[]): Promise<void>;
  addHabit(habit: Habit): Promise<void>;
  updateHabit(habit: Habit): Promise<void>;
  deleteHabit(id: string): Promise<void>;
}
