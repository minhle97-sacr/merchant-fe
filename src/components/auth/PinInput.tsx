import React from 'react';

interface PinInputProps {
  digits: string[];
  setDigits: (digits: string[]) => void;
  showPassword?: boolean;
}

export default function PinInput({ digits, setDigits, showPassword = false }: PinInputProps) {
  const handleChange = (value: string, index: number, e: any) => {
    const newVal = value.replace(/[^0-9]/g, '');
    const newDigits = [...digits];
    newDigits[index] = newVal;
    setDigits(newDigits);

    // Move focus to next input
    if (newVal && index < digits.length - 1) {
      const nextInput = e.target.nextElementSibling;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    // Handle backspace
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const prevInput = e.target.previousElementSibling;
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="flex gap-2 sm:gap-4 justify-center">
      {digits.map((digit, index) => (
        <input
          key={index}
          type={showPassword ? "text" : "password"}
          maxLength={1}
          value={digit}
          autoFocus={index === 0}
          onChange={(e) => handleChange(e.target.value, index, e)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-semibold border border-slate-200 rounded-xl bg-[#F9FAFB] focus:outline-none focus:border-[#D92D20] focus:ring-1 focus:ring-[#D92D20]"
        />
      ))}
    </div>
  );
}
