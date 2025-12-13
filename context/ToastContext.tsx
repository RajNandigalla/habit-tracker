// Fix: Import 'useMemo' from 'react' to resolve reference error.
import React, { createContext, useState, useCallback, useContext, ReactNode, useMemo } from 'react';
import ReactDOM from 'react-dom';

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const InformationCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
    />
  </svg>
);

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const Toast: React.FC<{ toast: ToastMessage; onDismiss: (id: number) => void }> = ({
  toast,
  onDismiss,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isActive, setIsActive] = useState(false);

  React.useEffect(() => {
    // Trigger the "enter" animation shortly after mounting
    const enterTimer = setTimeout(() => setIsActive(true), 50);
    return () => clearTimeout(enterTimer);
  }, []);

  React.useEffect(() => {
    // Trigger the "exit" animation after a delay
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 300); // Duration should match transition
    }, 4000);

    return () => clearTimeout(exitTimer);
  }, [toast.id, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  const typeClasses = {
    success: 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700/50',
    error: 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-700/50',
    info: 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700/50',
  };

  const iconClasses = {
    success: 'text-green-500 dark:text-green-400',
    error: 'text-red-500 dark:text-red-400',
    info: 'text-blue-500 dark:text-blue-400',
  };

  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon,
  };
  const Icon = icons[toast.type];

  // Define animation states
  const transitionClasses =
    isActive && !isExiting
      ? // On-screen state
        'opacity-100 translate-y-0 md:translate-x-0'
      : // Off-screen state (for both initial and exit)
        'opacity-0 translate-y-full md:translate-y-0 md:translate-x-full';

  return (
    <div
      className={`w-full max-w-sm p-4 rounded-xl shadow-lg border flex items-start gap-3 transition-all duration-300 ease-in-out ${typeClasses[toast.type]} ${transitionClasses}`}
      role="alert"
    >
      <div className={`flex-shrink-0 ${iconClasses[toast.type]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="flex-grow text-base font-medium text-slate-800 dark:text-slate-200">
        {toast.message}
      </p>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 -m-1 rounded-full text-slate-400 hover:bg-black/10 dark:hover:bg-white/10"
        aria-label="Dismiss"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

const ToastContainer: React.FC<{ toasts: ToastMessage[]; removeToast: (id: number) => void }> = ({
  toasts,
  removeToast,
}) => {
  return ReactDOM.createPortal(
    <div className="fixed bottom-20 left-4 right-4 z-[100] flex flex-col items-center space-y-3 md:items-end md:top-4 md:right-4 md:bottom-auto md:left-auto md:w-full md:max-w-sm">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>,
    document.body
  );
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    setToasts(prevToasts => [...prevToasts, { id: Date.now(), message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
