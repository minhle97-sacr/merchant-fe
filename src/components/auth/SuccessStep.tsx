import React from 'react';

interface SuccessStepProps {
  timer: number;
}

export default function SuccessStep({ timer }: SuccessStepProps) {
  return (
    <div className="text-center py-10 animate-scaleIn">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold text-slate-900 mb-2">Registration Successful!</h3>
      <p className="text-slate-500">Redirecting to business setup...</p>
    </div>
  );
}
