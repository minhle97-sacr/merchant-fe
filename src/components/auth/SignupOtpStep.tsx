import React from 'react';
import PinInput from './PinInput';

interface SignupOtpStepProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
  error: string;
  timer: number;
  onResend: () => void;
  onBack: () => void;
}

export default function SignupOtpStep({
  otp,
  setOtp,
  error,
  timer,
  onResend,
  onBack
}: SignupOtpStepProps) {
  return (
    <div className="animate-scaleIn space-y-6">
      <PinInput digits={otp} setDigits={setOtp} showPassword={true} />

      {error && <p className="text-red-500 text-sm text-center font-mediumm">{error}</p>}

      <div className="text-center">
        {timer > 0 ? (
          <p className="text-slate-400 text-sm font-mediumm">
            Resend OTP in <span className="text-slate-900 font-semibold">{timer}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={onResend}
            className="text-[#EA4335] text-sm font-semibold hover:underline"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}
