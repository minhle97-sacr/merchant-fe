import React, { useRef } from 'react';
import { DocPreview } from './DocPreview';
import { toast } from 'sonner';
import { Icon } from '@/components/Icon';
import { Checkbox } from '../Checkbox';
import { Select } from '../Select';
import { Input } from '../Input';


interface OwnerPrimaryControllerTabProps {
    kycData: any;
    handleKYCInputChange: (field: string, value: any) => void;
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, field: string) => void;
    uploadingField: string | null;
    isProfileMode?: boolean;
    errors?: Record<string, string>;
}

export const OwnerPrimaryControllerTab = ({
    kycData,
    handleKYCInputChange,
    handleFileUpload,
    uploadingField,
    isProfileMode,
    errors = {}
}: OwnerPrimaryControllerTabProps) => {

    const addOwner = () => {
        const newIndex = kycData.ownerPrimaryController.length;
        const owners = [...kycData.ownerPrimaryController];
        owners.push({
            ownerFullName: '',
            ownerCitizenship: 'Nepalese',
            ownerEmail: '',
            ownerPhoneNumber: '',
            ownerAlternatePhone: '',
            governmentIdNumber: '',
            governmentIdType: '',
            governmentIdFront: '',
            governmentIdBack: '',
            ownerPhotoSelfie: '',
            permanentAddress: '',
            houseNumber: '',
            streetName: '',
            wardNumber: '',
            municipality: '',
            district: '',
            province: '',
            country: '',
            fathersName: '',
            grandFathersName: '',
            ownershipPercentage: 0
        });
        handleKYCInputChange('ownerPrimaryController', owners);

        // Scroll to the new section
        setTimeout(() => {
            const element = document.getElementById(`owner-section-${newIndex}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const removeOwner = (index: number) => {
        const owners = kycData.ownerPrimaryController.filter((_: any, i: number) => i !== index);
        handleKYCInputChange('ownerPrimaryController', owners);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-semibold mb-6 text-gray-900">Owner / Primary Controller</h1>
            <p className="text-gray-600 mb-10 text-lg">Details about individuals with ownership in the business.</p>

            <div className="space-y-8">
                <div className={`p-6 rounded-[24px] border transition-all duration-300 ${kycData.isSoleProprietor ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
                    <Checkbox
                        id="isSoleProprietor"
                        checked={kycData.isSoleProprietor}
                        onCheckedChange={(checked) => {
                            const isSole = checked === true;
                            handleKYCInputChange('isSoleProprietor', isSole);
                            if (isSole) {
                                if (kycData.ownerPrimaryController.length > 1) {
                                    // Reset to only the first owner and set percentage to 100
                                    const firstOwner = { ...kycData.ownerPrimaryController[0], ownershipPercentage: 100 };
                                    handleKYCInputChange('ownerPrimaryController', [firstOwner]);
                                } else {
                                    handleKYCInputChange('ownerPrimaryController[0].ownershipPercentage', 100);
                                }
                            }
                        }}
                        label={
                            <div className="flex-1">
                                <p className="text-base font-semibold text-gray-900">I am the sole proprietor / 100% owner</p>
                                <p className="text-sm text-gray-500">Business is owned entirely by one individual.</p>
                            </div>
                        }
                        labelClassName="flex-1 cursor-pointer"
                    />
                </div>

                {!kycData.isSoleProprietor && (
                    <div className="flex justify-end">
                        <button
                            onClick={addOwner}
                            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors font-mediumm"
                        >
                            <Icon name="plus" size={18} />
                            <span>Add Owner</span>
                        </button>
                    </div>
                )}

                {kycData.ownerPrimaryController.map((owner: any, index: number) => (
                    <div
                        key={index}
                        id={`owner-section-${index}`}
                        style={{ scrollMarginTop: '120px' }}
                        className="p-8 border border-gray-200 rounded-[32px] bg-white shadow-sm space-y-6 animate-in fade-in slide-in-from-top-4 duration-500"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                    <Icon name="user" size={20} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {kycData.isSoleProprietor ? 'Primary Controller' : index === 0 ? 'Primary Controller' : `Additional Owner #${index + 1}`}
                                </h3>
                            </div>
                            {index > 0 && (
                                <button
                                    onClick={() => removeOwner(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Icon name="trash" size={20} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className={`block text-sm font-semibold mb-3 ml-1 ${errors[`ownerPrimaryController[${index}].governmentIdFront`] ? 'text-red-500' : ''}`}>ID Front Photo *</label>
                                <DocPreview
                                    field={`ownerPrimaryController[${index}].governmentIdFront`}
                                    kycData={kycData}
                                    handleFileUpload={handleFileUpload}
                                    uploadingField={uploadingField}
                                    error={errors[`ownerPrimaryController[${index}].governmentIdFront`]}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-semibold mb-3 ml-1 ${errors[`ownerPrimaryController[${index}].governmentIdBack`] ? 'text-red-500' : ''}`}>ID Back Photo *</label>
                                <DocPreview
                                    field={`ownerPrimaryController[${index}].governmentIdBack`}
                                    kycData={kycData}
                                    handleFileUpload={handleFileUpload}
                                    uploadingField={uploadingField}
                                    error={errors[`ownerPrimaryController[${index}].governmentIdBack`]}
                                />
                                {errors[`ownerPrimaryController[${index}].governmentIdBack`] && <span className="text-xs text-red-500 ml-1 mt-1 font-mediumm">{errors[`ownerPrimaryController[${index}].governmentIdBack`]}</span>}
                            </div>

                            <div className="sm:col-span-3">
                                <label className={`block text-sm font-semibold mb-3 ml-1 ${errors[`ownerPrimaryController[${index}].ownerPhotoSelfie`] ? 'text-red-500' : ''}`}>Selfie Photo *</label>
                                <DocPreview
                                    field={`ownerPrimaryController[${index}].ownerPhotoSelfie`}
                                    kycData={kycData}
                                    handleFileUpload={handleFileUpload}
                                    uploadingField={uploadingField}
                                    error={errors[`ownerPrimaryController[${index}].ownerPhotoSelfie`]}
                                />
                                {errors[`ownerPrimaryController[${index}].ownerPhotoSelfie`] && <span className="text-xs text-red-500 ml-1 mt-1 font-mediumm">{errors[`ownerPrimaryController[${index}].ownerPhotoSelfie`]}</span>}
                            </div>

                            <div className="grid grid-cols-2 justify-end gap-4 pb-1 col-span-2">
                                <Select
                                    label="Government ID Type *"
                                    value={owner.governmentIdType}
                                    onValueChange={(value) => handleKYCInputChange(`ownerPrimaryController[${index}].governmentIdType`, value)}
                                    placeholder="Select ID Type"
                                    options={[
                                        'Citizenship',
                                        'Passport',
                                        'Voter ID',
                                        'Driving License'
                                    ]}
                                    error={errors[`ownerPrimaryController[${index}].governmentIdType`]}
                                />
                                <Input
                                    label="ID Number *"
                                    type="text"
                                    value={owner.governmentIdNumber}
                                    onChange={(e) => handleKYCInputChange(`ownerPrimaryController[${index}].governmentIdNumber`, e.target.value)}
                                    error={errors[`ownerPrimaryController[${index}].governmentIdNumber`]}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-6 border-t border-gray-100">
                            <div className="md:col-span-2">
                                <Input
                                    label="Full Name *"
                                    type="text"
                                    value={owner.ownerFullName}
                                    onChange={(e) => handleKYCInputChange(`ownerPrimaryController[${index}].ownerFullName`, e.target.value)}
                                    error={errors[`ownerPrimaryController[${index}].ownerFullName`]}
                                />
                            </div>
                            <Input
                                label="Father's Name *"
                                type="text"
                                value={owner.fathersName}
                                onChange={(e) => handleKYCInputChange(`ownerPrimaryController[${index}].fathersName`, e.target.value)}
                                error={errors[`ownerPrimaryController[${index}].fathersName`]}
                            />
                            <Input
                                label="Grandfather's Name *"
                                type="text"
                                value={owner.grandFathersName}
                                onChange={(e) => handleKYCInputChange(`ownerPrimaryController[${index}].grandFathersName`, e.target.value)}
                                error={errors[`ownerPrimaryController[${index}].grandFathersName`]}
                            />
                            <Input
                                label="Citizenship *"
                                type="text"
                                placeholder="e.g. Nepalese"
                                value={owner.ownerCitizenship}
                                onChange={(e) => handleKYCInputChange(`ownerPrimaryController[${index}].ownerCitizenship`, e.target.value)}
                                error={errors[`ownerPrimaryController[${index}].ownerCitizenship`]}
                            />
                            <div className="md:col-span-2">
                                <Input
                                    label="Permanent Address"
                                    type="text"
                                    value={owner.permanentAddress}
                                    onChange={(e) => handleKYCInputChange(`ownerPrimaryController[${index}].permanentAddress`, e.target.value)}
                                    placeholder="Enter full permanent address"
                                />
                            </div>
                            <Input
                                label="House Number"
                                type="text"
                                value={owner.houseNumber}
                                onChange={(e) => handleKYCInputChange(`ownerPrimaryController[${index}].houseNumber`, e.target.value)}
                            />
                            <Input
                                label="Street Name"
                                type="text"
                                value={owner.streetName}
                                onChange={(e) => handleKYCInputChange(`ownerPrimaryController[${index}].streetName`, e.target.value)}
                            />
                            <Input
                                label="Ward Number"
                                type="number"
                                value={owner.wardNumber}
                                onChange={(e) => handleKYCInputChange(`ownerPrimaryController[${index}].wardNumber`, e.target.value)}
                            />
                            <Input
                                label="Municipality"
                                type="text"
                                value={owner.municipality}
                                onChange={(e) => handleKYCInputChange(`ownerPrimaryController[${index}].municipality`, e.target.value)}
                            />
                            <Input
                                label="District"
                                type="text"
                                value={owner.district}
                                onChange={(e) => handleKYCInputChange(`ownerPrimaryController[${index}].district`, e.target.value)}
                            />
                            <Input
                                label="Province"
                                type="text"
                                value={owner.province}
                                onChange={(e) => handleKYCInputChange(`ownerPrimaryController[${index}].province`, e.target.value)}
                            />
                            <Input
                                label="Country"
                                type="text"
                                value={owner.country}
                                onChange={(e) => handleKYCInputChange(`ownerPrimaryController[${index}].country`, e.target.value)}
                                placeholder="e.g. Nepal"
                            />
                            <Input
                                label="Phone Number *"
                                type="tel"
                                disabled={index === 0}
                                value={owner.ownerPhoneNumber}
                                onChange={(e) => handleKYCInputChange(`ownerPrimaryController[${index}].ownerPhoneNumber`, e.target.value)}
                                error={errors[`ownerPrimaryController[${index}].ownerPhoneNumber`]}
                            />
                            <Input
                                label="Alternate Phone"
                                type="tel"
                                value={owner.ownerAlternatePhone}
                                onChange={(e) => handleKYCInputChange(`ownerPrimaryController[${index}].ownerAlternatePhone`, e.target.value)}
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                value={owner.ownerEmail}
                                onChange={(e) => handleKYCInputChange(`ownerPrimaryController[${index}].ownerEmail`, e.target.value)}
                            />
                            <Input
                                label="Ownership Percentage *"
                                type="number"
                                placeholder="e.g. 25"
                                value={owner.ownershipPercentage}
                                onChange={(e) => handleKYCInputChange(`ownerPrimaryController[${index}].ownershipPercentage`, parseFloat(e.target.value) || 0)}
                                error={errors[`ownerPrimaryController[${index}].ownershipPercentage`]}
                                disabled={kycData.isSoleProprietor}
                            />
                        </div>
                    </div>
                ))}

                {!kycData.isSoleProprietor && (
                    <div className="lg:hidden p-6 border-2 border-dashed border-gray-100 rounded-[32px] bg-gray-50/50 mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600 font-mediumm">Total Ownership Percentage</span>
                            <span className={`text-xl font-bold ${Math.abs(kycData.ownerPrimaryController.reduce((sum: number, o: any) => sum + (parseFloat(o.ownershipPercentage) || 0), 0) - 100) < 0.01 ? 'text-green-500' : 'text-red-500'}`}>
                                {kycData.ownerPrimaryController.reduce((sum: number, o: any) => sum + (parseFloat(o.ownershipPercentage) || 0), 0)}%
                            </span>
                        </div>
                        {errors['ownerPrimaryController.totalPercentage'] && (
                            <p className="text-red-500 text-sm font-mediumm text-center">{errors['ownerPrimaryController.totalPercentage']}</p>
                        )}
                        {kycData.ownerPrimaryController.some((o: any) => !o.ownershipPercentage || parseFloat(o.ownershipPercentage) <= 0) && (
                            <p className="text-red-500 text-xs font-mediumm text-center mt-2 flex items-center justify-center gap-1">
                                <Icon name="alert-circle" size={14} />
                                <span>Individual ownership must be greater than 0%</span>
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};