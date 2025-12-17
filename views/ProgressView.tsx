import React from 'react';
import { Habit } from '../types';
import { PageTitle } from '../modules/PageTitle';
import { Sparkles } from 'lucide-react';
import { Button } from '../core';
import {
  GlobalStatsGrid,
  ConsistencyHeatmap,
  HabitPerformanceChart,
  MoodCorrelationCard,
  AIReportModal,
  GlobalStats,
  HeatmapData,
  MoodCorrelationData,
} from '../modules/progress';
import PageTransition from '../core/PageTransition';

interface ProgressViewProps {
  stats: GlobalStats;
  heatmapData: HeatmapData[];
  moodCorrelationData: MoodCorrelationData[];
  habits: Habit[];
  darkMode: boolean;
  onToggleDarkMode: () => void;

  // AI Props
  isAIModalOpen: boolean;
  onOpenAIModal: () => void;
  onCloseAIModal: () => void;
  aiReport: string | null;
  isGeneratingReport: boolean;
  onGenerateReport: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  stats,
  heatmapData,
  moodCorrelationData,
  habits,
  isAIModalOpen,
  onOpenAIModal,
  onCloseAIModal,
  aiReport,
  isGeneratingReport,
  onGenerateReport,
}) => {
  return (
    <PageTransition>
      <main className="flex-1" aria-label="Progress view">
        <h1 className="sr-only">Progress Report</h1>
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 pb-24 md:pb-8">
          <div
            className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4 animate-slide-up"
            style={{ animationDelay: '0ms' }}
          >
            <PageTitle
              title="Progress Report"
              description="Deep insights into your performance and consistency."
            />
            <Button
              onClick={onOpenAIModal}
              className="w-full md:w-auto shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-purple-600 border-0 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Coach Review
            </Button>
          </div>

          <div className="space-y-8">
            {/* 1. Global KPI Grid */}
            <section
              aria-labelledby="global-stats-heading"
              className="animate-slide-up"
              style={{ animationDelay: '100ms', opacity: 0 }}
            >
              <h2 id="global-stats-heading" className="sr-only">
                Global Statistics
              </h2>
              <GlobalStatsGrid stats={stats} />
            </section>

            {/* 2. Mood Correlation */}
            <section
              aria-labelledby="mood-correlation-heading"
              className="animate-slide-up"
              style={{ animationDelay: '200ms', opacity: 0 }}
            >
              <h2 id="mood-correlation-heading" className="sr-only">
                Mood Correlation
              </h2>
              <MoodCorrelationCard data={moodCorrelationData} />
            </section>

            {/* 3. Visualizations Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Heatmap (Takes up 2/3 on large screens) */}
              <section
                aria-labelledby="consistency-heatmap-heading"
                className="lg:col-span-2 animate-slide-up"
                style={{ animationDelay: '400ms', opacity: 0 }}
              >
                <h2 id="consistency-heatmap-heading" className="sr-only">
                  Consistency Heatmap
                </h2>
                <ConsistencyHeatmap data={heatmapData} />
              </section>

              {/* Bar Chart (Takes up 1/3 on large screens) */}
              <section
                aria-labelledby="habit-performance-heading"
                className="lg:col-span-1 animate-slide-up"
                style={{ animationDelay: '500ms', opacity: 0 }}
              >
                <h2 id="habit-performance-heading" className="sr-only">
                  Habit Performance
                </h2>
                <HabitPerformanceChart habits={habits} />
              </section>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};
