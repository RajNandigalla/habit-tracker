export interface GlobalStats {
  totalCompletions: number;
  completionRate: number;
  longestStreak: number;
  bestDay: string;
}

export interface HeatmapData {
  date: string;
  count: number;
}

export interface MoodCorrelationData {
  mood: string;
  count: number;
  completionRate: number;
}
