'use client';

import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useAuth } from '@/contexts/AuthContext';
import { 
    useUpdateMeMutation
} from '@/services/api';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner';

export default function ProfileScreen() {
    const { profile } = useUserStore();
    const { refreshProfile } = useAuth();
    const updateMe = useUpdateMeMutation();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                phone: profile.phone || ''
            });
        }
    }, [profile]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            await updateMe.mutateAsync({
                firstName: formData.firstName,
                lastName: formData.lastName
            });
            await refreshProfile();
            toast.success('Profile updated successfully');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto sm:px-0">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Account Settings</h1>
                        <p className="text-gray-500 mt-1 text-sm">Manage your personal information and contact details.</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 pb-8 border-b border-gray-50 text-center sm:text-left">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-semibold text-xl sm:text-2xl border-4 border-white shadow-lg overflow-hidden shrink-0">
                                {profile?.firstName?.charAt(0) || profile?.phone?.charAt(0) || 'U'}
                                {profile?.lastName?.charAt(0) || ''}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : 'User Name'}
                                </h2>
                                <p className="text-gray-500 text-xs capitalize">{profile?.role || 'Member'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
                            <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">First Name</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-red-500 transition-all font-mediumm text-sm sm:text-base"
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Last Name</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-red-500 transition-all font-mediumm text-sm sm:text-base"
                                    placeholder="Enter last name"
                                />
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    readOnly
                                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-100 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none transition-all font-mediumm text-gray-500 cursor-not-allowed text-sm sm:text-base"
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                            <button
                                onClick={handleSave}
                                disabled={updateMe.isPending}
                                className={`w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 bg-red-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg shadow-red-100 transition-all active:scale-95 text-sm sm:text-base ${updateMe.isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
                            >
                                {updateMe.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>

                <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-red-50 rounded-2xl border border-red-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h4 className="font-semibold text-red-900 text-sm sm:text-base">Security Note</h4>
                        <p className="text-xs sm:text-sm text-red-700">Changing your account settings may require re-verification or confirmation.</p>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center text-red-600 shadow-sm font-semibold shrink-0">
                        i
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

