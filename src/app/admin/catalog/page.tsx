'use client';

import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Icon } from '@/components/Icon';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { toast } from 'sonner';
import * as Dialog from '@radix-ui/react-dialog';

type ListingType = 'product' | 'service' | 'rental';
type ListingStatus = 'DRAFT' | 'PENDING_REVIEW' | 'LIVE' | 'REJECTED' | 'INACTIVE';

interface CatalogItem {
    id: number;
    merchantName: string;
    name: string;
    category: string;
    subCategory: string;
    type: ListingType;
    price: number;
    unit: string;
    stock: number;
    status: ListingStatus;
    sku: string;
    createdAt: string;
}

const MOCK_ADMIN_ITEMS: CatalogItem[] = [
    { id: 1, merchantName: 'ABC Grocery', name: 'Basmati Rice (25kg)', category: 'Food', subCategory: 'Grocery & Staples', type: 'product', price: 2500, unit: 'bag', stock: 120, status: 'LIVE', sku: 'GS-001', createdAt: '2025-12-01' },
    { id: 2, merchantName: 'FastMart', name: 'Dishwashing Liquid (5L)', category: 'Cleaning & Hygiene', subCategory: 'Detergents', type: 'product', price: 800, unit: 'can', stock: 45, status: 'PENDING_REVIEW', sku: 'CH-001', createdAt: '2025-12-10' },
    { id: 3, merchantName: 'Events Co.', name: 'Catering Service', category: 'Services', subCategory: 'Catering', type: 'service', price: 50000, unit: 'event', stock: 0, status: 'PENDING_REVIEW', sku: 'SV-001', createdAt: '2025-12-14' },
    { id: 4, merchantName: 'Rentals & More', name: 'Chair Rental', category: 'Rentals', subCategory: 'Furniture', type: 'rental', price: 50, unit: 'piece/day', stock: 500, status: 'LIVE', sku: 'RT-001', createdAt: '2025-12-15' },
    { id: 5, merchantName: 'ABC Grocery', name: 'Frozen Prawns (1kg)', category: 'Food', subCategory: 'Frozen Foods', type: 'product', price: 1800, unit: 'pack', stock: 15, status: 'REJECTED', sku: 'FF-001', createdAt: '2025-12-18' },
];

const STATUS_CONFIG: Record<ListingStatus, { label: string; color: string; bg: string }> = {
    DRAFT: { label: 'Draft', color: 'text-gray-600', bg: 'bg-gray-100' },
    PENDING_REVIEW: { label: 'Pending Review', color: 'text-blue-600', bg: 'bg-blue-50' },
    LIVE: { label: 'Live', color: 'text-green-600', bg: 'bg-green-50' },
    REJECTED: { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-50' },
    INACTIVE: { label: 'Inactive', color: 'text-orange-600', bg: 'bg-orange-50' },
};

export default function AdminCatalog() {
    const [items, setItems] = useState<CatalogItem[]>(MOCK_ADMIN_ITEMS);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 item.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 item.sku.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [items, searchQuery, statusFilter]);

    const handleAction = (id: number, newStatus: ListingStatus) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
        toast.success(`Listing ${newStatus.toLowerCase().replace('_', ' ')} successfully`);
        setSelectedItem(null);
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Catalog Management</h2>
                    <p className="text-slate-500 mt-1">Review, approve, or reject merchant product and service listings.</p>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search by product, merchant or SKU..."
                            value={searchQuery}
                            onChange={(e: any) => setSearchQuery(e.target.value)}
                            startIcon={<Icon name="search" size={18} />}
                            className="!py-2.5"
                        />
                    </div>
                    <div className="w-full sm:w-48">
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                            options={[
                                { value: 'all', label: 'All Status' },
                                { value: 'PENDING_REVIEW', label: 'Pending Review' },
                                { value: 'LIVE', label: 'Live' },
                                { value: 'REJECTED', label: 'Rejected' },
                                { value: 'INACTIVE', label: 'Inactive' },
                            ]}
                            triggerClassName="!py-2.5"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="text-left py-4 px-6 text-xs font-boldd text-slate-500 uppercase tracking-wider">Listing Details</th>
                                <th className="text-left py-4 px-6 text-xs font-boldd text-slate-500 uppercase tracking-wider">Merchant</th>
                                <th className="text-right py-4 px-6 text-xs font-boldd text-slate-500 uppercase tracking-wider">Price / Unit</th>
                                <th className="text-center py-4 px-6 text-xs font-boldd text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-right py-4 px-6 text-xs font-boldd text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                                <Icon name={item.type === 'service' ? 'settings' : item.type === 'rental' ? 'clock' : 'bag'} size={20} className="text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mediumm">{item.category} • {item.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-600">{item.merchantName}</td>
                                    <td className="py-4 px-6 text-right">
                                        <p className="font-semibold text-slate-900 text-sm">रू {item.price.toLocaleString()}</p>
                                        <p className="text-[10px] text-slate-400 uppercase">per {item.unit}</p>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-boldd uppercase tracking-wider ${STATUS_CONFIG[item.status].bg} ${STATUS_CONFIG[item.status].color}`}>
                                            {STATUS_CONFIG[item.status].label}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button 
                                            onClick={() => setSelectedItem(item)}
                                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-boldd text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wider"
                                        >
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-40">
                                            <Icon name="catalog" size={48} />
                                            <p className="text-sm font-mediumm">No listings found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Review Modal */}
            <Dialog.Root open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 z-50 animate-in fade-in duration-300 backdrop-blur-[2px]" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[32px] w-[calc(100%-2rem)] max-w-2xl overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in duration-300 focus:outline-none flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <Dialog.Title className="text-xl font-boldd text-slate-900">Review Listing</Dialog.Title>
                                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">ID: {selectedItem?.sku}</p>
                            </div>
                            <Dialog.Close className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-xl hover:bg-slate-100">
                                <Icon name="close" size={24} />
                            </Dialog.Close>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="text-[10px] text-slate-400 font-boldd uppercase tracking-wider block mb-2">Product Name</label>
                                    <p className="font-semibold text-slate-900">{selectedItem?.name}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-400 font-boldd uppercase tracking-wider block mb-2">Merchant</label>
                                    <p className="font-semibold text-slate-900">{selectedItem?.merchantName}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-400 font-boldd uppercase tracking-wider block mb-2">Category</label>
                                    <p className="font-semibold text-slate-900">{selectedItem?.category} / {selectedItem?.subCategory}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-400 font-boldd uppercase tracking-wider block mb-2">Type</label>
                                    <p className="font-semibold text-slate-900 capitalize">{selectedItem?.type}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-400 font-boldd uppercase tracking-wider block mb-2">Price</label>
                                    <p className="font-semibold text-slate-900">रू {selectedItem?.price.toLocaleString()} per {selectedItem?.unit}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-400 font-boldd uppercase tracking-wider block mb-2">Stock Inventory</label>
                                    <p className="font-semibold text-slate-900">{selectedItem?.type === 'service' ? 'N/A' : selectedItem?.stock}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <p className="text-[10px] text-slate-400 font-boldd uppercase tracking-wider mb-3">Admin Checklist</p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <Icon name="check-circle" size={14} className="text-green-500" />
                                        <span>Mandatory fields completed</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <Icon name="check-circle" size={14} className="text-green-500" />
                                        <span>Image quality checked</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <Icon name="check-circle" size={14} className="text-green-500" />
                                        <span>No duplicate entries found</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => selectedItem && handleAction(selectedItem.id, 'REJECTED')}
                                className="flex-1 py-3 text-sm font-boldd text-red-600 border-2 border-red-100 bg-white hover:bg-red-50 rounded-2xl transition-all uppercase tracking-wider"
                            >
                                Reject Listing
                            </button>
                            <button
                                onClick={() => selectedItem && handleAction(selectedItem.id, 'LIVE')}
                                className="flex-1 py-3 text-sm font-boldd text-white bg-slate-900 hover:bg-slate-800 rounded-2xl transition-all shadow-lg shadow-slate-200 uppercase tracking-wider"
                            >
                                Approve & Publish
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </AdminLayout>
    );
}
