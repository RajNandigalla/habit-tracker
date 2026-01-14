import React from 'react';
import { HashRouter } from 'react-router-dom';
import { StoreProvider } from './context/Store';
import { ToastProvider } from './context/ToastContext';
import { NavigationProvider } from './context/NavigationContext';
import { MainLayout } from './modules/layout';

const App: React.FC = () => {
  return (
    <HashRouter>
      <ToastProvider>
        <StoreProvider>
          <NavigationProvider>
            <div
              id="aria-live-announcer"
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            />
            <MainLayout />
          </NavigationProvider>
        </StoreProvider>
      </ToastProvider>
    </HashRouter>
  );
};

export default App;
