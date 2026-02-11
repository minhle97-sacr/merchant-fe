import React from 'react';
import { DocPreview } from './DocPreview';

interface VisualVerificationTabProps {
    kycData: any;
    handleKYCInputChange: (field: string, value: any) => void;
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, field: string) => void;
    uploadingField: string | null;
    isProfileMode?: boolean;
    errors?: Record<string, string>;
}

export const VisualVerificationTab = ({
    kycData,
    handleKYCInputChange,
    handleFileUpload,
    uploadingField,
    isProfileMode,
    errors = {}
}: VisualVerificationTabProps) => {
    return (
        <>
            <h1 className="text-4xl font-semibold mb-6">Visual Verification</h1>
            <p className="text-gray-600 mb-10">Photos of your business premises.</p>
            <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${errors['visualVerification.premisesExteriorPhoto'] ? 'text-red-500' : ''}`}>Exterior Photo *</label>
                        <DocPreview
                            field="visualVerification.premisesExteriorPhoto"
                            kycData={kycData}
                            handleFileUpload={handleFileUpload}
                            uploadingField={uploadingField}
                            error={errors['visualVerification.premisesExteriorPhoto']}
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${errors['visualVerification.interiorPhoto'] ? 'text-red-500' : ''}`}>Interior Photo *</label>
                        <DocPreview
                            field="visualVerification.interiorPhoto"
                            kycData={kycData}
                            handleFileUpload={handleFileUpload}
                            uploadingField={uploadingField}
                            error={errors['visualVerification.interiorPhoto']}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${errors['visualVerification.signboardPhoto'] ? 'text-red-500' : ''}`}>Signboard Photo *</label>
                        <DocPreview
                            field="visualVerification.signboardPhoto"
                            kycData={kycData}
                            handleFileUpload={handleFileUpload}
                            uploadingField={uploadingField}
                            error={errors['visualVerification.signboardPhoto']}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Storage/Kitchen Photo (Optional)</label>
                        <DocPreview
                            field="visualVerification.storageOrKitchenPhoto"
                            kycData={kycData}
                            handleFileUpload={handleFileUpload}
                            uploadingField={uploadingField}
                            error={errors['visualVerification.storageOrKitchenPhoto']}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
