import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Icon } from '@/components/Icon';
import { Input } from '@/components/Input';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onUpdate: (id: number, updates: { stock?: number; price?: number; status?: string }) => void;
}

export default function InventoryModal({
  isOpen,
  onClose,
  item,
  onUpdate,
}: InventoryModalProps) {
  const [stock, setStock] = useState(item?.stock?.toString() || '0');
  const [price, setPrice] = useState(item?.price?.toString() || '0');

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(item.id, {
      stock: parseInt(stock),
      price: parseFloat(price),
    });
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl w-[calc(100%-2rem)] sm:w-full max-w-md overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in duration-200 focus:outline-none">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <div>
              <Dialog.Title className="text-lg font-boldd text-gray-900">Update Inventory</Dialog.Title>
              <p className="text-xs text-gray-500 mt-0.5">{item.name}</p>
            </div>
            <Dialog.Close className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-100">
              <Icon name="close" size={20} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {item.type !== 'service' && (
              <Input
                label="Current Stock"
                type="number"
                value={stock}
                onChange={(e: any) => setStock(e.target.value)}
                placeholder="0"
                startIcon={<Icon name="catalog" size={16} className="text-gray-400" />}
              />
            )}

            <Input
              label="Price"
              type="number"
              value={price}
              onChange={(e: any) => setPrice(e.target.value)}
              placeholder="0.00"
              startIcon={<span className="text-gray-400 text-sm font-mediumm">रू</span>}
            />

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-sm font-boldd text-gray-500 hover:bg-gray-100 rounded-2xl transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 rounded-2xl bg-red-600 text-white text-sm font-boldd hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
              >
                Update
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
