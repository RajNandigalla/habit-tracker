import filter from 'lodash/filter';
import React from 'react';
import { Modal, Button } from '../../core';
import { Sparkles, TrendingUp, AlertCircle, ArrowUpRight, Crown } from 'lucide-react';
import { clsx } from 'clsx';

const AIReportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  report: string | null;
  isLoading: boolean;
  onGenerate: () => void;
}> = ({ isOpen, onClose, report, isLoading, onGenerate }) => {
  // Improved parser to handle multi-line content and headers properly
  const renderReport = () => {
    if (!report) return null;

    const lines = filter(report.split('\n'), l => l.trim().length > 0);

    const sections: { title: string; content: string }[] = [];
    let currentSection: { title: string; content: string } | null = null;
    let generalText: string[] = [];

    lines.forEach(line => {
      // Match lines with **Title** or **Title:**
      const headerMatch = line.match(/\*\*(.*?)\*\*(.*)/);

      if (headerMatch) {
        if (currentSection) {
          sections.push(currentSection);
        }

        // Clean up title (remove colons, trim)
        let title = headerMatch[1].replace(/:/g, '').trim();
        let content = headerMatch[2].trim();

        // Clean up content start
        if (content.startsWith(':')) content = content.substring(1).trim();
        if (content.startsWith('-')) content = content.substring(1).trim();

        currentSection = { title, content };
        return;
      }

      if (currentSection) {
        // Append to current section
        currentSection.content += (currentSection.content ? ' ' : '') + line.trim();
        return;
      }

      // General text (intro/outro)
      generalText.push(line);
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return (
      <div className="space-y-6">
        {/* General/Intro Text */}
        {generalText.length > 0 && (
          <div className="space-y-2 mb-6">
            {generalText.map((t, i) => {
              if (t.startsWith('##'))
                return (
                  <h2 key={i} className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                    {t.replace(/#/g, '')}
                  </h2>
                );
              if (t.startsWith('#'))
                return (
                  <h3 key={i} className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                    {t.replace(/#/g, '')}
                  </h3>
                );
              return (
                <p key={i} className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {t}
                </p>
              );
            })}
          </div>
        )}

        {/* Sections Grid */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-indigo-50 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {section.title}
              </h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Performance Coach">
      <div className="space-y-6">
        {!report && !isLoading && (
          <div className="text-center py-8">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Ready to review your week?
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Gemini will analyze your habits, streaks, and patterns to give you a personalized
              strategy for improvement.
            </p>
            <Button
              onClick={onGenerate}
              size="lg"
              className="w-full shadow-lg shadow-indigo-500/20"
            >
              Generate Report
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg border border-indigo-100 dark:border-slate-700">
                <Sparkles className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Analyzing your habits...
              </p>
              <p className="text-sm text-slate-500">Finding your biggest wins and opportunities.</p>
            </div>
          </div>
        )}

        {report && !isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-indigo-600 p-4 rounded-xl text-white mb-6 shadow-lg shadow-indigo-600/20">
              <div className="flex items-center gap-2 font-bold text-lg mb-1">
                <Crown className="h-5 w-5 text-yellow-300" />
                Coach Report
              </div>
              <p className="text-indigo-100 text-sm">
                Based on your activity from the last 30 days.
              </p>
            </div>

            {renderReport()}

            <div className="mt-6 flex justify-end">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AIReportModal;
