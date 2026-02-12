'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Icon } from '@/components/Icon';
import { useGetFileUrlMutation } from '@/services/api';
import * as Dialog from '@radix-ui/react-dialog';

// Dynamic import for react-pdf to prevent SSR issues
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(
  () => import('./PDFViewer'),
  { ssr: false, loading: () => <div className="animate-spin"><Icon name="loader" size={24} /></div> }
);

interface DocPreviewProps {
  field?: string;
  kycData?: any;
  handleFileUpload?: (event: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  uploadingField?: string | null;
  key_value?: string;
  error?: string;
}

export function DocPreview({ field, kycData, handleFileUpload, uploadingField, key_value, error }: DocPreviewProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const resolveValue = (path: string, obj: any) => {
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
      if (arrayMatch) {
        const key = arrayMatch[1];
        const index = parseInt(arrayMatch[2]);
        current = current?.[key]?.[index];
      } else {
        current = current?.[part];
      }
      if (current === undefined) return undefined;
    }
    return current;
  };

  const value = field ? resolveValue(field, kycData) : key_value;  
  const isFile = value instanceof File;
  const isUploaded = typeof value === 'string' && value.length > 0;
  const isProcessing = uploadingField === 'processing' || (!!field && uploadingField === field);

  const getFileUrlMutation = useGetFileUrlMutation();

  const handleViewDocument = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof value === 'string') {
      try {
        const { url } = await getFileUrlMutation.mutateAsync(value);
        setPreviewUrl(url);
        setIsViewerOpen(true);
      } catch (error) {
        console.error('Error fetching file URL:', error);
        alert('Failed to open document. Please try again.');
      }
    }
  };

  const isReadOnly = !handleFileUpload;

  return (
    <>
      <div className={`block w-full ${isReadOnly ? '' : 'cursor-pointer'}`}>
        {!isReadOnly && (
          <input type="file" className="hidden" onChange={(e) => handleFileUpload?.(e, field || '')} accept="image/*,.pdf" id={`file-input-${field || key_value}`} />
        )}
        <label 
          htmlFor={isReadOnly ? undefined : `file-input-${field || key_value}`}
          className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center transition-colors ${isProcessing ? 'border-primary bg-red-50' : error ? 'border-red-500 bg-red-50' : isFile ? 'border-blue-400 bg-blue-50' : isUploaded ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-primary'} ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}
        >
          {isProcessing ? (
            <div className="animate-spin text-red-600 mb-2">
              <Icon name="loader" size={32} />
            </div>
          ) : error ? (
            <div className="text-red-500 mb-2"><Icon name="alert-circle" size={32} /></div>
          ) : isFile ? (
            <div className="text-blue-600 mb-2"><Icon name="file-text" size={32} /></div>
          ) : isUploaded ? (
            <div className="text-green-600 mb-2"><Icon name="check-circle" size={32} /></div>
          ) : (
            <div className="text-gray-300 mb-2"><Icon name="cloud-upload" size={32} /></div>
          )}
          <p className={`text-xs font-semibold uppercase tracking-wider ${error ? 'text-red-500' : isFile ? 'text-blue-600' : isUploaded ? 'text-green-600' : 'text-gray-500'}`}>
            {isProcessing ? 'Uploading...' : error ? 'Verification Failed' : isFile ? 'File Selected' : isUploaded ? 'Uploaded' : isReadOnly ? 'No File' : 'Upload File'}
          </p>
          {error && (
            <p className="mt-2 text-[10px] text-red-500 font-mediumm text-center px-2">
              {error}
            </p>
          )}
          {isFile && (
            <p className="mt-2 text-[10px] text-blue-500 font-mediumm truncate max-w-full px-2">
              {value.name}
            </p>
          )}
          {isUploaded && (
            <button
              type="button"
              onClick={handleViewDocument}
              disabled={getFileUrlMutation.isPending}
              className="mt-3 px-4 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              {getFileUrlMutation.isPending ? 'Getting Link...' : 'View Document'}
            </button>
          )}
        </label>
      </div>

      <Dialog.Root open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] h-[90vh] bg-white rounded-2xl shadow-2xl z-[101] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <Dialog.Title className="text-lg font-semibold text-gray-900">Document Preview</Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <Icon name="close" size={24} />
                </button>
              </Dialog.Close>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 flex flex-col items-center p-4">
              {previewUrl && (() => {
                const isPdf = typeof value === 'string' && value.toLowerCase().endsWith('.pdf');
                
                if (isPdf) {
                  return (
                    <PDFViewer file={previewUrl} />
                  );
                }
                
                return (
                  <div className="relative w-full h-full min-h-[500px]">
                    <Image 
                      src={previewUrl} 
                      alt="Document Preview" 
                      fill
                      className="object-contain shadow-lg rounded-lg"
                      unoptimized
                    />
                  </div>
                );
              })()}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

