import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: React.ReactNode;
    onConfirm: () => void;
    confirmLabel: string;
    isPending?: boolean;
    variant?: 'danger' | 'warning' | 'success';
    icon?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    onConfirm,
    confirmLabel,
    isPending = false,
    variant = 'danger',
    icon
}) => {
    const variantStyles = {
        danger: {
            iconBg: 'bg-red-50 text-red-600',
            button: 'bg-red-600 hover:bg-red-700 shadow-red-100',
        },
        warning: {
            iconBg: 'bg-amber-50 text-amber-600',
            button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-100',
        },
        success: {
            iconBg: 'bg-green-50 text-green-600',
            button: 'bg-green-600 hover:bg-green-700 shadow-green-100',
        }
    };

    const styles = variantStyles[variant];

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
                <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl p-6 sm:p-8 shadow-2xl z-50 animate-in zoom-in-95 duration-200">
                    <div className="text-center">
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 ${styles.iconBg}`}>
                            {icon || (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            )}
                        </div>
                        <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                            {title}
                        </Dialog.Title>
                        <Dialog.Description className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8">
                            {description}
                        </Dialog.Description>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={onConfirm}
                                disabled={isPending}
                                className={`w-full py-3 sm:py-3.5 rounded-xl font-semibold text-base sm:text-lg transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 text-white ${styles.button}`}
                            >
                                {isPending ? 'Processing...' : confirmLabel}
                            </button>
                            <Dialog.Close asChild>
                                <button 
                                    className="w-full py-3 sm:py-3.5 text-gray-500 font-semibold hover:text-gray-700 transition-colors text-base sm:text-lg"
                                    disabled={isPending}
                                >
                                    Cancel
                                </button>
                            </Dialog.Close>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default ConfirmationModal;
