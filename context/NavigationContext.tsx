import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationContextType {
  isSideMenuOpen: boolean;
  openSideMenu: () => void;
  closeSideMenu: () => void;
  toggleSideMenu: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const location = useLocation();

  // Close side menu whenever route changes
  useEffect(() => {
    setIsSideMenuOpen(false);
  }, [location]);

  const openSideMenu = () => setIsSideMenuOpen(true);
  const closeSideMenu = () => setIsSideMenuOpen(false);
  const toggleSideMenu = () => setIsSideMenuOpen(prev => !prev);

  return (
    <NavigationContext.Provider
      value={{ isSideMenuOpen, openSideMenu, closeSideMenu, toggleSideMenu }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
