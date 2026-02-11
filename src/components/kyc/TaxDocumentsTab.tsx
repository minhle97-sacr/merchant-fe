import React from 'react';
import { DocPreview } from './DocPreview';
import { Icon } from '@/components/Icon';
import { Input } from '@/components/Input';

interface TaxDocumentsTabProps {
    kycData: any;
    handleKYCInputChange: (field: string, value: any) => void;
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, field: string) => void;
    uploadingField: string | null;
    isProfileMode?: boolean;
    errors?: Record<string, string>;
}

export const TaxDocumentsTab = ({
    kycData,
    handleKYCInputChange,
    handleFileUpload,
    uploadingField,
    isProfileMode,
    errors = {}
}: TaxDocumentsTabProps) => {
    const licenses = kycData.taxStatutoryDocuments?.otherLicenses_licenseType || [];

    const addLicense = () => {
        const index = licenses.length;
        handleKYCInputChange(`taxStatutoryDocuments.otherLicenses_licenseType[${index}]`, '');
        handleKYCInputChange(`taxStatutoryDocuments.otherLicenses_licenseNumber[${index}]`, '');
        handleKYCInputChange(`taxStatutoryDocuments.otherLicenses_licenseExpiryDate[${index}]`, '');
        handleKYCInputChange(`taxStatutoryDocuments.otherLicenses_licenseFile[${index}]`, '');
    };

    const removeLicense = (index: number) => {
        const newTypes = [...kycData.taxStatutoryDocuments.otherLicenses_licenseType];
        const newNumbers = [...kycData.taxStatutoryDocuments.otherLicenses_licenseNumber];
        const newExpiries = [...kycData.taxStatutoryDocuments.otherLicenses_licenseExpiryDate];
        const newFiles = [...kycData.taxStatutoryDocuments.otherLicenses_licenseFile];

        newTypes.splice(index, 1);
        newNumbers.splice(index, 1);
        newExpiries.splice(index, 1);
        newFiles.splice(index, 1);

        handleKYCInputChange('taxStatutoryDocuments.otherLicenses_licenseType', newTypes);
        handleKYCInputChange('taxStatutoryDocuments.otherLicenses_licenseNumber', newNumbers);
        handleKYCInputChange('taxStatutoryDocuments.otherLicenses_licenseExpiryDate', newExpiries);
        handleKYCInputChange('taxStatutoryDocuments.otherLicenses_licenseFile', newFiles);
    };

    return (
        <>
            <h1 className="text-4xl font-semibold mb-6">Tax Documents</h1>
            <p className="text-gray-600 mb-10">Required tax and statutory compliance documents.</p>
            <div className="space-y-8">
                <div className="grid grid-cols-1 gap-6">
                    {kycData.businessInformation?.businessRegistrationType === 'VAT Registration' ? (
                        <>
                            <div>
                                <label className="block text-sm font-semibold mb-2">VAT Certificate (Optional)</label>
                                <DocPreview 
                                    field="taxStatutoryDocuments.vatCertificateFile" 
                                    kycData={kycData} 
                                    handleFileUpload={handleFileUpload} 
                                    uploadingField={uploadingField} 
                                    error={errors['taxStatutoryDocuments.vatCertificateFile']}
                                />
                            </div>
                            <Input
                                label="VAT Number (Optional)"
                                type="text"
                                value={kycData.taxStatutoryDocuments.vatNumber || ''}
                                onChange={(e) => handleKYCInputChange('taxStatutoryDocuments.vatNumber', e.target.value)}
                                placeholder="Enter VAT Number"
                                error={errors['taxStatutoryDocuments.vatNumber']}
                            />
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-semibold mb-2">PAN Certificate (Optional)</label>
                                <DocPreview 
                                    field="taxStatutoryDocuments.panCertificateFile" 
                                    kycData={kycData} 
                                    handleFileUpload={handleFileUpload} 
                                    uploadingField={uploadingField} 
                                    error={errors['taxStatutoryDocuments.panCertificateFile']}
                                />
                            </div>
                            <Input
                                label="PAN Number (Optional)"
                                type="text"
                                value={kycData.taxStatutoryDocuments.panNumber || ''}
                                onChange={(e) => handleKYCInputChange('taxStatutoryDocuments.panNumber', e.target.value)}
                                placeholder="Enter PAN Number"
                                error={errors['taxStatutoryDocuments.panNumber']}
                            />
                        </>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">Last Audit Report (Optional)</label>
                    <DocPreview 
                        field="taxStatutoryDocuments.lastAuditReportFile" 
                        kycData={kycData} 
                        handleFileUpload={handleFileUpload} 
                        uploadingField={uploadingField} 
                        error={errors['taxStatutoryDocuments.lastAuditReportFile']}
                    />
                </div>

                <div className="pt-6 border-t">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">Additional Licenses</h3>
                        <button
                            onClick={addLicense}
                            className="flex items-center gap-2 text-primary hover:underline font-semibold"
                        >
                            {/* <Icon name="plus" className='text-primary' size={20} /> */}
                            Add License
                        </button>
                    </div>

                    {licenses.map((_: any, index: number) => (
                        <div key={index} className="p-6 bg-gray-50 rounded-2xl mb-6 relative">
                            <button
                                onClick={() => removeLicense(index)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                            >
                                <Icon name="trash" size={20} />
                            </button>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold mb-2">License Document</label>
                                <DocPreview
                                    field={`taxStatutoryDocuments.otherLicenses_licenseFile[${index}]`}
                                    kycData={kycData}
                                    handleFileUpload={handleFileUpload}
                                    uploadingField={uploadingField}
                                    error={errors[`taxStatutoryDocuments.otherLicenses_licenseFile[${index}]`]}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <Input
                                    label="License Type"
                                    type="text"
                                    value={kycData.taxStatutoryDocuments.otherLicenses_licenseType[index] || ''}
                                    onChange={(e) => handleKYCInputChange(`taxStatutoryDocuments.otherLicenses_licenseType[${index}]`, e.target.value)}
                                    placeholder="e.g. Hotel License, Liquor License"
                                />
                                <Input
                                    label="License Number"
                                    type="text"
                                    value={kycData.taxStatutoryDocuments.otherLicenses_licenseNumber[index] || ''}
                                    onChange={(e) => handleKYCInputChange(`taxStatutoryDocuments.otherLicenses_licenseNumber[${index}]`, e.target.value)}
                                />
                                <Input
                                    containerClassName="md:col-span-2"
                                    label="Expiry Date"
                                    type="date"
                                    value={kycData.taxStatutoryDocuments.otherLicenses_licenseExpiryDate[index] || ''}
                                    onChange={(e) => handleKYCInputChange(`taxStatutoryDocuments.otherLicenses_licenseExpiryDate[${index}]`, e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
