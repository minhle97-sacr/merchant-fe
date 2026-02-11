import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import TextField from '@/components/TextField';

interface OutletModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onSubmit: (e: React.FormEvent) => void;
    name: string;
    onNameChange: (value: string) => void;
    address: string;
    onAddressChange: (value: string) => void;
    isPending: boolean;
    submitLabel: string;
}

export default function OutletModal({
    isOpen,
    onClose,
    title,
    onSubmit,
    name,
    onNameChange,
    address,
    onAddressChange,
    isPending,
    submitLabel,
}: OutletModalProps) {
    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl w-[calc(100%-2rem)] sm:w-full max-w-md overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in duration-200 focus:outline-none">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                        <Dialog.Title className="text-lg font-semibold text-gray-900">{title}</Dialog.Title>
                        <Dialog.Close className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Dialog.Close>
                    </div>

                    <form onSubmit={onSubmit} className="p-6 space-y-5">
                        <TextField
                            label="Outlet Name"
                            value={name}
                            onChangeText={onNameChange}
                            placeholder="e.g. Main Branch"
                            inputClassName="w-full px-5 py-3.5 border border-gray-200 rounded-xl focus:border-red-500 bg-gray-50/50 text-base text-gray-900"
                        />
                        
                        <TextField
                            label="Address"
                            value={address}
                            onChangeText={onAddressChange}
                            placeholder="e.g. 123 Street Name, Area"
                            inputClassName="w-full px-5 py-3.5 border border-gray-200 rounded-xl focus:border-red-500 bg-gray-50/50 text-base text-gray-900"
                        />

                        <div className="flex items-center gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 rounded-xl transition border border-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending || !name.trim()}
                                className={`flex-[2] py-3.5 rounded-xl text-sm font-semibold text-white shadow-lg shadow-red-100 transition active:scale-95 ${
                                    isPending || !name.trim() 
                                    ? 'bg-gray-200 cursor-not-allowed' 
                                    : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {isPending ? 'Saving...' : submitLabel}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
