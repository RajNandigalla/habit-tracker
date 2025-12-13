import React from 'react';

// Added named export
export const SettingsRow: React.FC<{
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
  disabled?: boolean;
}> = ({ icon: Icon, title, description, children, disabled = false }) => (
  <div
    className={`flex items-center justify-between gap-4 py-4 transition-opacity ${disabled ? 'opacity-50' : 'opacity-100'}`}
  >
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
        <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-base text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

export default SettingsRow;
