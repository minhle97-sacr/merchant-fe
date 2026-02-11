import React from 'react';
import PinInput from './PinInput';

interface SignupProfileStepProps {
  pinDigits: string[];
  setPinDigits: (digits: string[]) => void;
  rePinDigits: string[];
  setRePinDigits: (digits: string[]) => void;
}

export default function SignupProfileStep({
  pinDigits,
  setPinDigits,
  rePinDigits,
  setRePinDigits
}: SignupProfileStepProps) {
  return (
    <div className="animate-scaleIn space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Set 6-Digit PIN</label>
        <PinInput digits={pinDigits} setDigits={setPinDigits} />
      </div>

     {pinDigits.join("").length == 6 && <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Confirm PIN</label>
        <PinInput digits={rePinDigits} setDigits={setRePinDigits} />
      </div>}
    </div>
  );
}
