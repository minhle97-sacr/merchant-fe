import React from 'react';
import { DocPreview } from './DocPreview';
import { Input } from '../Input';

interface FinancialProfileTabProps {
    kycData: any;
    handleKYCInputChange: (field: string, value: any) => void;
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, field: string) => void;
    uploadingField: string | null;
    isProfileMode?: boolean;
    errors?: Record<string, string>;
}

export const FinancialProfileTab = ({
    kycData,
    handleKYCInputChange,
    handleFileUpload,
    uploadingField,
    isProfileMode,
    errors = {}
}: FinancialProfileTabProps) => {
    return (
        <>
            <h1 className="text-4xl font-semibold mb-6">Financial Profile</h1>
            <p className="text-gray-600 mb-10">Banking and sales records.</p>
            <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Primary Bank Name"
                        type="text"
                        placeholder="e.g. Nabil Bank"
                        value={kycData.financialProfile.bankName}
                        onChange={(e) => handleKYCInputChange('financialProfile.bankName', e.target.value)}
                        error={errors['financialProfile.bankName']}
                    />
                    <Input
                        label="Account Number"
                        type="text"
                        value={kycData.financialProfile.bankAccountNumber}
                        onChange={(e) => handleKYCInputChange('financialProfile.bankAccountNumber', e.target.value)}
                        error={errors['financialProfile.bankAccountNumber']}
                    />
                </div>
                <Input
                    label="Average Monthly Sales *"
                    type="number"
                    value={kycData.financialProfile.averageMonthlySales}
                    onChange={(e) => handleKYCInputChange('financialProfile.averageMonthlySales', parseInt(e.target.value))}
                    error={errors['financialProfile.averageMonthlySales']}
                />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${errors['financialProfile.bankStatementFile'] ? 'text-red-500' : ''}`}>Bank Statement (Last 3 Months) *</label>
                        <DocPreview 
                            field="financialProfile.bankStatementFile" 
                            kycData={kycData} 
                            handleFileUpload={handleFileUpload} 
                            uploadingField={uploadingField} 
                            error={errors['financialProfile.bankStatementFile']}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Sales Records / Invoices (Optional)</label>
                        <DocPreview 
                            field="financialProfile.salesRecordsFile" 
                            kycData={kycData} 
                            handleFileUpload={handleFileUpload} 
                            uploadingField={uploadingField} 
                            error={errors['financialProfile.salesRecordsFile']}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
