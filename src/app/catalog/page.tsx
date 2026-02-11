'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStore } from '@/store/useUserStore';
import DashboardLayout from '@/components/DashboardLayout';
import { Icon } from '@/components/Icon';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import ConfirmationModal from '@/components/ConfirmationModal';
import ListingModal from '@/components/catalog/ListingModal';
import InventoryModal from '@/components/catalog/InventoryModal';
import { toast } from 'sonner';

type ListingType = 'product' | 'service' | 'rental';
type ListingStatus = 'DRAFT' | 'PENDING_REVIEW' | 'LIVE' | 'REJECTED' | 'INACTIVE';

interface CatalogItem {
  id: number;
  name: string;
  category: string;
  subCategory: string;
  type: ListingType;
  price: number;
  unit: string;
  stock: number;
  status: ListingStatus;
  image?: string;
  sku: string;
  taxPercent: number;
  createdAt: string;
}

const MOCK_ITEMS: CatalogItem[] = [
  { id: 1, name: 'Basmati Rice (25kg)', category: 'Food', subCategory: 'Grocery & Staples', type: 'product', price: 2500, unit: 'bag', stock: 120, status: 'LIVE', sku: 'GS-001', taxPercent: 13, createdAt: '2025-12-01' },
  { id: 2, name: 'Sunflower Oil (5L)', category: 'Food', subCategory: 'Grocery & Staples', type: 'product', price: 1200, unit: 'bottle', stock: 85, status: 'LIVE', sku: 'GS-002', taxPercent: 13, createdAt: '2025-12-03' },
  { id: 3, name: 'Fresh Chicken (Whole)', category: 'Food', subCategory: 'Meat & Seafood', type: 'product', price: 450, unit: 'kg', stock: 30, status: 'LIVE', sku: 'MS-001', taxPercent: 0, createdAt: '2025-12-05' },
  { id: 4, name: 'Paper Napkins (500pc)', category: 'Packaging & Disposables', subCategory: 'Disposable Tableware', type: 'product', price: 350, unit: 'pack', stock: 200, status: 'LIVE', sku: 'PD-001', taxPercent: 13, createdAt: '2025-12-06' },
  { id: 5, name: 'Dishwashing Liquid (5L)', category: 'Cleaning & Hygiene', subCategory: 'Detergents', type: 'product', price: 800, unit: 'can', stock: 45, status: 'PENDING_REVIEW', sku: 'CH-001', taxPercent: 13, createdAt: '2025-12-10' },
  { id: 6, name: 'Commercial Blender', category: 'Equipment & Appliances', subCategory: 'Kitchen Appliances', type: 'product', price: 15000, unit: 'piece', stock: 8, status: 'DRAFT', sku: 'EA-001', taxPercent: 13, createdAt: '2025-12-12' },
  { id: 7, name: 'Catering Service (Per Event)', category: 'Services', subCategory: 'Catering', type: 'service', price: 50000, unit: 'event', stock: 0, status: 'LIVE', sku: 'SV-001', taxPercent: 13, createdAt: '2025-12-14' },
  { id: 8, name: 'Chair Rental (Per Day)', category: 'Rentals', subCategory: 'Furniture', type: 'rental', price: 50, unit: 'piece/day', stock: 500, status: 'LIVE', sku: 'RT-001', taxPercent: 13, createdAt: '2025-12-15' },
  { id: 9, name: 'Green Tea (100 bags)', category: 'Food', subCategory: 'Beverages', type: 'product', price: 600, unit: 'box', stock: 0, status: 'INACTIVE', sku: 'BV-001', taxPercent: 13, createdAt: '2025-11-20' },
  { id: 10, name: 'Frozen Prawns (1kg)', category: 'Food', subCategory: 'Frozen Foods', type: 'product', price: 1800, unit: 'pack', stock: 15, status: 'REJECTED', sku: 'FF-001', taxPercent: 0, createdAt: '2025-12-18' },
];

const STATUS_CONFIG: Record<ListingStatus, { label: string; color: string; bg: string }> = {
  DRAFT: { label: 'Draft', color: 'text-gray-600', bg: 'bg-gray-100' },
  PENDING_REVIEW: { label: 'Pending Review', color: 'text-blue-600', bg: 'bg-blue-50' },
  LIVE: { label: 'Live', color: 'text-green-600', bg: 'bg-green-50' },
  REJECTED: { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-50' },
  INACTIVE: { label: 'Inactive', color: 'text-orange-600', bg: 'bg-orange-50' },
};

const CATEGORIES = [
  'All Categories',
  'Food',
  'Packaging & Disposables',
  'Cleaning & Hygiene',
  'Equipment & Appliances',
  'Services',
  'Rentals',
];

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'product', label: 'Product' },
  { value: 'service', label: 'Service' },
  { value: 'rental', label: 'Rental' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'LIVE', label: 'Live' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING_REVIEW', label: 'Pending Review' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export default function CatalogScreen() {
  useAuth();
  const { profile } = useUserStore();
  const merchant = profile?.merchant
  const [items, setItems] = useState<CatalogItem[]>(MOCK_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: CatalogItem | null }>({ open: false, item: null });

  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [inventoryModal, setInventoryModal] = useState<{ open: boolean; item: CatalogItem | null }>({ open: false, item: null });

  // Filtered items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  // Stats
  const stats = {
    total: items.length,
    live: items.filter(i => i.status === 'LIVE').length,
    pending: items.filter(i => i.status === 'PENDING_REVIEW').length,
    draft: items.filter(i => i.status === 'DRAFT').length,
  };

  const handleDelete = (item: CatalogItem) => {
    setDeleteModal({ open: true, item });
  };

  const confirmDelete = () => {
    if (deleteModal.item) {
      setItems(prev => prev.map(i =>
        i.id === deleteModal.item!.id ? { ...i, status: 'INACTIVE' as ListingStatus } : i
      ));
      toast.success(`"${deleteModal.item.name}" has been deactivated`);
      setDeleteModal({ open: false, item: null });
    }
  };

  const handleSubmitForReview = (item: CatalogItem) => {
    setItems(prev => prev.map(i =>
      i.id === item.id ? { ...i, status: 'PENDING_REVIEW' as ListingStatus } : i
    ));
    toast.success(`"${item.name}" submitted for review`);
  };

  const handleSaveListing = (listing: any) => {
    if (editingItem) {
      setItems(prev => prev.map(i => i.id === editingItem.id ? listing : i));
      toast.success(`"${listing.name}" updated successfully`);
    } else {
      setItems(prev => [listing, ...prev]);
      toast.success(`"${listing.name}" added successfully`);
    }
    setEditingItem(null);
  };

  const handleEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setIsListingModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsListingModalOpen(true);
  };

  const handleUpdateInventory = (id: number, updates: any) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    toast.success('Inventory updated successfully');
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">My Catalog</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your product, service & rental listings</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toast.info('Bulk upload coming soon')}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Icon name="cloud-upload" size={14} />
              Bulk Upload
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Icon name="plus" size={14} />
              Add Listing
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-xs text-gray-500 font-mediumm">Total Listings</span>
            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
              <Icon name="catalog" size={14} className="text-gray-400" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-xs text-gray-500 font-mediumm">Live</span>
            <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
              <Icon name="check-circle" size={14} className="text-green-500" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-semibold text-green-600">{stats.live}</p>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-xs text-gray-500 font-mediumm">Pending Review</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Icon name="clock" size={14} className="text-blue-500" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-semibold text-blue-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-xs text-gray-500 font-mediumm">Drafts</span>
            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
              <Icon name="file-text" size={14} className="text-gray-400" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-semibold text-gray-600">{stats.draft}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm mb-6">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                className="!py-2.5 !rounded-xl !bg-gray-50 focus:!bg-white !text-xs"
                endIcon={<Icon name="search" size={14} />}
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                options={CATEGORIES}
                triggerClassName="!py-2.5 !rounded-xl !text-xs !min-w-[140px]"
              />
              <Select
                value={selectedType}
                onValueChange={setSelectedType}
                options={TYPE_OPTIONS}
                triggerClassName="!py-2.5 !rounded-xl !text-xs !min-w-[110px]"
              />
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                options={STATUS_OPTIONS}
                triggerClassName="!py-2.5 !rounded-xl !text-xs !min-w-[130px]"
              />
              <div className="hidden sm:flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Icon name="catalog" size={14} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Icon name="dashboard" size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="px-4 sm:px-6 py-3 border-b border-gray-50 bg-gray-50/50">
          <p className="text-[10px] sm:text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredItems.length}</span> of {items.length} listings
          </p>
        </div>

        {/* List View */}
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-[10px] sm:text-xs font-semibold text-gray-500 px-4 sm:px-6 py-3 uppercase tracking-wider">Product</th>
                  <th className="text-left text-[10px] sm:text-xs font-semibold text-gray-500 px-4 py-3 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left text-[10px] sm:text-xs font-semibold text-gray-500 px-4 py-3 uppercase tracking-wider hidden lg:table-cell">Type</th>
                  <th className="text-right text-[10px] sm:text-xs font-semibold text-gray-500 px-4 py-3 uppercase tracking-wider">Price</th>
                  <th className="text-right text-[10px] sm:text-xs font-semibold text-gray-500 px-4 py-3 uppercase tracking-wider hidden sm:table-cell">Stock</th>
                  <th className="text-center text-[10px] sm:text-xs font-semibold text-gray-500 px-4 py-3 uppercase tracking-wider">Status</th>
                  <th className="text-right text-[10px] sm:text-xs font-semibold text-gray-500 px-4 sm:px-6 py-3 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <Icon name={item.type === 'service' ? 'settings' : item.type === 'rental' ? 'clock' : 'bag'} size={16} className="text-gray-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                          <p className="text-[10px] text-gray-400 font-mediumm">SKU: {item.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 sm:py-4 hidden md:table-cell">
                      <div>
                        <p className="text-xs text-gray-700">{item.category}</p>
                        <p className="text-[10px] text-gray-400">{item.subCategory}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 sm:py-4 hidden lg:table-cell">
                      <span className="text-xs text-gray-600 capitalize">{item.type}</span>
                    </td>
                    <td className="px-4 py-3 sm:py-4 text-right">
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">{item.price.toLocaleString()} रू</span>
                      <p className="text-[10px] text-gray-400">/{item.unit}</p>
                    </td>
                    <td className="px-4 py-3 sm:py-4 text-right hidden sm:table-cell">
                      <span className={`text-xs font-semibold ${item.type === 'service' ? 'text-gray-400' : item.stock <= 0 ? 'text-red-500' : item.stock < 20 ? 'text-orange-500' : 'text-gray-900'}`}>
                        {item.type === 'service' ? '—' : item.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${STATUS_CONFIG[item.status].bg} ${STATUS_CONFIG[item.status].color}`}>
                        {STATUS_CONFIG[item.status].label}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.status === 'DRAFT' && (
                          <button
                            onClick={() => handleSubmitForReview(item)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Submit for Review"
                          >
                            <Icon name="arrow-up-right" size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => setInventoryModal({ open: true, item })}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Quick Inventory Update"
                        >
                          <Icon name="catalog" size={14} />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Icon name="edit" size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <Icon name="catalog" size={20} className="text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-500 font-mediumm">No listings found</p>
                        <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Icon name={item.type === 'service' ? 'settings' : item.type === 'rental' ? 'clock' : 'bag'} size={18} className="text-gray-400" />
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold ${STATUS_CONFIG[item.status].bg} ${STATUS_CONFIG[item.status].color}`}>
                    {STATUS_CONFIG[item.status].label}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate">{item.name}</h4>
                <p className="text-[10px] text-gray-400 mb-3">{item.category} · {item.subCategory}</p>

                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                  <div>
                    <p className="text-[9px] text-gray-400 font-mediumm">Price</p>
                    <p className="text-sm font-semibold text-gray-900">{item.price.toLocaleString()} रू</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-gray-400 font-mediumm">Stock</p>
                    <p className={`text-sm font-semibold ${item.type === 'service' ? 'text-gray-400' : item.stock <= 0 ? 'text-red-500' : 'text-gray-900'}`}>
                      {item.type === 'service' ? '—' : item.stock}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-mediumm capitalize">{item.type} · {item.sku}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setInventoryModal({ open: true, item })}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Icon name="catalog" size={12} />
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Icon name="edit" size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Icon name="trash" size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full flex flex-col items-center gap-3 py-16">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Icon name="catalog" size={20} className="text-gray-300" />
                </div>
                <p className="text-sm text-gray-500 font-mediumm">No listings found</p>
                <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        title="Deactivate Listing"
        description={
          <>Are you sure you want to deactivate <strong>{deleteModal.item?.name}</strong>? The listing will be set to inactive and removed from the marketplace.</>
        }
        onConfirm={confirmDelete}
        confirmLabel="Deactivate"
        variant="warning"
      />

      {/* Add/Edit Listing Modal */}
      <ListingModal
        isOpen={isListingModalOpen}
        onClose={() => {
          setIsListingModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSaveListing}
        initialData={editingItem}
        kycVerified={merchant?.kycStatus === 'done'}
      />

      {/* Quick Inventory Update Modal */}
      <InventoryModal
        isOpen={inventoryModal.open}
        onClose={() => setInventoryModal({ open: false, item: null })}
        item={inventoryModal.item}
        onUpdate={handleUpdateInventory}
      />
    </DashboardLayout>
  );
}
