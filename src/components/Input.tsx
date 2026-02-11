import React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    labelClassName?: string;
    containerClassName?: string;
    error?: string;
    multiline?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
  };

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, labelClassName = '', containerClassName = '', error, className = '', multiline, startIcon, endIcon, ...props }, ref) => {
    const Component = multiline ? 'textarea' : 'input';
    const baseStyles = `w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all bg-white text-base disabled:bg-gray-50 disabled:cursor-not-allowed placeholder:text-gray-400 ${
      error ? 'border-red-500 focus:ring-red-50' : ''
    } ${startIcon ? 'pl-12' : ''} ${endIcon ? 'pr-12' : ''} ${multiline ? 'resize-none' : ''} ${className}`;

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <LabelPrimitive.Root
            className={`text-sm font-semibold text-gray-700 ml-1 block ${labelClassName}`}
          >
            {label}
          </LabelPrimitive.Root>
        )}
        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-4 flex items-center justify-center pointer-events-none text-gray-400">
              {startIcon}
            </div>
          )}
          {multiline ? (
            <textarea
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
              className={baseStyles}
            />
          ) : (
            <input
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              className={baseStyles}
            />
          )}
          {endIcon && (
            <div className="absolute right-4 flex items-center justify-center pointer-events-none text-gray-400">
              {endIcon}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-red-500 ml-1 mt-1 font-mediumm">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
