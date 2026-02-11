import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
}

export default function PrimaryButton({ title, onPress, disabled, className = '' }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.8}
      disabled={disabled}
      className={`${className} py-4 rounded-[28px] items-center justify-center ${disabled ? 'bg-gray-300' : 'bg-primary'}`}
    >
      <Text className={`${disabled ? 'text-gray-400' : 'text-white'} text-lg font-semibold`}>{title}</Text>
    </TouchableOpacity>
  );
}
