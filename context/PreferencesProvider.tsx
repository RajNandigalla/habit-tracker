import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPreferences, ViewMode } from '../types';
import { preferencesRepository } from '../core/repositories/LocalPreferencesRepository';
import { audioManager } from '../utils';
import { useTimeout } from 'usehooks-ts';

interface PreferencesContextType {
  preferences: UserPreferences;
  toggleDarkMode: () => void;
  toggleSound: () => void;
  setViewMode: (mode: ViewMode) => void;
  setFontSize: (size: number) => void;
  toggleMobileBottomNav: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within PreferencesProvider');
  return context;
};

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    darkMode: false,
    viewMode: 'list',
    soundEnabled: true,
    fontSize: 14.5,
    useMobileBottomNav: true,
  });
  const [loading, setLoading] = useState(true);
  const [isTogglingTheme, setIsTogglingTheme] = useState(false);

  const applyFontSize = (size: number) => {
    document.documentElement.style.fontSize = `${size}px`;
  };

  useEffect(() => {
    const loadPrefs = async () => {
      const loaded = (await preferencesRepository.getPreferences()) || {
        darkMode: false,
        viewMode: 'list',
        soundEnabled: true,
        fontSize: 14.5,
        useMobileBottomNav: true,
      };

      const merged: UserPreferences = {
        darkMode: false,
        viewMode: 'list',
        soundEnabled: true,
        fontSize: 14.5,
        useMobileBottomNav: true,
        ...loaded,
      };

      setPreferences(merged);
      setLoading(false);

      // Apply initial preferences
      const html = document.documentElement;
      if (merged.darkMode) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      audioManager.setEnabled(merged.soundEnabled);
      applyFontSize(merged.fontSize);
    };
    loadPrefs();
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    root.classList.add('disable-transitions');

    const newPrefs = { ...preferences, darkMode: !preferences.darkMode };
    setPreferences(newPrefs);

    // Apply dark mode
    const html = document.documentElement;
    if (newPrefs.darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    audioManager.setEnabled(newPrefs.soundEnabled);
    preferencesRepository.savePreferences(newPrefs);

    setIsTogglingTheme(true);
  };

  // Re-enable transitions after theme change
  useTimeout(
    () => {
      if (isTogglingTheme) {
        document.documentElement.classList.remove('disable-transitions');
        setIsTogglingTheme(false);
      }
    },
    isTogglingTheme ? 1000 : null
  );

  const toggleSound = () => {
    const newPrefs = { ...preferences, soundEnabled: !preferences.soundEnabled };
    setPreferences(newPrefs);
    audioManager.setEnabled(newPrefs.soundEnabled);
    preferencesRepository.savePreferences(newPrefs);
  };

  const setViewMode = (mode: ViewMode) => {
    const newPrefs = { ...preferences, viewMode: mode };
    setPreferences(newPrefs);
    preferencesRepository.savePreferences(newPrefs);
  };

  const setFontSize = (size: number) => {
    const newPrefs = { ...preferences, fontSize: size };
    setPreferences(newPrefs);
    applyFontSize(size);
    preferencesRepository.savePreferences(newPrefs);
  };

  const toggleMobileBottomNav = () => {
    const newPrefs = { ...preferences, useMobileBottomNav: !preferences.useMobileBottomNav };
    setPreferences(newPrefs);
    preferencesRepository.savePreferences(newPrefs);
  };

  if (loading) return null;

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        toggleDarkMode,
        toggleSound,
        setViewMode,
        setFontSize,
        toggleMobileBottomNav,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};
