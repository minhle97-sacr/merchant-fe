'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStore } from '@/store/useUserStore';
import DashboardLayout from '@/components/DashboardLayout';
import { Icon } from '@/components/Icon';
import { toast } from 'sonner';

export default function DashboardScreen() {
    const { user } = useAuth();
    const { profile } = useUserStore();
    const router = useRouter();

    return (
        <DashboardLayout>
            {/* Profile Header Row */}
            <div className="mb-8 flex items-center justify-between gap-4 overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex items-center gap-6 sm:gap-12">
                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-semibold text-base sm:text-lg border border-red-100">
                            {profile?.firstName?.charAt(0) || 'N'}{profile?.lastName?.charAt(0) || 'A'}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                                {profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : 'N/A'}
                            </h2>
                            <p className="text-[9px] sm:text-[10px] text-gray-500 truncate">{profile?.phone || user?.phone || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 sm:gap-10 shrink-0">
                        <div className="flex flex-col gap-0.5">
                            <p className="text-[9px] sm:text-[10px] text-gray-400 font-mediumm">Trust Score</p>
                            <div className="flex items-center gap-1 text-green-600 font-semibold text-[11px] sm:text-xs">
                                <Icon name="check-circle" size={12} />
                                <span>85/100</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <p className="text-[9px] sm:text-[10px] text-gray-400 font-mediumm">Wallet balance</p>
                            <div className="font-semibold text-gray-900 text-[11px] sm:text-xs">50,000रू</div>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div
                                className="flex flex-col gap-0.5 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => router.push('/business-profile')}
                            >
                                <p className="text-[9px] sm:text-[10px] text-gray-400 font-mediumm">KYC Status</p>
                                <div className="flex items-center gap-1 text-gray-900 font-semibold text-[11px] sm:text-xs hover:text-red-600 duration-200">
                                    {profile?.merchant?.kycStatus === 'done' ? (
                                        <>
                                            <Icon name="check-circle" size={12} className="text-green-600" />
                                            <span className="hidden xs:inline">Verified Merchant</span>
                                            <span className="xs:hidden">Verified</span>
                                        </>
                                    ) : profile?.merchant?.kycStatus === 'being-verified' ? (
                                        <>
                                            <Icon name="check-circle" size={12} className="text-blue-500" />
                                            <span>Pending</span>
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="check-circle" size={12} className="text-gray-300" />
                                            <span className="text-red-500">Incomplete</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative shrink-0 ml-4">
                    <div
                        className={`flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 pr-2 py-1.5 sm:py-2 rounded-full border transition-all group bg-gray-100/80 border-gray-100 hover:bg-gray-100'`}
                    >
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center transition-colors text-gray-900`}>
                            <Icon name="location" size={12} />
                        </div>
                        <div className="text-left min-w-0 max-w-[100px] lg:max-w-[180px]">
                            <h3 className="text-[10px] sm:text-[11px] font-semibold text-gray-900 truncate leading-tight">{profile?.merchant?.name || "Select Business"}</h3>
                            <p className="text-[8px] sm:text-[9px] text-gray-500 truncate leading-tight">{profile?.merchant?.address || 'No location set'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Row Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Redtab Pay Later Card */}
                <div className="lg:col-span-2 bg-white p-5 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-100">
                    <div className="flex sm:flex-row justify-between items-start gap-4 mb-4">
                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Redtab Pay Later</h3>
                            <p className="text-xs sm:text-sm text-red-500 font-semibold mt-1">Facility Utilization</p>
                        </div>

                        <div className="flex flex-col items-start sm:items-end py-2 sm:py-3 border-b border-dashed border-gray-100 min-w-0 sm:min-w-[140px]">
                            <span className="text-xs sm:text-sm text-gray-600 font-mediumm">Approved Limit</span>
                            <div className="flex items-center gap-1">
                                <span className="text-base sm:text-lg font-semibold text-gray-900">50,000</span>
                                <span className="text-sm font-semibold text-gray-900">रू</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="h-3 sm:h-4 w-full bg-gray-50 rounded-full overflow-hidden flex gap-0.5 sm:gap-1">
                            <div className="h-full bg-red-500 rounded-l-full" style={{ width: '25%' }}></div>
                            <div className="h-full bg-green-500 rounded-r-full flex-1"></div>
                        </div>
                    </div>

                    <div className="flex justify-between gap-4">
                        <div className="flex flex-col border-b border-gray-100">
                            <span className="text-xs sm:text-sm text-gray-600 font-mediumm">Credit Used</span>
                            <div className="flex items-center gap-1">
                                <span className="text-sm sm:text-base font-semibold text-gray-900">12,500</span>
                                <span className="text-xs sm:text-sm font-semibold text-gray-900">रू</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs sm:text-sm text-gray-600 font-mediumm">Available Balance</span>
                            <div className="flex items-center gap-1">
                                <span className="text-sm sm:text-base font-semibold text-green-500">37,500</span>
                                <span className="text-xs sm:text-sm font-semibold text-green-500">रू</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Wallet Card */}
                <div className="bg-white p-5 sm:p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">My Wallet</h3>
                    <p className="text-[10px] text-gray-400 font-mediumm mt-1 mb-8">Settlement Volume</p>

                    <div className="flex justify-between items-baseline mb-10">
                        <span className="text-xl sm:text-2xl font-semibold text-gray-900">1,250 रू</span>
                        <span className="text-[10px] text-green-500 font-semibold">+रू 120 today</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="py-2.5 px-4 rounded-xl bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition-colors text-xs active:scale-95">
                            Withdraw
                        </button>
                        <button className="py-2.5 px-4 rounded-xl bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition-colors text-xs active:scale-95">
                            History
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Row Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Trend */}
                <div className="lg:col-span-2 bg-white p-5 sm:p-8 rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 sm:mb-8">Performance Trend</h3>
                    <div className="h-32 sm:h-48 flex items-end justify-between gap-1 relative pt-4">
                        {/* SVG Chart to look more like the screenshot */}
                        <svg className="absolute inset-x-0 bottom-8 sm:bottom-12 h-20 sm:h-24 w-full px-2 sm:px-4 overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                            <path d="M0,35 Q10,30 20,32 Q30,34 40,25 Q50,22 60,30 Q70,33 80,20 Q90,15 100,5" fill="none" stroke="#FEE2E2" strokeWidth="2" strokeLinecap="round" />
                            <path d="M0,30 Q10,25 20,28 Q30,30 40,20 Q50,15 60,25 Q70,28 80,10 Q90,5 100,0" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] text-gray-400 font-mediumm px-2 sm:px-4">
                        <span>M</span>
                        <span>Tu</span>
                        <span>W</span>
                        <span>T</span>
                        <span>F</span>
                        <span>Sa</span>
                        <span>S</span>
                    </div>
                </div>

                {/* Stock Health */}
                <div className="bg-white p-5 sm:p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-6 sm:mb-8">Stock Health</h3>

                    <div className="space-y-6 sm:space-y-8">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-[10px] text-gray-500 font-mediumm tracking-tight whitespace-nowrap">Healthy Products</span>
                                <span className="text-[10px] font-semibold text-gray-900">42</span>
                            </div>
                            <div className="h-1 sm:h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[70%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-[10px] text-gray-500 font-mediumm tracking-tight whitespace-nowrap">Low Stock Items</span>
                                <span className="text-[10px] font-semibold text-gray-900">12</span>
                            </div>
                            <div className="h-1 sm:h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 w-[30%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}