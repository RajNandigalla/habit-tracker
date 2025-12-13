import React from 'react';
import { Habit, Achievement } from '../../types';
import { cn, formatDate } from '../../utils';
import { Card, Button, Modal } from '../UI';
import { Flame, Trophy, Check, Calendar, BarChart2, Medal, Zap, BookOpen, Crown, Lock, Sparkles, Smile, Meh, Frown, Moon, ArrowUpRight, TrendingUp, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';
import { clsx } from 'clsx';

// --- Types ---
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
    count: number; // Number of days with this mood
    completionRate: number; // Avg completion rate on these days
}

// --- GlobalStatsGrid ---
export const GlobalStatsGrid: React.FC<{ stats: GlobalStats }> = ({ stats }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="flex flex-col items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50">
                <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400 mb-2">
                    <BarChart2 className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completionRate}%</div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">30-Day Rate</div>
            </Card>

            <Card className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/50">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400 mb-2">
                    <Check className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalCompletions}</div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">Total Checks</div>
            </Card>

            <Card className="flex flex-col items-center justify-center p-4 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800/50">
                <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-800 text-orange-600 dark:text-orange-400 mb-2">
                    <Flame className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.longestStreak}</div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">Best Streak</div>
            </Card>

            <Card className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/50">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-400 mb-2">
                    <Trophy className="h-5 w-5" />
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-white truncate max-w-full px-2">{stats.bestDay || '-'}</div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">Best Day</div>
            </Card>
        </div>
    );
};

// --- Mood Correlation Card ---
export const MoodCorrelationCard: React.FC<{ data: MoodCorrelationData[] }> = ({ data }) => {
    // Sort by completion rate descending
    const sortedData = [...data].sort((a, b) => b.completionRate - a.completionRate);
    const bestMood = sortedData[0];
    
    const getMoodIcon = (mood: string) => {
        switch(mood) {
            case 'happy': return <Smile className="w-5 h-5 text-green-500" />;
            case 'motivated': return <Zap className="w-5 h-5 text-yellow-500" />;
            case 'neutral': return <Meh className="w-5 h-5 text-blue-500" />;
            case 'sad': return <Frown className="w-5 h-5 text-slate-400" />;
            case 'tired': return <Moon className="w-5 h-5 text-purple-500" />;
            default: return <Smile className="w-5 h-5 text-slate-400" />;
        }
    };

    const getMoodLabel = (mood: string) => {
        return mood.charAt(0).toUpperCase() + mood.slice(1);
    };

    return (
        <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-indigo-500" />
                        Mood & Performance
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">How your mood affects your habits</p>
                </div>
                
                {bestMood && bestMood.completionRate > 0 && (
                    <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                         <div className="p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                             <Sparkles className="w-4 h-4 text-indigo-500" />
                         </div>
                         <div className="text-sm">
                             <span className="block text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase">Power Mood</span>
                             <span className="font-semibold text-slate-900 dark:text-white">You're most productive when <span className="text-indigo-600 dark:text-indigo-400">{getMoodLabel(bestMood.mood)}</span></span>
                         </div>
                    </div>
                )}
            </div>

            {data.length === 0 ? (
                 <div className="text-center py-8 text-slate-400 flex flex-col items-center">
                     <BookOpen className="h-8 w-8 mb-2 opacity-50" />
                     <p>Log your mood in the journal to see insights here.</p>
                 </div>
            ) : (
                <div className="space-y-4">
                    {data.map((item) => (
                        <div key={item.mood} className="group">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 md:group-hover:scale-110 transition-transform">
                                    {getMoodIcon(item.mood)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">{getMoodLabel(item.mood)}</span>
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.completionRate}% completion</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className={cn(
                                                "h-full rounded-full transition-all duration-1000",
                                                item.completionRate >= 80 ? "bg-green-500" :
                                                item.completionRate >= 50 ? "bg-indigo-500" :
                                                "bg-orange-400"
                                            )}
                                            style={{ width: `${item.completionRate}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 italic">
                <AlertCircle className="w-3 h-3" />
                Based on journal entries and daily habit completion.
            </div>
        </Card>
    );
};

// --- Heatmap Grid Component (Reusable) ---
export const HeatmapGrid: React.FC<{ data: HeatmapData[] }> = ({ data }) => {
    // Determine max completions in a single day to normalize colors
    const maxCount = Math.max(...data.map(d => d.count), 1);
    
    // Helper to get color intensity
    const getColorClass = (count: number) => {
        if (count === 0) return "bg-slate-200 dark:bg-slate-700"; // Increased visibility for empty state
        const intensity = count / maxCount;
        if (intensity <= 0.25) return "bg-indigo-300 dark:bg-indigo-900";
        if (intensity <= 0.50) return "bg-indigo-400 dark:bg-indigo-800";
        if (intensity <= 0.75) return "bg-indigo-500 dark:bg-indigo-600";
        return "bg-indigo-600 dark:bg-indigo-500";
    };

    return (
        <div className="flex flex-wrap gap-1 md:gap-1.5 justify-start md:justify-center">
            {data.map((day) => (
                <div
                    key={day.date}
                    title={`${formatDate(day.date)}: ${day.count} habits`}
                    className={cn(
                        "w-3 h-3 md:w-4 md:h-4 rounded-sm transition-all md:hover:scale-125 cursor-default",
                        getColorClass(day.count)
                    )}
                />
            ))}
        </div>
    );
};

// --- Consistency Heatmap ---
export const ConsistencyHeatmap: React.FC<{ data: HeatmapData[] }> = ({ data }) => {
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-indigo-500" />
                        Consistency Heatmap
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Activity over the last 90 days</p>
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

// --- Habit Performance Chart ---
export const HabitPerformanceChart: React.FC<{ habits: Habit[] }> = ({ habits }) => {
    // Sort habits by completion count (descending)
    const sortedHabits = [...habits].sort((a, b) => b.completedDates.length - a.completedDates.length);
    const maxCompletions = sortedHabits[0]?.completedDates.length || 1;

    return (
        <Card className="p-6 h-full">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Habit Performance
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Ranking your habits by total completions</p>

            <div className="space-y-4">
                {sortedHabits.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 italic">No habits to display yet.</div>
                ) : (
                    sortedHabits.map((habit) => {
                        const percentage = Math.round((habit.completedDates.length / maxCompletions) * 100);
                        return (
                            <div key={habit.id} className="group">
                                <div className="flex justify-between text-sm font-medium mb-1">
                                    <span className="text-slate-700 dark:text-slate-300 truncate pr-4">{habit.name}</span>
                                    <span className="text-slate-500 dark:text-slate-400 tabular-nums">{habit.completedDates.length}</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                    <div 
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out md:group-hover:bg-indigo-600"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </Card>
    );
};

// --- Achievements Section ---
export const AchievementsSection: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => {
    return (
        <div>
             <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Medal className="h-5 w-5 text-indigo-500" />
                        Achievements
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Unlock badges by staying consistent.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {achievements.map((ach, index) => (
                    <div key={ach.id} className="animate-slide-up h-full" style={{ animationDelay: `${index * 30}ms`, opacity: 0 }}>
                        <Card 
                            className={cn(
                                "relative h-full overflow-hidden group p-4 border transition-all duration-300 ease-ios",
                                ach.isUnlocked 
                                    ? "bg-white dark:bg-slate-800 border-indigo-100 dark:border-slate-700 md:hover:shadow-lg md:hover:-translate-y-1" 
                                    : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-80"
                            )}
                        >
                            {ach.isUnlocked ? (
                                <div className="absolute top-0 right-0 p-1 bg-green-500 text-white rounded-bl-lg shadow-sm">
                                    <Check className="h-3 w-3" />
                                </div>
                            ) : (
                                 <div className="absolute top-0 right-0 p-1 bg-slate-200 dark:bg-slate-700 text-slate-400 rounded-bl-lg">
                                    <Lock className="h-3 w-3" />
                                </div>
                            )}

                            <div className="flex flex-col items-center text-center">
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform duration-300 md:group-hover:scale-110",
                                    ach.isUnlocked ? ach.color : "bg-slate-200 dark:bg-slate-700 text-slate-400 grayscale"
                                )}>
                                    <ach.icon className="h-6 w-6" />
                                </div>
                                <h4 className={cn("font-bold text-sm mb-1", ach.isUnlocked ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-500")}>
                                    {ach.title}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                                    {ach.description}
                                </p>
                                
                                {!ach.isUnlocked && (
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-3 overflow-hidden">
                                        <div 
                                            className="h-full bg-indigo-500 transition-all duration-1000"
                                            style={{ width: `${Math.min(ach.progress, 100)}%` }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- AI Report Modal ---
export const AIReportModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    report: string | null;
    isLoading: boolean;
    onGenerate: () => void;
}> = ({ isOpen, onClose, report, isLoading, onGenerate }) => {
    
    // Improved parser to handle multi-line content and headers properly
    const renderReport = () => {
        if (!report) return null;
        
        const lines = report.split('\n').filter(l => l.trim().length > 0);
        
        const sections: { title: string, content: string }[] = [];
        let currentSection: { title: string, content: string } | null = null;
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
             } else if (currentSection) {
                 // Append to current section
                 currentSection.content += (currentSection.content ? ' ' : '') + line.trim();
             } else {
                 // General text (intro/outro)
                 generalText.push(line);
             }
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
                             if (t.startsWith('##')) return <h2 key={i} className="text-lg font-bold text-slate-900 dark:text-white mt-2">{t.replace(/#/g, '')}</h2>;
                             if (t.startsWith('#')) return <h3 key={i} className="text-xl font-bold text-slate-900 dark:text-white mt-2">{t.replace(/#/g, '')}</h3>;
                             return <p key={i} className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t}</p>;
                        })}
                     </div>
                )}
                
                {/* Sections Grid */}
                <div className="space-y-4">
                    {sections.map((section, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-indigo-50 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 100}ms` }}>
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
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Ready to review your week?</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            Gemini will analyze your habits, streaks, and patterns to give you a personalized strategy for improvement.
                        </p>
                        <Button onClick={onGenerate} size="lg" className="w-full shadow-lg shadow-indigo-500/20">
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
                            <p className="font-semibold text-slate-900 dark:text-white">Analyzing your habits...</p>
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
                             <p className="text-indigo-100 text-sm">Based on your activity from the last 30 days.</p>
                         </div>
                         
                         {renderReport()}

                         <div className="mt-6 flex justify-end">
                             <Button variant="secondary" onClick={onClose}>Close</Button>
                         </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};