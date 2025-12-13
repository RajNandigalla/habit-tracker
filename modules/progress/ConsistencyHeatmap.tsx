import React from 'react';
import { Card } from '../../core';
import { Calendar } from 'lucide-react';
import HeatmapGrid from './HeatmapGrid';
import { HeatmapData } from './types';

const ConsistencyHeatmap: React.FC<{ data: HeatmapData[] }> = ({ data }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-500" />
            Consistency Heatmap
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Activity over the last 90 days
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700"></div>
            <div className="w-3 h-3 rounded-sm bg-indigo-300 dark:bg-indigo-900"></div>
            <div className="w-3 h-3 rounded-sm bg-indigo-400 dark:bg-indigo-800"></div>
            <div className="w-3 h-3 rounded-sm bg-indigo-600 dark:bg-indigo-500"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Grid */}
      <HeatmapGrid data={data} />
    </Card>
  );
};

export default ConsistencyHeatmap;
