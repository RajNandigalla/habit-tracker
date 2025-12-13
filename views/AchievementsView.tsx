import React from 'react';
import { Achievement } from '../types';
import { Card } from '../core';
import { PageTitle } from '../modules/PageTitle';
import { AchievementsSection } from '../modules/progress';
import PageTransition from '../core/PageTransition';

interface AchievementsViewProps {
  achievements: Achievement[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements }) => {
  return (
    <PageTransition>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 pb-24 md:pb-8">
          <PageTitle
            title="Achievements"
            description="Celebrate your milestones and consistency."
            className="mb-8"
          />

          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <AchievementsSection achievements={achievements} />
          </div>
        </div>
      </main>
    </PageTransition>
  );
};
