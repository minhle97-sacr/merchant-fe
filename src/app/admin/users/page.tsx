'use client';

import React, { useState, useEffect } from 'react';
import { useGetSuperAdminUsersQuery, useUpdateUserSuspensionMutation } from '@/services/api';
import { toast } from 'sonner';
import AdminLayout from '@/components/AdminLayout';
import { Icon } from '@/components/Icon';

export default function AdminUsers() {
  const { data: allUsers = [], isLoading: isLoadingUsers, error: usersError } = useGetSuperAdminUsersQuery();
  const updateUserSuspension = useUpdateUserSuspensionMutation();

  useEffect(() => {
    if (usersError) {
      const status = (usersError as any)?.response?.status;
      if (status === 401 || status === 403) {
        toast.error('Unauthorized: Super Admin access required');
      }
    }
  }, [usersError]);

  const handleToggleSuspension = async (id: number, currentSuspension: boolean) => {
    try {
      await updateUserSuspension.mutateAsync({ id, isSuspended: !currentSuspension });
      toast.success(`User ${!currentSuspension ? 'Suspended' : 'Unsuspended'} successfully`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Update failed');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Users Management</h2>
          <p className="text-slate-500 mt-1">Manage global user accounts and access permissions.</p>
        </div>

        {isLoadingUsers ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : allUsers.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-slate-200">
            <Icon name="close" size={40} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900">No users found</h3>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">

                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Merchant Access</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allUsers.map((user: any) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700 font-mediumm">{user.phone}</p>
                        <p className="text-[10px] text-slate-400">{user.email || 'No email'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.merchantMembers?.map((mm: any) => (
                            <span key={mm.id} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200">
                              {mm.merchant.name} ({mm.role})
                            </span>
                          )) || <span className="text-[10px] text-slate-400 italic">No merchants</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${user.isSuspended 
                          ? 'bg-red-50 text-red-600 border-red-100' 
                          : 'bg-green-50 text-green-600 border-green-100'}`}
                        >
                          {user.isSuspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleSuspension(user.id, user.isSuspended)}
                          disabled={updateUserSuspension.isPending}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${user.isSuspended 
                            ? 'bg-green-600 border-green-600 text-white hover:bg-green-700' 
                            : 'bg-white border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'}`}
                        >
                          {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
