'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import DashboardLayout from '@/components/DashboardLayout';
import {
    useGetMerchantMembersQuery,
    useAddMerchantMemberMutation,
    useUpdateMerchantMemberMutation,
    useDeleteMerchantMemberMutation,
    useToggleMerchantMemberSuspensionMutation
} from '@/services/api';
import MemberModal from '@/components/MemberModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { toast } from 'sonner';

export default function TeamManagementScreen() {
    const router = useRouter();
    const { profile } = useUserStore();

    useEffect(() => {
        if (profile && profile.role !== 'owner') {
            router.replace('/dashboard');
            toast.error('Only owners can access team management');
        }
    }, [profile, router]);

    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<any>(null);
    const [newMember, setNewMember] = useState({
        phone: '',
        email: '',
        role: 'staff' as 'manager' | 'operator' | 'staff'
    });
    const [newPinDigits, setNewPinDigits] = useState(['', '', '', '', '', '']);
    const [editPinDigits, setEditPinDigits] = useState(['', '', '', '', '', '']);
    const [editingMember, setEditingMember] = useState<{
        membershipId: number;
        phone: string;
        email: string;
        role: 'manager' | 'operator' | 'staff';
    } | null>(null);

    const { data: members = [], isLoading } = useGetMerchantMembersQuery();
    const addMemberMutation = useAddMerchantMemberMutation();
    const updateMemberMutation = useUpdateMerchantMemberMutation();
    const toggleSuspensionMutation = useToggleMerchantMemberSuspensionMutation();
    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
    const [memberToSuspend, setMemberToSuspend] = useState<any>(null);
    const deleteMemberMutation = useDeleteMerchantMemberMutation();

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addMemberMutation.mutateAsync({
                phone: newMember.phone,
                email: newMember.email || undefined,
                role: newMember.role,
                pinCode: newPinDigits.join('')
            });
            toast.success('Member added successfully!');
            setIsAddModalOpen(false);
            setNewMember({ phone: '', email: '', role: 'staff' });
            setNewPinDigits(['', '', '', '', '', '']);
        } catch (error: any) {
            console.error('Failed to add member:', error);
            const errorMessage = error.response?.data?.message || 'Failed to add member. Please try again.';
            toast.error(errorMessage);
        }
    };

    const handleUpdateMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMember) return;

        const pinCode = editPinDigits.join('');

        try {
            await updateMemberMutation.mutateAsync({
                membershipId: editingMember.membershipId,
                payload: {
                    phone: editingMember.phone,
                    email: editingMember.email || undefined,
                    pinCode: pinCode || undefined, // Only send if changed
                    role: editingMember.role
                }
            });
            toast.success('Member updated successfully!');
            setIsEditModalOpen(false);
            setEditingMember(null);
            setEditPinDigits(['', '', '', '', '', '']);
        } catch (error: any) {
            console.error('Failed to update member:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update member. Please try again.';
            toast.error(errorMessage);
        }
    };

    const handleDeleteMember = async () => {
        if (!memberToDelete) return;
        try {
            await deleteMemberMutation.mutateAsync(memberToDelete.membershipId);
            toast.success('Member removed successfully');
            setIsDeleteModalOpen(false);
            setMemberToDelete(null);
        } catch (error: any) {
            console.error('Failed to delete member:', error);
            toast.error(error.response?.data?.message || 'Failed to remove member');
        }
    };

    const filteredMembers = Array.isArray(members) ? members.filter((member: any) => {
        const query = searchQuery.toLowerCase();
        const status = member.isSuspended ? 'suspended' : 'active';
        return (
            member.phone?.toLowerCase().includes(query) ||
            member.email?.toLowerCase().includes(query) ||
            (member.role && member.role.toLowerCase().includes(query)) ||
            status.includes(query)
        );
    }) : [];

    return (
        <DashboardLayout>
            <div className="max-w-4xl w-full mx-auto px-4 sm:px-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Members</h1>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="text-sm w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition shadow-sm active:scale-95 text-center"
                    >
                        Add member
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6 sm:mb-8">
                    <div className="relative w-full sm:max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Find a member..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 bg-white transition-all shadow-sm text-sm sm:text-base"
                        />
                    </div>
                </div>

                {/* Members List container */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <span className="text-sm font-mediumm text-gray-600">
                            {isLoading ? 'Loading...' : `${filteredMembers.length} member${filteredMembers.length !== 1 ? 's' : ''}`} in the organization
                        </span>
                    </div>

                    {filteredMembers.map((member: any) => (
                        <div
                            key={member.id}
                            className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-50 last:border-0 hover:bg-red-50/30 transition-colors group"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                    <div className="hidden sm:flex w-12 h-12 bg-red-50 rounded-xl items-center justify-center text-red-600 group-hover:scale-110 transition-transform flex-shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="truncate">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-red-600 transition-colors truncate">{member.phone}</h3>
                                            <span className={`px-2 py-0.5 text-[10px] font-mediumm rounded-full border uppercase tracking-wider ${
                                                member.isSuspended 
                                                    ? 'bg-amber-50 text-amber-600 border-amber-100' 
                                                    : 'bg-green-50 text-green-600 border-green-100'
                                            }`}>
                                                {member.isSuspended ? 'Suspended' : 'Active'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs sm:text-sm text-gray-500 capitalize">{member.role}</p>
                                            {member.email && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                    <p className="text-xs sm:text-sm text-gray-400 truncate">{member.email}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 sm:gap-6">
                                    <div className="flex gap-2 sm:gap-3">
                                        {member.role !== 'owner' && (
                                            <>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingMember({
                                                            membershipId: member.membershipId,
                                                            phone: member.phone,
                                                            email: member.email || '',
                                                            role: member.role
                                                        });
                                                        setEditPinDigits(['', '', '', '', '', '']);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-100"
                                                    title="Edit Member"
                                                >
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMemberToSuspend(member);
                                                        setIsSuspendModalOpen(true);
                                                    }}
                                                    className={`p-2 rounded-lg transition-colors border ${member.isSuspended
                                                            ? 'text-green-600 hover:bg-green-50 border-green-100'
                                                            : 'text-amber-500 hover:text-amber-600 hover:bg-amber-50 border-gray-100'
                                                        }`}
                                                    title={member.isSuspended ? "Activate Member" : "Suspend Member"}
                                                >
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        {member.isSuspended ? (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        ) : (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                        )}
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMemberToDelete(member);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-100"
                                                    title="Remove Member"
                                                >
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {!isLoading && filteredMembers.length === 0 && (
                        <div className="px-6 py-12 sm:py-20 text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-gray-900 font-semibold mb-1 text-base sm:text-lg">No members found</h3>
                            <p className="text-gray-500 text-xs sm:text-sm">Try adding a new member or adjusting your search.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Member Modal */}
            <MemberModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Member"
                onSubmit={handleAddMember}
                memberData={newMember}
                onDataChange={setNewMember}
                pinDigits={newPinDigits}
                onPinChange={setNewPinDigits}
                isPending={addMemberMutation.isPending}
                submitLabel="Add Member"
            />

            {/* Suspend Confirmation Modal */}
            <ConfirmationModal
                isOpen={isSuspendModalOpen}
                onClose={() => setIsSuspendModalOpen(false)}
                title={memberToSuspend?.isSuspended ? 'Activate Member?' : 'Suspend Member?'}
                description={
                    memberToSuspend?.isSuspended
                        ? `Are you sure you want to activate ${memberToSuspend?.phone}? They will regain access to the organization.`
                        : `Are you sure you want to suspend ${memberToSuspend?.phone}? They will temporarily lose access to the organization.`
                }
                onConfirm={async () => {
                    if (memberToSuspend) {
                        try {
                            await toggleSuspensionMutation.mutateAsync({
                                membershipId: memberToSuspend.membershipId,
                                isSuspended: !memberToSuspend.isSuspended
                            });
                            setIsSuspendModalOpen(false);
                            toast.success(`Member ${memberToSuspend.isSuspended ? 'activated' : 'suspended'} successfully`);
                        } catch (error: any) {
                            console.error('Failed to update status:', error);
                            toast.error(error.response?.data?.message || 'Failed to update member status');
                        }
                    }
                }}
                confirmLabel={memberToSuspend?.isSuspended ? 'Activate Member' : 'Suspend Member'}
                isPending={toggleSuspensionMutation.isPending}
                variant={memberToSuspend?.isSuspended ? 'success' : 'warning'}
                icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {memberToSuspend?.isSuspended ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        )}
                    </svg>
                }
            />

            {/* Edit Member Modal */}
            {editingMember && (
                <MemberModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingMember(null);
                    }}
                    title="Edit Member"
                    onSubmit={handleUpdateMember}
                    memberData={editingMember}
                    onDataChange={setEditingMember}
                    pinDigits={editPinDigits}
                    onPinChange={setEditPinDigits}
                    isPending={updateMemberMutation.isPending}
                    submitLabel="Update Member"
                    isEdit={true}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setMemberToDelete(null);
                }}
                title="Remove Member?"
                description={
                    <>Are you sure you want to remove <span className="font-semibold text-gray-900">{memberToDelete?.phone}</span> from your organization? This action cannot be undone.</>
                }
                onConfirm={handleDeleteMember}
                confirmLabel="Remove"
                isPending={deleteMemberMutation.isPending}
                variant="danger"
            />
        </DashboardLayout>
    );
}
