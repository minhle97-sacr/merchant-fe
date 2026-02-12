"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useLoginMutation, useCheckIdentity, useSignupInit, useSignupVerify, useSignupComplete, useGetSSOTokenMutation } from '@/services/api';
import AuthSidePanel from '@/components/AuthSidePanel';
import { toast } from 'sonner';

// Refactored Step Components
import IdentifierStep from '@/components/auth/IdentifierStep';
import LoginPinStep from '@/components/auth/LoginPinStep';
import SignupOtpStep from '@/components/auth/SignupOtpStep';
import SignupProfileStep from '@/components/auth/SignupProfileStep';
import SuccessStep from '@/components/auth/SuccessStep';
import { Checkbox } from '@/components/Checkbox';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Head from 'next/head';
import Logo from '@/components/Logo';

export default function LoginScreen() {
  const searchParams = useSearchParams()
  const redirect_uri = searchParams.get('redirect_uri');
  const { completeAuth } = useAuth();

  const [step, setStep] = useState<'IDENTIFIER' | 'PIN' | 'SIGNUP_OTP' | 'SIGNUP_PIN' | 'SUCCESS'>('IDENTIFIER');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [pinDigits, setPinDigits] = useState(['', '', '', '', '', '']);
  const [rePinDigits, setRePinDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(59);

  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Timer Effects for OTP
  useEffect(() => {
    let interval: any = null;
    if (step === 'SIGNUP_OTP' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, otpTimer]);

  // Mutations
  const loginMutation = useLoginMutation();
  const checkIdentityMutation = useCheckIdentity();
  const initSignupMutation = useSignupInit();
  const verifyOtpMutation = useSignupVerify();
  const completeSignupMutation = useSignupComplete();


  // Identifier validation function (Phone)
  const validateIdentifier = (value: string) => {
    const phoneRegex = /^[0-9]{10,15}$/; // Flexible phone length

    if (!value.trim()) {
      setIdentifierError('Phone number is required');
      return false;
    }

    if (!phoneRegex.test(value.replace(/\D/g, ''))) {
      setIdentifierError('Please enter a valid phone number');
      return false;
    }

    setIdentifierError('');
    return true;
  };

  // Password validation function
  const validatePassword = (passwordValue: string) => {
    if (!passwordValue.trim()) {
      setPasswordError('PIN is required');
      return false;
    }
    if (passwordValue.length !== 6) {
      setPasswordError('PIN must be exactly 6 digits');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleContinue = () => {
    const isIdentifierValid = validateIdentifier(identifier);
    if (isIdentifierValid) {
      setLoginError('');
      checkIdentityMutation.mutate(identifier, {
        onSuccess: (data: any) => {
          if (data.exists) {
            setStep('PIN');
          } else {
            // User doesn't exist, initiate signup
            initSignupMutation.mutate(identifier, {
              onSuccess: (signupData: any) => {
                setStep('SIGNUP_OTP');
                setOtpTimer(59);
                // if (signupData.data.otp) {
                //   toast.success(`OTP Sent: ${signupData.data.otp}`);
                // }
              },
              onError: (error: any) => {
                const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to start registration. Please try again.';
                setLoginError(errorMessage);
                toast.error(errorMessage);
              }
            });
          }
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Check failed. Please try again.';
          setLoginError(errorMessage);
          toast.error(errorMessage);
        }
      });
    }
  };

  const handleVerifyOtp = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      verifyOtpMutation.mutate(
        { identifier, otp: otpCode },
        {
          onSuccess: () => {
            setStep('SIGNUP_PIN');
            setOtpError('');
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Invalid OTP. Please try again.';
            setOtpError(errorMessage);
            toast.error(errorMessage);
          },
        }
      );
    }
  };

  const handleCompleteSignup = () => {
    const pin = pinDigits.join('');
    const rePin = rePinDigits.join('');
    if (pin.length >= 6 && pin === rePin) {
      setLoginError('');
      completeSignupMutation.mutate(
        {
          identifier,
          pinCode: pin,
        },
        {
          onSuccess: async (data: any) => {
            setStep('SUCCESS');
            if (!redirect_uri) {
              toast.success('Registration completed successfully!');
            } else {
              toast.info('Redirecting to external application...');
            }
            completeAuth(data.data.user, data.data.access_token, keepSignedIn);
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Registration failed.';
            setLoginError(errorMessage);
            toast.error(errorMessage);
          },
        }
      );
    }
  };

  const handleSignIn = useCallback(async (pinOverride?: string) => {
    const pinToUse = pinOverride || pinDigits.join('');
    const isIdentifierValid = validateIdentifier(identifier);
    const isPasswordValid = validatePassword(pinToUse);
    if (isIdentifierValid && isPasswordValid) {

      setLoginError('');
      try {
        const response = await loginMutation.mutateAsync({ phone: identifier, pinCode: pinToUse });
        console.log('Login success:', response);
        completeAuth(response.data.user, response.data.access_token, keepSignedIn);
        if (redirect_uri) {
          toast.info('Redirecting to external application...');
        }
      } catch (error: any) {
        console.log('Login error in component:', error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Login failed. Please try again.';
        setLoginError(errorMessage);
        setStep('PIN');
        setPinDigits(['', '', '', '', '', '']); // Clear PIN to allow retry
        setIsLoading(false);
      }
    }
  }, [pinDigits, identifier, loginMutation, completeAuth, keepSignedIn, redirect_uri]);

  useEffect(() => {
    const pin = pinDigits.join('');
    if (step === 'PIN' && pin.length === 6 && !isLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
      handleSignIn(pin);
    }
  }, [handleSignIn, pinDigits, step, isLoading]);

  const isSubmitDisabled =
    (step === 'IDENTIFIER' && (!identifier || !!identifierError || checkIdentityMutation.isPending)) ||
    (step === 'PIN' && (pinDigits.join('').length !== 6 || loginMutation.isPending)) ||
    (step === 'SIGNUP_OTP' && (otp.join('').length < 6 || verifyOtpMutation.isPending)) ||
    (step === 'SIGNUP_PIN' && (pinDigits.join('').length !== 6 || pinDigits.join('') !== rePinDigits.join('') || completeSignupMutation.isPending));


  return (
    <div className="min-h-screen flex  bg-slate-50 lg:bg-white">
      <Head>
        <title>Login | Redtab</title>
        <meta name="description" content="Login to your Redtab account to manage your dashboard and settings." />
      </Head>
      {/* Left Side - Branding (Shared Component) */}
      <AuthSidePanel
        title="Grow your business with our on-demand financing"
        subtitle={
          <>
            From hotels, restaurants to shops, Redtab provides flexible cashflow solutions for your purchases, salaries, rent.
            <br />
            No collateral, no bank queues, installments according to your choice — daily or weekly.
          </>
        }
      />

      {/* Right Side - Login Form (Full width on mobile/tablet) */}
      <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full lg:max-w-lg bg-white rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className='bg-white rounded-lg p-2'>
              <Logo width={100} height={28} />
            </div>
            <div className='text-xl font-mediumm'>
              Merchant
            </div>
          </div>

          <div className="mb-8 sm:mb-10 text-center sm:text-left">
            <h2 className="text-3xl sm:text-[2.5rem] font-semibold text-slate-900 mb-2">
              {step === 'IDENTIFIER' ? 'Welcome Back' :
                step === 'PIN' ? 'Enter PIN' :
                  step === 'SIGNUP_OTP' ? 'Verify identity' :
                    step === 'SIGNUP_PIN' ? 'Complete profile' :
                      'Welcome to Redtab'}
            </h2>
            <div className="text-slate-500 text-base sm:text-lg">
              {step === 'IDENTIFIER'
                ? 'Sign in or Sign up to your dashboard'
                : step === 'PIN'
                  ? `Enter PIN for ${identifier}`
                  : step === 'SIGNUP_OTP'
                    ? <>
                      <p className='inline'>We&apos;ve sent a code to {identifier}</p>
                      <p className='inline font-mediumm ml-2 hover:underline text-primary cursor-pointer' onClick={() => {
                        setStep('IDENTIFIER');
                        setPinDigits(['', '', '', '', '', '']);
                      }}>Change</p>
                    </>
                    : step === 'SIGNUP_PIN'
                      ? 'Set up your name and secure PIN'
                      : 'Your account has been created!'}
            </div>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (step === 'IDENTIFIER') handleContinue();
            else if (step === 'PIN') handleSignIn();
            else if (step === 'SIGNUP_OTP') handleVerifyOtp();
            else if (step === 'SIGNUP_PIN') handleCompleteSignup();
          }} className="space-y-6">
            {step === 'SUCCESS' ? (
              <SuccessStep timer={0} />
            ) : (
              <>
                {step === 'IDENTIFIER' && (
                  <IdentifierStep
                    identifier={identifier}
                    setIdentifier={(val) => {
                      setIdentifier(val);
                      if (identifierError) validateIdentifier(val);
                    }}
                    error={identifierError}
                    onBlur={() => identifier && validateIdentifier(identifier)}
                    isPending={checkIdentityMutation.isPending}
                  />
                )}

                {step === 'PIN' && (
                  <LoginPinStep
                    pinDigits={pinDigits}
                    setPinDigits={setPinDigits}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    error={passwordError}
                    onBack={() => {
                      setStep('IDENTIFIER');
                      setPinDigits(['', '', '', '', '', '']);
                    }}
                  />
                )}

                {step === 'SIGNUP_OTP' && (
                  <SignupOtpStep
                    otp={otp}
                    setOtp={setOtp}
                    error={otpError}
                    timer={otpTimer}
                    onResend={() => {
                      setOtp(['', '', '', '', '', ''])
                      setOtpTimer(59)
                      handleContinue();
                    }}
                    onBack={() => {
                      setStep('IDENTIFIER');
                      setPinDigits(['', '', '', '', '', '']);
                    }}
                  />
                )}

                {step === 'SIGNUP_PIN' && (
                  <SignupProfileStep
                    pinDigits={pinDigits}
                    setPinDigits={setPinDigits}
                    rePinDigits={rePinDigits}
                    setRePinDigits={setRePinDigits}
                  />
                )}

                {/* Common Actions */}
                {(step === 'IDENTIFIER' || step === 'PIN') && (
                  <Checkbox
                    id="keep-signed-in"
                    checked={keepSignedIn}
                    onCheckedChange={(checked) => setKeepSignedIn(checked === true)}
                    label="Keep me signed in"
                    labelClassName="text-[0.95rem] font-mediumm text-slate-600 cursor-pointer"
                  />
                )}

                {loginError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-700">{loginError}</p>
                  </div>
                )}

                {step !== 'PIN' && (
                  <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className={`w-full font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-lg ${!isSubmitDisabled
                      ? 'bg-[#EA4335] text-white hover:bg-[#D92D20] shadow-[0_8px_20px_rgba(234,67,53,0.15)] active:scale-[0.98]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
                      }`}
                  >
                    {(loginMutation.isPending || checkIdentityMutation.isPending || initSignupMutation.isPending || verifyOtpMutation.isPending || completeSignupMutation.isPending) ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      step === 'IDENTIFIER' ? 'Continue' :
                        step === 'SIGNUP_OTP' ? 'Verify OTP' :
                          'Complete Registration'
                    )}
                  </button>
                )}

                {step === 'PIN' && loginMutation.isPending && (
                  <div className="flex justify-center py-4">
                    <div className="w-8 h-8 border-4 border-[#EA4335] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </>
            )}
          </form>

          {/* Footer */}
          <div className="hidden mt-12 text-center text-slate-500 font-mediumm">
            Need help? <button className="text-red-600 font-semibold hover:underline">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
}
