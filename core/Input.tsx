import React, { forwardRef, useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: providedId,
      label,
      error,
      containerClassName = '',
      leftIcon,
      rightIcon,
      className,
      required,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const id = providedId || autoId;
    const errorId = error ? `${id}-error` : undefined;

    const baseClasses =
      'w-full py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-colors duration-200';
    const paddingClasses = `${leftIcon ? 'pl-10' : 'pl-3'} ${rightIcon ? 'pr-10' : 'pr-3'}`;
    const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';
    const labelClasses = 'block text-base font-medium text-slate-700 dark:text-slate-300 mb-2';

    const inputElement = (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={id}
          ref={ref}
          className={`${baseClasses} ${paddingClasses} ${errorClasses} ${className || ''}`}
          aria-required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId}
          {...props}
          required={required}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
    );

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
        {inputElement}
        {error && (
          <p id={errorId} role="alert" className="text-red-500 text-base mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
