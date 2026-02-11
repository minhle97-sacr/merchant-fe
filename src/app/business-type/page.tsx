'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
const Image = (props: any) => <img {...props} />;
import { Logo } from '@assets/icons';
import { useCreateMerchantMutation } from '@/services/api';
import { toast } from 'sonner';
import { OPERATIONAL_CATEGORIES } from '@/utils/constants';

export default function BusinessTypeSelectionScreen() {
    return (
        <ProtectedRoute>
            <BusinessTypeContent />
        </ProtectedRoute>
    );
}

function BusinessTypeContent() {
    const router = useRouter();
    const { logout, refreshProfile } = useAuth();
    const [step, setStep] = useState<1 | 2>(1);
    const [businessCategory, setBusinessCategory] = useState('');
    const [operationalCategory, setOperationalCategory] = useState('');

    const createMerchant = useCreateMerchantMutation();

    const handleContinue = async () => {
        try {
            await createMerchant.mutateAsync({ 
                name: '', 
                address: '', 
                outletName: '', 
                outletAddress: '',
                businessCategory,
                operationalCategory
            });
            await refreshProfile();
            setStep(2);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to create merchant');
        }
    };

    const handleVerifyNow = () => {
        router.push('/kyc');
    };

    const handleSkip = () => {
        router.replace('/dashboard');
    };

    const handleBack = () => {
        if (step === 2) setStep(1);
    };

    // Show Verify Business Screen (Step 2)
    if (step === 2) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                {/* Header */}
                <header className="bg-white px-8 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 text-2xl cursor-pointer">
                            ←
                        </button>
                        <Image
                            source={Logo}
                            contentFit="contain"
                            style={{ width: 100, height: 28 }}
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="text-gray-500 font-semibold hover:underline">Help</button>
                        <button
                            onClick={logout}
                            className="text-red-500 font-semibold hover:underline border border-red-200 px-4 py-1.5 rounded-full hover:bg-red-50 transition"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex items-center justify-center px-4 py-12">
                    <div className="max-w-md w-full text-center">
                        {/* Lock Icon - Using SVG for matched look */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 relative">
                                <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M85 50V40C85 26.1929 73.8071 15 60 15C46.1929 15 35 26.1929 35 40V50" stroke="#9095A1" strokeWidth="8" strokeLinecap="round"/>
                                    <rect x="25" y="45" width="70" height="55" rx="8" fill="#BCC1CA"/>
                                    <rect x="30" y="50" width="60" height="45" rx="6" fill="#9095A1"/>
                                    <circle cx="60" cy="72" r="4" fill="white"/>
                                    <rect x="58" y="72" width="4" height="10" fill="white"/>
                                </svg>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900 leading-tight">Unlock Higher Credit Limits</h1>
                        
                        {/* Description */}
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
                            Complete your KYC verification now to access higher credit limits,
                            extended payment terms, and exclusive marketplace offers.
                        </p>

                        {/* Why Verify Box */}
                        <div className="bg-white px-3 mb-8 text-left">
                            <h3 className="text-lg font-semibold mb-6 text-gray-900">Why Verify?</h3>
                            
                            <div className="space-y-4">
                                {/* Benefit 1 */}
                                <div className="flex items-center gap-4 border-2 px-4 py-2 border-gray-100 rounded-full">
                                    <div className="flex-shrink-0 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-md shadow-red-200">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700 font-semibold text-base">Instant Credit Assessment</p>
                                </div>

                                {/* Benefit 2 */}
                                <div className="flex items-center gap-4 border-2 px-4 py-2 border-gray-100 rounded-full">
                                    <div className="flex-shrink-0 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-md shadow-red-200">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700 font-semibold text-base">Verified Merchant Badge</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            <button
                                onClick={handleVerifyNow}
                                className="w-full bg-red-600 text-white font-semibold py-4 rounded-full hover:bg-red-700 transition shadow-lg active:scale-95 text-base"
                            >
                                Verify my business now
                            </button>

                            <button
                                onClick={handleSkip}
                                className="w-full text-gray-500 font-semibold hover:text-red-600 py-2 text-sm transition-colors"
                            >
                                Skip for now
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col overflow-auto">
            {/* Header */}
            <header className="bg-white px-8 py-6 flex justify-between items-center">
                <Image
                    source={Logo}
                    contentFit="contain"
                    style={{ width: 100, height: 28 }}
                />
                <div className="flex items-center gap-6">
                    <button className="text-gray-500 font-semibold hover:underline">Help</button>
                    <button
                        onClick={logout}
                        className="text-red-500 font-semibold hover:underline border border-red-200 px-4 py-1.5 rounded-full hover:bg-red-50 transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Step 1: Main Content */}
            <main className="flex-1 max-w-lg mx-auto px-8 py-12 w-full">
                {/* Building Icon */}
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold mb-2 text-gray-900">Your Business Details</h1>
                    <p className="text-gray-500 text-sm">Please select your business category to continue with your merchant setup.</p>
                </div>

                {/* Business Form */}
                <div className="space-y-4 mb-8">
                    <div className="mt-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Business Category & Type</h3>
                        <div className="space-y-4">
                            {OPERATIONAL_CATEGORIES.map((category) => (
                                <div key={category.name} className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
                                    <h4 className="font-semibold mb-3 text-gray-900 text-sm">{category.name}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {category.items.map((item: any, idx) => {
                                            const itemName = typeof item === 'string' ? item : item.name;
                                            const isSelected = operationalCategory === itemName;
                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => {
                                                        setOperationalCategory(itemName);
                                                        setBusinessCategory(category.name);
                                                    }}
                                                    className={`px-4 py-2 rounded-full border text-[11px] font-semibold transition-all ${
                                                        isSelected 
                                                            ? 'bg-red-600 border-red-600 text-white shadow-md' 
                                                            : 'bg-white border-gray-200 text-gray-600 hover:border-red-200'
                                                    }`}
                                                >
                                                    {itemName}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='flex justify-center'>
                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        disabled={!operationalCategory || createMerchant.isPending}
                        className={`w-full max-w-sm px-8 py-3.5 rounded-full font-semibold text-base transition shadow-lg ${
                            operationalCategory && !createMerchant.isPending
                                ? 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {createMerchant.isPending ? 'Processing...' : 'Continue'}
                    </button>
                </div>
            </main>
        </div>
    );
}
