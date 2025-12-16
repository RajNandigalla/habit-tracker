import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPreferences, ViewMode } from '../types';
import { preferencesRepository } from '../core/repositories/LocalPreferencesRepository';
import { audioManager } from '../utils';

interface PreferencesContextType {
  preferences: UserPreferences;
  toggleDarkMode: () => void;
  toggleSound: () => void;
  setViewMode: (mode: ViewMode) => void;
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
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrefs = async () => {
      const loaded = (await preferencesRepository.getPreferences()) || {
        darkMode: false,
        viewMode: 'list',
        soundEnabled: true,
      };
      setPreferences(loaded);
      setLoading(false);

      // Apply initial dark mode and sound settings
      const html = document.documentElement;
      if (loaded.darkMode) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      audioManager.setEnabled(loaded.soundEnabled);
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

    setTimeout(() => {
      root.classList.remove('disable-transitions');
    }, 1000);
  };

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

  if (loading) return null;

  return (
    <PreferencesContext.Provider value={{ preferences, toggleDarkMode, toggleSound, setViewMode }}>
      {children}
    </PreferencesContext.Provider>
  );
};
