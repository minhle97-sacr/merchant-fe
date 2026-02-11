import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Icon } from '@/components/Icon';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';

type ListingType = 'product' | 'service' | 'rental';
type ListingStatus = 'DRAFT' | 'PENDING_REVIEW' | 'LIVE' | 'REJECTED' | 'INACTIVE';

interface ListingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (item: any) => void;
    initialData?: any;
    kycVerified: boolean;
}

const CATEGORIES = [
    'Food',
    'Packaging & Disposables',
    'Cleaning & Hygiene',
    'Equipment & Appliances',
    'Services',
    'Rentals',
];

const SUB_CATEGORIES: Record<string, string[]> = {
    'Food': ['Grocery & Staples', 'Meat & Seafood', 'Beverages', 'Frozen Foods', 'Dairy & Bakery'],
    'Packaging & Disposables': ['Disposable Tableware', 'Food Containers', 'Bags & Wraps'],
    'Cleaning & Hygiene': ['Detergents', 'Sanitizers', 'Cleaning Tools'],
    'Equipment & Appliances': ['Kitchen Appliances', 'Storage Solutions', 'Furniture'],
    'Services': ['Catering', 'Cleaning', 'Maintenance', 'Consultancy'],
    'Rentals': ['Furniture', 'Equipment', 'Vehicles', 'Event Space'],
};

export default function ListingModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    kycVerified,
}: ListingModalProps) {
    const [formData, setFormData] = useState<any>(initialData || {
        type: 'product',
        name: '',
        description: '',
        category: 'Food',
        subCategory: 'Grocery & Staples',
        price: '',
        unit: '',
        stock: '',
        sku: '',
        taxPercent: 13,
        moq: 1,
        inventoryLevel: '',
        expiryDate: '',
        batchNumber: '',
        serviceDuration: '',
        serviceArea: '',
        certifications: '',
        requirements: '',
        instructions: '',
        minRentalDuration: '',
        depositRequirement: '',
        safetyGuidelines: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                type: 'product',
                name: '',
                description: '',
                category: 'Food',
                subCategory: 'Grocery & Staples',
                price: '',
                unit: '',
                stock: '',
                sku: '',
                taxPercent: 13,
                moq: 1,
                inventoryLevel: '',
                expiryDate: '',
                batchNumber: '',
                serviceDuration: '',
                serviceArea: '',
                certifications: '',
                requirements: '',
                instructions: '',
                minRentalDuration: '',
                depositRequirement: '',
                safetyGuidelines: '',
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
        
        // Reset subcategory if category changes
        if (field === 'category') {
            setFormData((prev: any) => ({ 
                ...prev, 
                category: value,
                subCategory: SUB_CATEGORIES[value]?.[0] || '' 
            }));
        }
    };

    const handleTypeChange = (type: ListingType) => {
        setFormData((prev: any) => ({ ...prev, type }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Determine status based on KYC (Phase 2)
        const status = kycVerified ? 'LIVE' : 'PENDING_REVIEW';
        
        onSubmit({
            ...formData,
            id: initialData?.id || Math.floor(Math.random() * 10000),
            status,
            createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0],
        });
        onClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
                <Dialog.Content className="fixed top-[5%] bottom-[5%] left-1/2 -translate-x-1/2 bg-white rounded-3xl w-[calc(100%-2rem)] sm:w-full max-w-3xl overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in duration-200 focus:outline-none flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30 shrink-0">
                        <div>
                            <Dialog.Title className="text-xl font-boldd text-gray-900">
                                {initialData ? 'Edit Listing' : 'Add New Listing'}
                            </Dialog.Title>
                            <p className="text-xs text-gray-500 mt-0.5">Fill in the details to list your offering</p>
                        </div>
                        <Dialog.Close className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-100">
                            <Icon name="close" size={20} />
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {/* Type Selection */}
                        <div className="mb-8">
                            <label className="text-sm font-semibold text-gray-700 mb-3 block ml-1">Listing Type</label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['product', 'service', 'rental'] as ListingType[]).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => handleTypeChange(t)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                                            formData.type === t
                                                ? 'border-red-600 bg-red-50/50'
                                                : 'border-gray-100 bg-white hover:border-gray-200'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center duration-200 transition-all ${
                                            formData.type === t ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            <Icon className={formData.type === t ? 'text-white' : 'text-gray-400'} name={t === 'service' ? 'settings' : t === 'rental' ? 'clock' : 'bag'} size={20} />
                                        </div>
                                        <span className={`text-xs font-boldd capitalize ${formData.type === t ? 'text-red-600' : 'text-gray-500'}`}>
                                            {t}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Name"
                                    placeholder="e.g. Basmati Rice (25kg)"
                                    value={formData.name}
                                    onChange={(e: any) => handleChange('name', e.target.value)}
                                    required
                                />
                                <Input
                                    label="SKU / Unique ID"
                                    placeholder="e.g. GS-001"
                                    value={formData.sku}
                                    onChange={(e: any) => handleChange('sku', e.target.value)}
                                    required
                                />
                            </div>

                            <Input
                                label="Description"
                                placeholder="Describe your listing in detail..."
                                value={formData.description}
                                onChange={(e: any) => handleChange('description', e.target.value)}
                                multiline
                                rows={3}
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Select
                                    label="Category"
                                    value={formData.category}
                                    onValueChange={(v) => handleChange('category', v)}
                                    options={CATEGORIES}
                                />
                                <Select
                                    label="Sub-category"
                                    value={formData.subCategory}
                                    onValueChange={(v) => handleChange('subCategory', v)}
                                    options={SUB_CATEGORIES[formData.category] || []}
                                />
                            </div>

                            <hr className="border-gray-100 my-2" />

                            {/* Pricing & Tax */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Input
                                    label={formData.type === 'service' ? 'Price / Unit' : formData.type === 'rental' ? 'Rental Rate' : 'Unit Price'}
                                    placeholder="0.00"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e: any) => handleChange('price', e.target.value)}
                                    required
                                    startIcon={<span className="text-gray-400 text-sm font-mediumm">रू</span>}
                                />
                                <Input
                                    label="Unit of Measure"
                                    placeholder="e.g. kg, pcs, hr"
                                    value={formData.unit}
                                    onChange={(e: any) => handleChange('unit', e.target.value)}
                                    required
                                />
                                <Input
                                    label="Tax %"
                                    placeholder="13"
                                    type="number"
                                    value={formData.taxPercent}
                                    onChange={(e: any) => handleChange('taxPercent', e.target.value)}
                                    required
                                />
                            </div>

                            {/* Inventory / Availability */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {formData.type !== 'service' && (
                                    <Input
                                        label={formData.type === 'rental' ? 'Available Units' : 'Current Stock'}
                                        placeholder="0"
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e: any) => handleChange('stock', e.target.value)}
                                        required
                                    />
                                )}
                                <Input
                                    label="MOQ (Min Order Qty)"
                                    placeholder="1"
                                    type="number"
                                    value={formData.moq}
                                    onChange={(e: any) => handleChange('moq', e.target.value)}
                                    required
                                />
                            </div>

                            {/* Type Specific Fields */}
                            {formData.type === 'product' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-50 pt-6">
                                    <Input
                                        label="Batch Number"
                                        placeholder="Optional"
                                        value={formData.batchNumber}
                                        onChange={(e: any) => handleChange('batchNumber', e.target.value)}
                                    />
                                    <Input
                                        label="Expiry Date"
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={(e: any) => handleChange('expiryDate', e.target.value)}
                                    />
                                </div>
                            )}

                            {formData.type === 'service' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-50 pt-6">
                                    <Input
                                        label="Expected Duration"
                                        placeholder="e.g. 2 hours"
                                        value={formData.serviceDuration}
                                        onChange={(e: any) => handleChange('serviceDuration', e.target.value)}
                                    />
                                    <Input
                                        label="Service Area"
                                        placeholder="e.g. Kathmandu Valley"
                                        value={formData.serviceArea}
                                        onChange={(e: any) => handleChange('serviceArea', e.target.value)}
                                    />
                                    <div className="sm:col-span-2">
                                        <Input
                                            label="Required Certifications / Requirements"
                                            placeholder="Certifications or personnel requirements..."
                                            value={formData.certifications}
                                            onChange={(e: any) => handleChange('certifications', e.target.value)}
                                            multiline
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.type === 'rental' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-50 pt-6">
                                    <Input
                                        label="Min Rental Duration"
                                        placeholder="e.g. 1 day"
                                        value={formData.minRentalDuration}
                                        onChange={(e: any) => handleChange('minRentalDuration', e.target.value)}
                                    />
                                    <Input
                                        label="Deposit Requirement"
                                        placeholder="0.00"
                                        type="number"
                                        value={formData.depositRequirement}
                                        onChange={(e: any) => handleChange('depositRequirement', e.target.value)}
                                        startIcon={<span className="text-gray-400 text-sm font-mediumm">रू</span>}
                                    />
                                    <div className="sm:col-span-2">
                                        <Input
                                            label="Safety Guidelines & Maintenance Info"
                                            placeholder="Enter guidelines..."
                                            value={formData.safetyGuidelines}
                                            onChange={(e: any) => handleChange('safetyGuidelines', e.target.value)}
                                            multiline
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="sm:col-span-2">
                                <Input
                                    label="Setup / Special Instructions"
                                    placeholder="Any additional instructions for the customer or admin..."
                                    value={formData.instructions}
                                    onChange={(e: any) => handleChange('instructions', e.target.value)}
                                    multiline
                                    rows={2}
                                />
                            </div>
                        </div>

                        {/* Image Placeholder */}
                        <div className="mt-8">
                            <label className="text-sm font-semibold text-gray-700 mb-3 block ml-1">Images (Min 1, Max 6)</label>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                <button
                                    type="button"
                                    className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-red-500 hover:bg-red-50 transition-all text-gray-400 hover:text-red-500"
                                >
                                    <Icon name="plus" size={20} />
                                    <span className="text-[10px] font-boldd">Upload</span>
                                </button>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                                        <Icon name="bag" size={20} className="text-gray-200" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-sm font-boldd text-gray-500 hover:bg-gray-100 rounded-2xl transition-colors border border-gray-200 bg-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="flex-[2] py-3 rounded-2xl bg-red-600 text-white text-sm font-boldd hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
                        >
                            {initialData ? 'Update Listing' : kycVerified ? 'Publish Listing' : 'Submit for Review'}
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
