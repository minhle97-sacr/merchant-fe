'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import {
  useGetOutletsQuery,
  useAddOutletMutation,
  useUpdateOutletMutation,
  useDeleteOutletMutation
} from '@/services/api';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner';
import { Icon } from '@/components/Icon';
import OutletModal from '@/components/OutletModal';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function SettingsScreen() {
  const { profile } = useUserStore();

  // Outlets Hooks
  const { data: outlets = [], isLoading: isLoadingOutlets } = useGetOutletsQuery();
  const addOutlet = useAddOutletMutation();
  const updateOutlet = useUpdateOutletMutation();
  const deleteOutlet = useDeleteOutletMutation();

  // States for Outlet CRUD
  const [searchQuery, setSearchQuery] = useState('');
  const [isOutletModalOpen, setIsOutletModalOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<{ id: number; name: string; address?: string } | null>(null);
  const [outletName, setOutletName] = useState('');
  const [outletAddress, setOutletAddress] = useState('');

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [outletToDelete, setOutletToDelete] = useState<{ id: number; name: string } | null>(null);

  const filteredOutlets = outlets.filter((outlet: any) => 
    outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    outlet.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    outlet.id.toString().includes(searchQuery)
  );

  const handleOpenOutletModal = (outlet?: any) => {
    if (outlet) {
      setEditingOutlet(outlet);
      setOutletName(outlet.name);
      setOutletAddress(outlet.address || '');
    } else {
      setEditingOutlet(null);
      setOutletName('');
      setOutletAddress('');
    }
    setIsOutletModalOpen(true);
  };

  const handleSaveOutlet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outletName.trim()) return;

    try {
      if (editingOutlet) {
        await updateOutlet.mutateAsync({
          id: editingOutlet.id,
          name: outletName,
          address: outletAddress
        });
        toast.success('Outlet updated successfully');
      } else {
        await addOutlet.mutateAsync({
          name: outletName,
          address: outletAddress
        });
        toast.success('Outlet added successfully');
      }
      setIsOutletModalOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save outlet');
    }
  };

  const handleDeleteOutlet = async () => {
    if (!outletToDelete) return;

    try {
      await deleteOutlet.mutateAsync(outletToDelete.id);
      toast.success('Outlet deleted successfully');
      setIsDeleteModalOpen(false);
      setOutletToDelete(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete outlet');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Business Outlets</h1>
          <button
            onClick={() => handleOpenOutletModal()}
            className="text-sm w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition shadow-sm active:scale-95 text-center"
          >
            Add Outlet
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 sm:mb-8 hidden">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="search" size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Find an outlet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 bg-white transition-all shadow-sm text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Outlets List container */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <span className="text-sm font-mediumm text-gray-600">
              {isLoadingOutlets ? 'Loading...' : `${filteredOutlets.length} outlet${filteredOutlets.length !== 1 ? 's' : ''}`} registered
            </span>
          </div>

          {isLoadingOutlets ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
            </div>
          ) : filteredOutlets.length === 0 ? (
            <div className="px-6 py-12 sm:py-20 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="location" size={24} className="text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-1 text-base sm:text-lg">No outlets found</h3>
              <p className="text-gray-500 text-xs sm:text-sm">Try adding a new outlet or adjusting your search.</p>
            </div>
          ) : (
            filteredOutlets.map((outlet: any) => (
              <div
                key={outlet.id}
                className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-50 last:border-0 hover:bg-red-50/30 transition-colors group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="hidden sm:flex w-12 h-12 bg-red-50 rounded-xl items-center justify-center text-red-600 group-hover:scale-110 transition-transform flex-shrink-0">
                      <Icon name="location" size={24} />
                    </div>
                    <div className="truncate">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors truncate">{outlet.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[200px] sm:max-w-xs">{outlet.address || 'No address provided'}</p>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">ID: #{outlet.id}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-6">
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={() => handleOpenOutletModal(outlet)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-100"
                        title="Edit Outlet"
                      >
                        <Icon name="edit" size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setOutletToDelete(outlet);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-100"
                        title="Delete Outlet"
                      >
                        <Icon name="trash" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Outlet Modal */}
        <OutletModal
          isOpen={isOutletModalOpen}
          onClose={() => setIsOutletModalOpen(false)}
          title={editingOutlet ? 'Edit Outlet' : 'Add New Outlet'}
          onSubmit={handleSaveOutlet}
          name={outletName}
          onNameChange={setOutletName}
          address={outletAddress}
          onAddressChange={setOutletAddress}
          isPending={addOutlet.isPending || updateOutlet.isPending}
          submitLabel={editingOutlet ? 'Update Outlet' : 'Add Outlet'}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setOutletToDelete(null);
          }}
          title="Delete Outlet?"
          description={
            <>Are you sure you want to delete <span className="font-semibold text-gray-900">{outletToDelete?.name}</span>? This action cannot be undone and may affect associated records.</>
          }
          onConfirm={handleDeleteOutlet}
          confirmLabel="Delete"
          isPending={deleteOutlet.isPending}
          variant="danger"
        />
      </div>
    </DashboardLayout>
  );
}