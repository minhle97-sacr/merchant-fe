import React from 'react';
import { DocPreview } from './DocPreview';
import { Input } from '../Input';

interface LocationPremisesTabProps {
    kycData: any;
    handleKYCInputChange: (field: string, value: any) => void;
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, field: string) => void;
    uploadingField: string | null;
    isProfileMode?: boolean;
    errors?: Record<string, string>;
}

export const LocationPremisesTab = ({
    kycData,
    handleKYCInputChange,
    handleFileUpload,
    uploadingField,
    isProfileMode,
    errors = {}
}: LocationPremisesTabProps) => {
    return (
        <>
            <h1 className="text-4xl font-semibold mb-6">Location & Premises</h1>
            <p className="text-gray-600 mb-10">Where is your business located?</p>
            <div className="space-y-6">
                <Input
                    label="Physical Address *"
                    type="text"
                    value={kycData.locationPremises.physicalAddress}
                    onChange={(e) => handleKYCInputChange('locationPremises.physicalAddress', e.target.value)}
                    error={errors['locationPremises.physicalAddress']}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Ward Number *"
                        type="text"
                        placeholder="e.g. 5"
                        value={kycData.locationPremises.wardNumber}
                        onChange={(e) => handleKYCInputChange('locationPremises.wardNumber', e.target.value)}
                        error={errors['locationPremises.wardNumber']}
                    />
                    <Input
                        label="City *"
                        type="text"
                        placeholder="e.g. Kathmandu"
                        value={kycData.locationPremises.city}
                        onChange={(e) => handleKYCInputChange('locationPremises.city', e.target.value)}
                        error={errors['locationPremises.city']}
                    />
                </div>
                <div>
                    <label className={`block text-sm font-semibold mb-2 ${errors['locationPremises.ownershipOfPremises'] ? 'text-red-500' : ''}`}>Ownership of Premises *</label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {['Rented', 'Owned'].map((type) => (
                            <button
                                key={type}
                                onClick={() => handleKYCInputChange('locationPremises.ownershipOfPremises', type)}
                                className={`px-4 py-3 rounded-lg border font-semibold transition-all ${kycData.locationPremises.ownershipOfPremises === type
                                    ? 'bg-gradient-to-r from-primary to-[#FF6B6B] text-white border-primary'
                                    : errors['locationPremises.ownershipOfPremises'] ? 'bg-white text-red-500 border-red-500 hover:border-red-600' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    {errors['locationPremises.ownershipOfPremises'] && <span className="text-xs text-red-500 ml-1 mt-1 font-mediumm">{errors['locationPremises.ownershipOfPremises']}</span>}
                </div>
                {kycData.locationPremises.ownershipOfPremises === 'Rented' && (
                    <div>
                        <label className="block text-sm font-semibold mb-2">Rent Agreement</label>
                        <DocPreview 
                            field="locationPremises.rentAgreementFile" 
                            kycData={kycData} 
                            handleFileUpload={handleFileUpload} 
                            uploadingField={uploadingField} 
                            error={errors['locationPremises.rentAgreementFile']}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
