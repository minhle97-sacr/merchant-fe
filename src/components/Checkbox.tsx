import React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Icon } from './Icon';

interface CheckboxProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean | 'indeterminate') => void;
  label?: string | React.ReactNode;
  disabled?: boolean;
  className?: string;
  checkboxClassName?: string;
  labelClassName?: string;
}

export const Checkbox = ({ 
  id, 
  checked, 
  onCheckedChange, 
  label, 
  disabled, 
  className = '',
  checkboxClassName = '',
  labelClassName = 'text-sm font-semibold text-gray-700 cursor-pointer select-none'
}: CheckboxProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <CheckboxPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={`flex h-6 w-6 appearance-none items-center justify-center rounded-lg border-2 border-gray-300 bg-white outline-none focus:ring-2 focus:ring-primary/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${checkboxClassName}`}
      >
        <CheckboxPrimitive.Indicator className="text-white flex items-center justify-center">
            <Icon className='text-white' name="check" size={16} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label
          className={labelClassName}
          htmlFor={id}
        >
          {label}
        </label>
      )}
    </div>
  );
};
