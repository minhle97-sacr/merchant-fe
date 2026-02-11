import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import TextField from '@/components/TextField';
import PinInput from '@/components/auth/PinInput';

interface MemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onSubmit: (e: React.FormEvent) => void;
    memberData: {
        phone: string;
        email: string;
        role: 'manager' | 'operator' | 'staff';
    };
    onDataChange: (data: any) => void;
    pinDigits: string[];
    onPinChange: (digits: string[]) => void;
    isPending: boolean;
    submitLabel: string;
    isEdit?: boolean;
}

export default function MemberModal({
    isOpen,
    onClose,
    title,
    onSubmit,
    memberData,
    onDataChange,
    pinDigits,
    onPinChange,
    isPending,
    submitLabel,
    isEdit = false
}: MemberModalProps) {
    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl w-[calc(100%-2rem)] sm:w-full max-w-md overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900">{title}</Dialog.Title>
                        <Dialog.Close className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Dialog.Close>
                    </div>
                    <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                        <TextField
                            label="Phone Number"
                            value={memberData.phone}
                            onChangeText={(text) => onDataChange({ ...memberData, phone: text })}
                            placeholder="08xxxxxxxxxx"
                            keyboardType="phone-pad"
                            inputClassName="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 bg-white text-base text-gray-900"
                        />
                        <TextField
                            label="Email Address (Optional)"
                            value={memberData.email || ''}
                            onChangeText={(text) => onDataChange({ ...memberData, email: text })}
                            placeholder="member@example.com"
                            keyboardType="email-address"
                            inputClassName="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-red-500 bg-white text-base text-gray-900"
                        />
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                {isEdit ? 'New PIN (Leave blank to keep current)' : 'Initial PIN'}
                            </label>
                            <PinInput 
                                digits={pinDigits} 
                                setDigits={onPinChange} 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Role</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['manager', 'operator', 'staff'].map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => onDataChange({ ...memberData, role: role as any })}
                                        className={`py-3 px-1 sm:px-2 rounded-xl border-2 transition-all font-mediumm capitalize text-[10px] sm:text-sm ${
                                            memberData.role === role 
                                            ? 'border-red-600 bg-red-50 text-red-600' 
                                            : 'border-gray-100 hover:border-gray-200 text-gray-600'
                                        }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={
                                isPending || 
                                !memberData.phone || 
                                (!isEdit && pinDigits.join('').length !== 6) ||
                                (isEdit && pinDigits.join('').length > 0 && pinDigits.join('').length !== 6)
                            }
                            className="w-full bg-red-600 text-white py-3.5 sm:py-4 rounded-xl font-semibold hover:bg-red-700 transition shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            {isPending ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : null}
                            {isPending ? `${submitLabel}...` : submitLabel}
                        </button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
