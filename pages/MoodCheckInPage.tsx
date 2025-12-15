import React from 'react';
import { MoodCheckIn } from '../modules/mood/MoodCheckIn';
import { MainLayout } from '../modules/layout';

export const MoodCheckInPage: React.FC = () => {
  // Ideally we might want a different layout or just fullscreen.
  // The design looks like a full screen modal or page.
  // For now, we'll render it directly. If navigation is needed, we wrap it.
  return <MoodCheckIn />;
};
