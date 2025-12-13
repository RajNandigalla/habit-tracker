import { Challenge, HabitCategory } from '../types';
import { Droplets, Moon, BookOpen, PhoneOff, Leaf, Activity, Zap, Sun } from 'lucide-react';

export const CHALLENGES: Challenge[] = [
    {
        id: 'c_hydration',
        title: '7-Day Hydration Hero',
        description: 'Drink 3L of water every day for a week. Boost your energy and skin health.',
        durationDays: 7,
        category: HabitCategory.HEALTH,
        difficulty: 'Easy',
        icon: Droplets,
        color: '#3b82f6',
        habitTemplate: {
            name: 'Drink 3L Water',
            description: 'Challenge: Stay hydrated with 3L daily.',
            category: HabitCategory.HEALTH,
            color: '#3b82f6'
        }
    },
    {
        id: 'c_earlybird',
        title: 'Early Bird 14',
        description: 'Wake up at 6:00 AM for two weeks straight. Reclaim your mornings.',
        durationDays: 14,
        category: HabitCategory.WORK,
        difficulty: 'Medium',
        icon: Sun,
        color: '#f59e0b',
        habitTemplate: {
            name: 'Wake up at 6AM',
            description: 'Challenge: Start the day early.',
            category: HabitCategory.WORK,
            color: '#f59e0b'
        }
    },
    {
        id: 'c_meditation',
        title: 'Mindful 21',
        description: 'Build a solid meditation habit. 10 minutes a day for 21 days.',
        durationDays: 21,
        category: HabitCategory.MINDFULNESS,
        difficulty: 'Medium',
        icon: Leaf,
        color: '#10b981',
        habitTemplate: {
            name: '10m Meditation',
            description: 'Challenge: 10 mins of daily mindfulness.',
            category: HabitCategory.MINDFULNESS,
            color: '#10b981'
        }
    },
    {
        id: 'c_reading',
        title: '30-Day Reader',
        description: 'Read 15 pages of a book every single day for a month.',
        durationDays: 30,
        category: HabitCategory.LEARNING,
        difficulty: 'Hard',
        icon: BookOpen,
        color: '#8b5cf6',
        habitTemplate: {
            name: 'Read 15 Pages',
            description: 'Challenge: Expand your knowledge.',
            category: HabitCategory.LEARNING,
            color: '#8b5cf6'
        }
    },
    {
        id: 'c_detox',
        title: 'Digital Detox Week',
        description: 'No screens 1 hour before bed for 7 days. Improve your sleep quality.',
        durationDays: 7,
        category: HabitCategory.HEALTH,
        difficulty: 'Medium',
        icon: PhoneOff,
        color: '#ef4444',
        habitTemplate: {
            name: 'No Screens Before Bed',
            description: 'Challenge: 1hr screen-free before sleep.',
            category: HabitCategory.HEALTH,
            color: '#ef4444'
        }
    },
    {
        id: 'c_movement',
        title: 'Movement Master',
        description: '30 minutes of any physical activity for 30 days.',
        durationDays: 30,
        category: HabitCategory.FITNESS,
        difficulty: 'Hard',
        icon: Activity,
        color: '#ec4899',
        habitTemplate: {
            name: '30m Activity',
            description: 'Challenge: Move your body daily.',
            category: HabitCategory.FITNESS,
            color: '#ec4899'
        }
    }
];