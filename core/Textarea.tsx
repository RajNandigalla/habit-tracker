import React, { forwardRef, useId } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ id: providedId, label, error, containerClassName = '', required, ...props }, ref) => {
    const autoId = useId();
    const id = providedId || autoId;
    const errorId = error ? `${id}-error` : undefined;

    const baseClasses =
      'w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-100 transition-colors duration-200';
    const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';
    const labelClasses = 'block text-base font-medium text-slate-700 dark:text-slate-300 mb-2';

    return (
      <div className={containerClassName}>
        {label && (
          <label htmlFor={id} className={labelClasses}>
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          rows={3}
          className={`${baseClasses} ${errorClasses}`}
          aria-required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId}
          {...props}
          required={required}
        />
        {error && (
          <p id={errorId} role="alert" className="text-red-500 text-base mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
