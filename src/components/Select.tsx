import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Icon } from './Icon';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: (SelectOption | string)[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  labelClassName?: string;
  error?: string;
}

export const Select = ({
  value,
  onValueChange,
  options,
  placeholder = 'Select an option...',
  label,
  disabled,
  className = '',
  triggerClassName = '',
  labelClassName = '',
  error
}: SelectProps) => {
  const getDisplayValue = () => {
    const selected = options.find(opt => 
      typeof opt === 'string' ? opt === value : opt.value === value
    );
    if (!selected) return value || placeholder;
    return typeof selected === 'string' ? selected : selected.label;
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className={labelClassName || "text-sm font-semibold text-gray-700 ml-1 block"}>
          {label}
        </label>
      )}
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          className={`w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all bg-white text-base flex items-center justify-between group disabled:bg-gray-50 disabled:cursor-not-allowed ${error ? 'border-red-500 focus:ring-red-50' : ''} ${triggerClassName}`}
        >
          <SelectPrimitive.Value placeholder={placeholder}>
            <span className={!value ? 'text-gray-400' : 'text-gray-900'}>
              {getDisplayValue()}
            </span>
          </SelectPrimitive.Value>
          <SelectPrimitive.Icon className="text-gray-400 group-hover:text-primary transition-colors">
            <Icon name="chevron-down" size={18} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 z-[100] min-w-[var(--radix-select-trigger-width)]"
            position="popper"
            sideOffset={5}
          >
            <SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-8 bg-white text-gray-400 cursor-default">
              <Icon name="chevron-up" size={16} />
            </SelectPrimitive.ScrollUpButton>
            
            <SelectPrimitive.Viewport className="p-2">
              {options.map((option, index) => {
                const optValue = typeof option === 'string' ? option : option.value;
                const optLabel = typeof option === 'string' ? option : option.label;
                
                return (
                  <SelectPrimitive.Item
                    key={`${optValue}-${index}`}
                    value={optValue}
                    className="relative flex items-center px-8 py-3 rounded-xl text-sm font-mediumm text-gray-700 cursor-pointer outline-none hover:bg-primary/5 focus:bg-primary/5 data-[state=checked]:text-primary data-[state=checked]:bg-primary/5 transition-colors"
                  >
                    <SelectPrimitive.ItemText>{optLabel}</SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator className="absolute left-2 flex items-center justify-center text-primary">
                      <Icon name="check" size={16} />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                );
              })}
            </SelectPrimitive.Viewport>

            <SelectPrimitive.ScrollDownButton className="flex items-center justify-center h-8 bg-white text-gray-400 cursor-default">
              <Icon name="chevron-down" size={16} />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && <span className="text-xs text-red-500 ml-1 mt-1 font-mediumm">{error}</span>}
    </div>
  );
};
