import React from 'react';
import { Input } from './Input';

interface TextFieldProps {
  label?: string;
  value: string;
  placeholder?: string;
  placeholderTextColor?: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  keyboardType?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
}

export default function TextField({
  label,
  value,
  placeholder,
  secureTextEntry,
  onChangeText,
  keyboardType,
  containerClassName = '',
  inputClassName = '',
  labelClassName = '',
}: TextFieldProps) {
  
  // Map keyboardType to web input type
  let inputType = 'text';
  if (secureTextEntry) {
    inputType = 'password';
  } else if (keyboardType === 'numeric' || keyboardType === 'number-pad') {
    inputType = 'number';
  } else if (keyboardType === 'email-address') {
    inputType = 'email';
  } else if (keyboardType === 'phone-pad') {
    inputType = 'tel';
  }

  return (
    <Input
      label={label}
      type={inputType}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChangeText(e.target.value)}
      className={inputClassName}
      containerClassName={containerClassName}
      labelClassName={labelClassName}
    />
  );
}
