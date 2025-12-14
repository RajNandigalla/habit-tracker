import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ id, label, error, containerClassName = '', ...props }, ref) => {
    const baseClasses =
      'w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-100 transition-colors duration-200';
    const labelClasses = 'block text-base font-medium text-slate-700 dark:text-slate-300 mb-2';

    return (
      <div className={containerClassName}>
        {label && (
          <label htmlFor={id} className={labelClasses}>
            {label}
          </label>
        )}
        <textarea id={id} ref={ref} rows={3} className={baseClasses} {...props} />
        {error && <p className="text-red-500 text-base mt-1">{error}</p>}
      </div>
    );
  }
);

export default Textarea;
