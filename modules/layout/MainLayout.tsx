import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useNavigation } from '../../context/NavigationContext';
import { useStore } from '../../context/Store';
import { Dashboard } from '../../pages/Dashboard';
import { Journal } from '../../pages/Journal';
import { Settings } from '../../pages/Settings';
import { Progress } from '../../pages/Progress';
import { Challenges } from '../../pages/Challenges';
import { Achievements } from '../../pages/Achievements';
import {
  ListTodo,
  BookText,
  Settings2,
  Activity,
  X,
  BarChartBigIcon,
  Swords,
  Trophy,
  QuoteIcon,
} from 'lucide-react';
import { SideMenu, Container } from '../../core';
import { Header } from '../Header';
import { NavItem } from './NavItem';

export const MainLayout: React.FC = () => {
  const { isSideMenuOpen, closeSideMenu } = useNavigation();
  const { preferences, toggleDarkMode } = useStore();

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Global Header */}
      <Header
        className="sticky top-0"
        darkMode={preferences.darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <Container className="flex flex-1 relative px-0 sm:px-0 md:px-0 max-w-none md:max-w-none lg:max-w-7xl lg:px-8">
        {/* Desktop Floating Sidebar - Height fit content */}
        <aside className="hidden md:flex w-72 flex-col m-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none z-20 h-fit sticky top-24 shrink-0 no-scrollbar">
          <nav className="flex-1 px-4 space-y-2 py-4">
            <NavItem to="/" icon={<ListTodo />} label="Habits" />
            <NavItem to="/challenges" icon={<Swords />} label="Challenges" />
            <NavItem to="/achievements" icon={<Trophy />} label="Achievements" />
            <NavItem to="/journal" icon={<BookText />} label="Journal" />
            <NavItem to="/progress" icon={<BarChartBigIcon />} label="Progress" />
            <NavItem to="/settings" icon={<Settings2 />} label="Settings" />
          </nav>

          <div className="relative mx-4 mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-5 text-white shadow-lg shadow-indigo-500/20">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-2 -ml-2 h-16 w-16 rounded-full bg-black/10 blur-xl"></div>

            <div className="relative z-10">
              <div className="mb-3 flex items-center gap-2 text-indigo-100">
                <QuoteIcon className="h-4 w-4 opacity-80" />
                <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                  Daily Wisdom
                </span>
              </div>

              <blockquote className="font-serif text-sm leading-relaxed italic text-white/95">
                "Consistency is what transforms average into excellence."
              </blockquote>
            </div>
          </div>
        </aside>

        {/* Mobile Side Menu */}
        <SideMenu isOpen={isSideMenuOpen} onClose={closeSideMenu}>
          <div className="flex flex-col h-full bg-white dark:bg-slate-900">
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
                  <Activity className="h-4 w-4" />
                </div>
                <span className="text-md font-extrabold text-slate-900 dark:text-white">
                  TickOff
                </span>
              </div>
              <button
                onClick={closeSideMenu}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-6">
              <NavItem to="/" icon={<ListTodo />} label="Habits" onClick={closeSideMenu} />
              <NavItem
                to="/challenges"
                icon={<Swords />}
                label="Challenges"
                onClick={closeSideMenu}
              />
              <NavItem
                to="/achievements"
                icon={<Trophy />}
                label="Achievements"
                onClick={closeSideMenu}
              />
              <NavItem to="/journal" icon={<BookText />} label="Journal" onClick={closeSideMenu} />
              <NavItem
                to="/progress"
                icon={<BarChartBigIcon />}
                label="Progress"
                onClick={closeSideMenu}
              />
              <NavItem
                to="/settings"
                icon={<Settings2 />}
                label="Settings"
                onClick={closeSideMenu}
              />
            </nav>

            <div className="p-5 mt-auto border-t border-slate-100 dark:border-slate-800">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                  Daily Quote
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic font-serif leading-relaxed">
                  "Consistency is what transforms average into excellence."
                </p>
              </div>
            </div>
          </div>
        </SideMenu>

        {/* Main Content Area - Full width/height, no margins */}
        <div className="flex-1 min-w-0 flex flex-col min-h-full relative">
          <div className="flex-1 w-full h-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </Container>
    </div>
  );
};
