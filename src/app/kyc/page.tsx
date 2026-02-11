'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStore } from '@/store/useUserStore';
import { Icon } from '@/components/Icon';
import {
    useUpdateBusinessProfileMutation,
    useGetPresignedUrlMutation,
    uploadFileToS3,
    useVerifyUrlMutation,
    useGetOutletsQuery,
    useGetBusinessProfileQuery
} from '@/services/api';
import { toast } from 'sonner';
import {
    BusinessInfoTab,
    TaxDocumentsTab,
    LocationPremisesTab,
    VisualVerificationTab,
    OwnerPrimaryControllerTab,
    FinancialProfileTab,
    OperationalTab,
    PaymentOptionsTab,
    ConsentTab
} from '@/components/kyc/index';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import Logo from '@/components/Logo';

const LIBRARIES: Libraries = ['places'];

export default function KYCScreen() {
    return (
        <ProtectedRoute>
            <KYCContent />
        </ProtectedRoute>
    );
}

const TABS = [
    'Business Info',
    'Tax Documents',
    'Location',
    'Visuals',
    'Owner / Primary Controller',
    'Financial',
    'Operational',
    'Payment Options',
    'Consent'
];

function KYCContent() {
    const router = useRouter();
    const { logout, refreshProfile } = useAuth();
    const { profile } = useUserStore();
    const [kycStep, setKycStep] = useState(1);
    const [tempFiles, setTempFiles] = useState<Record<string, File>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [forceSearchName, setForceSearchName] = useState<string | undefined>("98");


    const { data: businessProfile, isLoading: isProfileLoading } = useGetBusinessProfileQuery();
    const { data: outlets } = useGetOutletsQuery();
    const showOutletField = !outlets || outlets.length === 0;

    const updateProfile = useUpdateBusinessProfileMutation();

    const [kycData, setKycData] = useState<any>(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: LIBRARIES,
        region: 'NP'
    });

    // useEffect(() => {
    //     refreshProfile().then(() => { })
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])


    useEffect(() => {
        if (!isProfileLoading && !kycData) {
            setKycData({
                businessInformation: {
                    businessName: businessProfile?.businessInformation?.businessName || '',
                    businessName_nepali: businessProfile?.businessInformation?.businessName_nepali || '',
                    tradeName: businessProfile?.businessInformation?.tradeName || '',
                    outletName: '',
                    businessRegistrationType: businessProfile?.businessInformation?.businessRegistrationType || '',
                    registrationNumber: businessProfile?.businessInformation?.registrationNumber || '',
                    registrationCertificateFile: businessProfile?.businessInformation?.registrationCertificateFile || '',
                    dateOfRegistration: businessProfile?.businessInformation?.dateOfRegistration || '',
                    dateOfRegistration_bs: businessProfile?.businessInformation?.dateOfRegistration_bs || '',
                    yearsInOperation: businessProfile?.businessInformation?.yearsInOperation ? String(businessProfile.businessInformation.yearsInOperation) : '',
                    businessStatus: businessProfile?.businessInformation?.businessStatus || '',
                },
                taxStatutoryDocuments: {
                    panCertificateFile: businessProfile?.taxStatutoryDocuments?.panCertificateFile || '',
                    panNumber: businessProfile?.taxStatutoryDocuments?.panNumber || '',
                    vatCertificateFile: businessProfile?.taxStatutoryDocuments?.vatCertificateFile || '',
                    vatNumber: businessProfile?.taxStatutoryDocuments?.vatNumber || '',
                    lastAuditReportFile: businessProfile?.taxStatutoryDocuments?.lastAuditReportFile || '',
                    otherLicenses_licenseType: businessProfile?.taxStatutoryDocuments?.otherLicenses_licenseType || [],
                    otherLicenses_licenseNumber: businessProfile?.taxStatutoryDocuments?.otherLicenses_licenseNumber || [],
                    otherLicenses_licenseExpiryDate: businessProfile?.taxStatutoryDocuments?.otherLicenses_licenseExpiryDate || [],
                    otherLicenses_licenseFile: businessProfile?.taxStatutoryDocuments?.otherLicenses_licenseFile || [],
                },
                locationPremises: {
                    physicalAddress: businessProfile?.locationPremises?.physicalAddress || '',
                    wardNumber: businessProfile?.locationPremises?.wardNumber ? String(businessProfile.locationPremises.wardNumber) : '',
                    city: businessProfile?.locationPremises?.city || '',
                    gpsCoordinates_lat: businessProfile?.locationPremises?.gpsCoordinates_lat || 0,
                    gpsCoordinates_lng: businessProfile?.locationPremises?.gpsCoordinates_lng || 0,
                    ownershipOfPremises: businessProfile?.locationPremises?.ownershipOfPremises || 'Rented',
                    rentAgreementFile: businessProfile?.locationPremises?.rentAgreementFile || '',
                },
                visualVerification: {
                    premisesExteriorPhoto: businessProfile?.visualVerification?.premisesExteriorPhoto || '',
                    interiorPhoto: businessProfile?.visualVerification?.interiorPhoto || '',
                    signboardPhoto: businessProfile?.visualVerification?.signboardPhoto || '',
                    storageOrKitchenPhoto: businessProfile?.visualVerification?.storageOrKitchenPhoto || '',
                },
                ownerPrimaryController: Array.isArray(businessProfile?.ownerPrimaryController) && businessProfile.ownerPrimaryController.length > 0
                    ? businessProfile.ownerPrimaryController.map((owner: any) => ({
                        ownerFullName: owner.ownerFullName || '',
                        ownerCitizenship: owner.ownerCitizenship || '',
                        ownerEmail: owner.ownerEmail || '',
                        ownerPhoneNumber: owner.ownerPhoneNumber || '',
                        ownerAlternatePhone: owner.ownerAlternatePhone || '',
                        governmentIdNumber: owner.governmentIdNumber || '',
                        governmentIdType: owner.governmentIdType || '',
                        governmentIdFront: owner.governmentIdFront || '',
                        governmentIdBack: owner.governmentIdBack || '',
                        ownerPhotoSelfie: owner.ownerPhotoSelfie || '',
                        permanentAddress: owner.permanentAddress || owner.ownerPermanentAddress || '',
                        houseNumber: owner.houseNumber || '',
                        streetName: owner.streetName || '',
                        wardNumber: owner.wardNumber ? String(owner.wardNumber) : '',
                        municipality: owner.municipality || '',
                        district: owner.district || '',
                        province: owner.province || '',
                        country: owner.country || '',
                        fathersName: owner.fathersName || '',
                        grandFathersName: owner.grandFathersName || '',
                        ownershipPercentage: owner.ownershipPercentage || (businessProfile?.isSoleProprietor) ? 100 : 0,
                    }))
                    : [{
                        ownerFullName: businessProfile?.ownerPrimaryController?.ownerFullName || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim(),
                        ownerCitizenship: businessProfile?.ownerPrimaryController?.ownerCitizenship || '',
                        ownerEmail: businessProfile?.ownerPrimaryController?.ownerEmail || profile?.email || '',
                        ownerPhoneNumber: businessProfile?.ownerPrimaryController?.ownerPhoneNumber || profile?.phone || '',
                        ownerAlternatePhone: businessProfile?.ownerPrimaryController?.ownerAlternatePhone || '',
                        governmentIdNumber: businessProfile?.ownerPrimaryController?.governmentIdNumber || '',
                        governmentIdType: businessProfile?.ownerPrimaryController?.governmentIdType || '',
                        governmentIdFront: businessProfile?.ownerPrimaryController?.governmentIdFront || '',
                        governmentIdBack: businessProfile?.ownerPrimaryController?.governmentIdBack || '',
                        ownerPhotoSelfie: businessProfile?.ownerPrimaryController?.ownerPhotoSelfie || '',
                        permanentAddress: businessProfile?.ownerPrimaryController?.ownerPermanentAddress || businessProfile?.ownerPrimaryController?.permanentAddress || '',
                        houseNumber: businessProfile?.ownerPrimaryController?.houseNumber || '',
                        streetName: businessProfile?.ownerPrimaryController?.streetName || '',
                        wardNumber: businessProfile?.ownerPrimaryController?.wardNumber ? String(businessProfile.ownerPrimaryController.wardNumber) : '',
                        municipality: businessProfile?.ownerPrimaryController?.municipality || '',
                        district: businessProfile?.ownerPrimaryController?.district || '',
                        province: businessProfile?.ownerPrimaryController?.province || '',
                        country: businessProfile?.ownerPrimaryController?.country || '',
                        fathersName: businessProfile?.ownerPrimaryController?.fathersName || '',
                        grandFathersName: businessProfile?.ownerPrimaryController?.grandFathersName || '',
                        ownershipPercentage: 100,
                    }],
                isSoleProprietor: businessProfile?.isSoleProprietor ?? true,
                financialProfile: {
                    averageMonthlySales: businessProfile?.financialProfile?.averageMonthlySales || 0,
                    paymentAcceptanceTypes: businessProfile?.financialProfile?.paymentAcceptanceTypes || [],
                    bankAccountExists: businessProfile?.financialProfile?.bankAccountExists ?? true,
                    bankName: businessProfile?.financialProfile?.bankName || '',
                    bankAccountNumber: businessProfile?.financialProfile?.bankAccountNumber || '',
                    bankStatementFile: businessProfile?.financialProfile?.bankStatementFile || '',
                    salesRecordsFile: businessProfile?.financialProfile?.salesRecordsFile || '',
                },
                operational: {
                    dailyOperatingHours: businessProfile?.operational?.dailyOperatingHours || [],
                    peakBusinessDays: businessProfile?.operational?.peakBusinessDays || [],
                    numberOfStaff: businessProfile?.operational?.numberOfStaff || 0,
                    supplierDependencyLevel: businessProfile?.operational?.supplierDependencyLevel || "",
                    existingCreditObligations: businessProfile?.operational?.existingCreditObligations ?? false,
                    existingLenders: businessProfile?.operational?.existingLenders || [],
                },
                paymentOptions: {
                    paymentFrequency: businessProfile?.contractWalletConsent?.preferredPaymentFrequency || '',
                    selectedWeekday: '',
                },
                contractWalletConsent: {
                    preferredPaymentFrequency: businessProfile?.contractWalletConsent?.preferredPaymentFrequency || "",
                    autoDebitConsent: businessProfile?.contractWalletConsent?.autoDebitConsent ?? false,
                    walletTermsAccepted: businessProfile?.contractWalletConsent?.walletTermsAccepted ?? false,
                    platformTermsAccepted: businessProfile?.contractWalletConsent?.platformTermsAccepted ?? false,
                    dataUsageConsent: businessProfile?.contractWalletConsent?.dataUsageConsent ?? false,
                    collectionsConsent: businessProfile?.contractWalletConsent?.collectionsConsent ?? false,
                    marketingConsent: businessProfile?.contractWalletConsent?.marketingConsent ?? false,
                }
            });
        }
    }, [businessProfile, profile, isProfileLoading, kycData]);

    const getPresignedUrl = useGetPresignedUrlMutation();
    const verifyUrl = useVerifyUrlMutation();
    const [uploadingField, setUploadingField] = useState<string | null>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Special handling for ID Front/Back combination - wait for both
        const isIdFront = field.includes('governmentIdFront');
        const isIdBack = field.includes('governmentIdBack');
        const baseFieldMatch = field.match(/^ownerPrimaryController\[\d+\]/);
        const baseField = baseFieldMatch ? baseFieldMatch[0] : null;
        const frontField = baseField ? `${baseField}.governmentIdFront` : field;
        const backField = baseField ? `${baseField}.governmentIdBack` : field;

        if (isIdFront) {
            setTempFiles(prev => ({ ...prev, [field]: file }));
            // Set File object locally to show selected state in DocPreview
            handleKYCInputChange(field, file);
            toast.info('Front ID image saved locally. Please upload the Back ID to complete.');
            return;
        }

        try {
            setUploadingField(field);
            let s3Keys: string[] = [];
            let fieldToUpdate = field;

            if (isIdBack) {
                const frontFile = tempFiles[frontField];
                if (!frontFile) {
                    toast.error('Please upload Government ID Front first');
                    setUploadingField(null);
                    return;
                }

                toast.info('Uploading ID images...');
                const frontKey = await uploadFile(frontFile);
                const backKey = await uploadFile(file);

                s3Keys = [frontKey, backKey];

                // Update local state with S3 keys
                handleKYCInputChange(frontField, frontKey);
                handleKYCInputChange(backField, backKey);
                fieldToUpdate = frontField; // Use front as base for extraction mapping

                // Clear temp file
                setTempFiles(prev => {
                    const newState = { ...prev };
                    delete newState[frontField];
                    return newState;
                });
            } else {
                const s3Key = await uploadFile(file);
                s3Keys = [s3Key];
                handleKYCInputChange(field, s3Key);
            }

            // Particular fields trigger AI verification
            const verifyMapping: Record<string, string> = {
                'businessInformation.registrationCertificateFile': 'businessInformation',
                'taxStatutoryDocuments.panCertificateFile': 'taxStatutoryDocuments',
                'taxStatutoryDocuments.vatCertificateFile': 'taxStatutoryDocuments',
            };

            let verificationType = verifyMapping[field];
            if (!verificationType && baseField && (isIdFront || isIdBack)) {
                verificationType = 'ownerPrimaryController';
            }
            if (!verificationType && field.includes('otherLicenses_licenseFile')) {
                verificationType = 'taxStatutoryDocuments';
            }

            if (verificationType) {
                // Only trigger verification for ID if both front and back are provided (total of 2 s3Keys)
                if (verificationType === 'ownerPrimaryController' && s3Keys.length < 2) {
                    toast.success('File uploaded');
                    return;
                }

                toast.info('Verifying document...');
                const verificationResult = await verifyUrl.mutateAsync({ urls: s3Keys, type: verificationType });
                if (verificationResult?.error) {
                    // toast.error(verificationResult.error);
                    handleKYCInputChange(field, null);
                    setErrors(prev => ({ ...prev, [field]: verificationResult.error }));
                    return;
                }
                if (verificationResult) {
                    // Update from verification using all keys (e.g. front/back)
                    await updateKycFromVerification(verificationResult, s3Keys, verificationType, fieldToUpdate);
                    toast.success('Document verified and info extracted!');
                }
            } else {
                toast.success('File uploaded');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to upload or verify document');
        } finally {
            setUploadingField(null);
        }
    };

    const uploadFile = async (file: File) => {
        const { url, key } = await getPresignedUrl.mutateAsync({
            fileName: file.name,
            category: TABS[kycStep - 1],
            contentType: file.type
        });
        await uploadFileToS3(url, file);
        return key;
    };

    const handleBack = () => {
        if (kycStep > 1) {
            setKycStep(kycStep - 1);
        } else {
            router.replace('/dashboard');
        }
    };

    const validateStep = (tabName: string) => {
        const stepErrors: Record<string, string> = {};
        switch (tabName) {
            case 'Business Info':
                if (!kycData.businessInformation.businessName) stepErrors['businessInformation.businessName'] = 'Business Name is required';
                if (showOutletField && !kycData.businessInformation.outletName) stepErrors['businessInformation.outletName'] = 'Outlet Name is required';
                if (!kycData.businessInformation.businessRegistrationType) stepErrors['businessInformation.businessRegistrationType'] = 'Registration Type is required';
                if (!kycData.businessInformation.registrationNumber) stepErrors['businessInformation.registrationNumber'] = 'Registration Number is required';
                if (!kycData.businessInformation.dateOfRegistration) stepErrors['businessInformation.dateOfRegistration'] = 'Date of Registration is required';
                if (!kycData.businessInformation.yearsInOperation) stepErrors['businessInformation.yearsInOperation'] = 'Years in Operation is required';
                if (!kycData.businessInformation.businessStatus) stepErrors['businessInformation.businessStatus'] = 'Business Status is required';
                if (!kycData.businessInformation.registrationCertificateFile) stepErrors['businessInformation.registrationCertificateFile'] = 'Registration Certificate is required';
                break;
            case 'Tax Documents':
                // Tax documents are optional based on DTO
                break;
            case 'Location':
                if (!kycData.locationPremises.physicalAddress) stepErrors['locationPremises.physicalAddress'] = 'Physical Address is required';
                if (!kycData.locationPremises.wardNumber) stepErrors['locationPremises.wardNumber'] = 'Ward Number is required';
                if (!kycData.locationPremises.city) stepErrors['locationPremises.city'] = 'City is required';
                if (!kycData.locationPremises.ownershipOfPremises) stepErrors['locationPremises.ownershipOfPremises'] = 'Ownership of Premises is required';
                break;
            case 'Visuals':
                if (!kycData.visualVerification.premisesExteriorPhoto) stepErrors['visualVerification.premisesExteriorPhoto'] = 'Exterior Photo is required';
                if (!kycData.visualVerification.interiorPhoto) stepErrors['visualVerification.interiorPhoto'] = 'Interior Photo is required';
                if (!kycData.visualVerification.signboardPhoto) stepErrors['visualVerification.signboardPhoto'] = 'Signboard Photo is required';
                break;
            case 'Owner / Primary Controller':
                kycData.ownerPrimaryController.forEach((owner: any, index: number) => {
                    if (!owner.ownerFullName) stepErrors[`ownerPrimaryController[${index}].ownerFullName`] = 'Owner Full Name is required';
                    if (!owner.fathersName) stepErrors[`ownerPrimaryController[${index}].fathersName`] = "Father's name is required";
                    if (!owner.grandFathersName) stepErrors[`ownerPrimaryController[${index}].grandFathersName`] = "Grandfather's name is required";
                    if (!owner.ownerCitizenship) stepErrors[`ownerPrimaryController[${index}].ownerCitizenship`] = 'Citizenship is required';
                    if (!owner.ownerPhoneNumber) stepErrors[`ownerPrimaryController[${index}].ownerPhoneNumber`] = 'Phone Number is required';
                    if (!owner.governmentIdType) stepErrors[`ownerPrimaryController[${index}].governmentIdType`] = 'ID Type is required';
                    if (!owner.governmentIdNumber) stepErrors[`ownerPrimaryController[${index}].governmentIdNumber`] = 'ID Number is required';
                    if (!owner.governmentIdFront) stepErrors[`ownerPrimaryController[${index}].governmentIdFront`] = 'ID Front Photo is required';
                    if (!owner.governmentIdBack) stepErrors[`ownerPrimaryController[${index}].governmentIdBack`] = 'ID Back Photo is required';
                    if (!owner.ownerPhotoSelfie) stepErrors[`ownerPrimaryController[${index}].ownerPhotoSelfie`] = 'Selfie Photo is required';
                    if (!owner.ownershipPercentage || owner.ownershipPercentage <= 0 || owner.ownershipPercentage > 100) stepErrors[`ownerPrimaryController[${index}].ownershipPercentage`] = 'Percentage must be between 1 and 100';
                });
                const totalPercentage = kycData.ownerPrimaryController.reduce((sum: number, owner: any) => sum + (parseFloat(owner.ownershipPercentage) || 0), 0);
                if (Math.abs(totalPercentage - 100) > 0.01) {
                    stepErrors['ownerPrimaryController.totalPercentage'] = `Total ownership must be exactly 100% (currently ${totalPercentage}%)`;
                }
                break;
            case 'Financial':
                // Bank Name and Account Number are optional in DTO
                if (kycData.financialProfile.averageMonthlySales < 0) stepErrors['financialProfile.averageMonthlySales'] = 'Average Monthly Sales must be 0 or more';
                if (!kycData.financialProfile.bankStatementFile) stepErrors['financialProfile.bankStatementFile'] = 'Bank Statement is required';
                break;
            case 'Operational':
                if (!kycData.operational.dailyOperatingHours || kycData.operational.dailyOperatingHours.length === 0) stepErrors['operational.dailyOperatingHours'] = 'Operating Hours are required';
                if (kycData.operational.numberOfStaff < 1) stepErrors['operational.numberOfStaff'] = 'Number of staff must be at least 1';
                if (!kycData.operational.supplierDependencyLevel) stepErrors['operational.supplierDependencyLevel'] = 'Number of Suppliers info is required';
                break;
            case 'Payment Options':
                if (!kycData.paymentOptions.paymentFrequency) {
                    stepErrors['paymentOptions.paymentFrequency'] = 'Payment Frequency is required';
                } else if (kycData.paymentOptions.paymentFrequency === 'Weekly' && !kycData.paymentOptions.selectedWeekday) {
                    stepErrors['paymentOptions.selectedWeekday'] = 'Please select a day for weekly payment';
                }
                break;
            case 'Consent':
                if (!kycData.contractWalletConsent.walletTermsAccepted) stepErrors['contractWalletConsent.walletTermsAccepted'] = 'Please accept Wallet Terms';
                if (!kycData.contractWalletConsent.platformTermsAccepted) stepErrors['contractWalletConsent.platformTermsAccepted'] = 'Please accept Platform Terms';
                if (!kycData.contractWalletConsent.dataUsageConsent) stepErrors['contractWalletConsent.dataUsageConsent'] = 'Please accept Data Usage Consent';
                if (!kycData.contractWalletConsent.autoDebitConsent) stepErrors['contractWalletConsent.autoDebitConsent'] = 'Please accept Auto-Debit Consent';
                if (!kycData.contractWalletConsent.collectionsConsent) stepErrors['contractWalletConsent.collectionsConsent'] = 'Please accept Collections Consent';
                break;
        }
        return stepErrors;
    };


    const handleKYCContinue = async () => {
        const activeTab = TABS[kycStep - 1];
        const stepErrors = validateStep(activeTab);
        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            toast.error('Please fix the errors before continuing');
            return;
        }
        setErrors({});

        try {
            // 1. Gather all File objects currently in state
            const pendingFiles: { field: string, file: File }[] = [];
            const findFiles = (obj: any, prefix = '') => {
                if (!obj) return;

                if (Array.isArray(obj)) {
                    obj.forEach((item, index) => {
                        const fullKey = `${prefix}[${index}]`;
                        if (item instanceof File) {
                            pendingFiles.push({ field: fullKey, file: item });
                        } else if (item && typeof item === 'object' && !(item instanceof Date)) {
                            findFiles(item, fullKey);
                        }
                    });
                } else {
                    for (const key in obj) {
                        const value = obj[key];
                        const fullKey = prefix ? `${prefix}.${key}` : key;
                        if (value instanceof File) {
                            pendingFiles.push({ field: fullKey, file: value });
                        } else if (value && typeof value === 'object' && !(value instanceof Date)) {
                            findFiles(value, fullKey);
                        }
                    }
                }
            };
            findFiles(kycData);

            // 2. Upload them and store keys
            const uploadedKeys: Record<string, string> = {};
            if (pendingFiles.length > 0) {
                setUploadingField('processing');
                for (const item of pendingFiles) {
                    try {
                        const s3Key = await uploadFile(item.file);
                        uploadedKeys[item.field] = s3Key;
                        handleKYCInputChange(item.field, s3Key);
                    } catch (err: any) {
                        toast.error(`Failed to upload ${item.field}`);
                        setUploadingField(null);
                        return;
                    }
                }
                setUploadingField(null);
            }

            const getFinalVal = (fieldPath: string, defaultVal: any = null) => {
                if (uploadedKeys[fieldPath]) return uploadedKeys[fieldPath];

                const parts = fieldPath.split('.');
                let current = kycData as any;
                for (const part of parts) {
                    const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
                    if (arrayMatch) {
                        const key = arrayMatch[1];
                        const index = parseInt(arrayMatch[2]);
                        current = current?.[key]?.[index];
                    } else {
                        current = current?.[part];
                    }
                    if (current === undefined) break;
                }

                if (current instanceof File) return defaultVal;
                return current ?? defaultVal;
            };

            const getFinalArray = (fieldPath: string) => {
                const parts = fieldPath.split('.');
                let arr = kycData as any;
                for (const part of parts) {
                    const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
                    if (arrayMatch) {
                        const key = arrayMatch[1];
                        const index = parseInt(arrayMatch[2]);
                        arr = arr?.[key]?.[index];
                    } else {
                        arr = arr?.[part];
                    }
                    if (arr === undefined) break;
                }
                if (!arr) return [];

                if (!Array.isArray(arr)) return [];
                return arr.map((item, index) => {
                    const key = `${fieldPath}[${index}]`;
                    if (uploadedKeys[key]) return uploadedKeys[key];
                    if (item instanceof File) return null;
                    return item;
                });
            };

            let payload: any = {};

            switch (activeTab) {
                case 'Business Info':
                    payload = {
                        businessInformation: {
                            businessName: kycData.businessInformation.businessName,
                            businessName_nepali: kycData.businessInformation.businessName_nepali,
                            tradeName: kycData.businessInformation.tradeName || kycData.businessInformation.businessName,
                            outletName: showOutletField ? kycData.businessInformation.outletName : undefined,
                            businessRegistrationType: kycData.businessInformation.businessRegistrationType,
                            registrationNumber: kycData.businessInformation.registrationNumber,
                            registrationCertificateFile: getFinalVal('businessInformation.registrationCertificateFile'),
                            dateOfRegistration: kycData.businessInformation.dateOfRegistration,
                            dateOfRegistration_bs: kycData.businessInformation.dateOfRegistration_bs,
                            yearsInOperation: kycData.businessInformation.yearsInOperation || "",
                            businessStatus: kycData.businessInformation.businessStatus
                        },
                    };
                    break;
                case 'Tax Documents':
                    payload = {
                        taxStatutoryDocuments: {
                            panCertificateFile: getFinalVal('taxStatutoryDocuments.panCertificateFile'),
                            panNumber: kycData.taxStatutoryDocuments.panNumber,
                            vatCertificateFile: getFinalVal('taxStatutoryDocuments.vatCertificateFile'),
                            vatNumber: kycData.taxStatutoryDocuments.vatNumber,
                            lastAuditReportFile: getFinalVal('taxStatutoryDocuments.lastAuditReportFile'),
                            otherLicenses_licenseType: kycData.taxStatutoryDocuments.otherLicenses_licenseType,
                            otherLicenses_licenseNumber: kycData.taxStatutoryDocuments.otherLicenses_licenseNumber,
                            otherLicenses_licenseExpiryDate: kycData.taxStatutoryDocuments.otherLicenses_licenseExpiryDate,
                            otherLicenses_licenseFile: getFinalArray('taxStatutoryDocuments.otherLicenses_licenseFile')
                        }
                    };
                    break;
                case 'Location':
                    payload = {
                        locationPremises: {
                            physicalAddress: kycData.locationPremises.physicalAddress,
                            wardNumber: parseInt(kycData.locationPremises.wardNumber) || 1,
                            city: kycData.locationPremises.city || "Kathmandu",
                            gpsCoordinates_lat: kycData.locationPremises.gpsCoordinates_lat,
                            gpsCoordinates_lng: kycData.locationPremises.gpsCoordinates_lng,
                            ownershipOfPremises: kycData.locationPremises.ownershipOfPremises,
                            rentAgreementFile: getFinalVal('locationPremises.rentAgreementFile')
                        }
                    };
                    break;
                case 'Visuals':
                    payload = {
                        visualVerification: {
                            premisesExteriorPhoto: getFinalVal('visualVerification.premisesExteriorPhoto'),
                            signboardPhoto: getFinalVal('visualVerification.signboardPhoto'),
                            interiorPhoto: getFinalVal('visualVerification.interiorPhoto'),
                            storageOrKitchenPhoto: getFinalVal('visualVerification.storageOrKitchenPhoto')
                        }
                    };
                    break;
                case 'Owner / Primary Controller':
                    payload = {
                        isSoleProprietor: kycData.isSoleProprietor,
                        ownerPrimaryController: kycData.ownerPrimaryController.map((owner: any, index: number) => ({
                            ownerFullName: owner.ownerFullName,
                            ownerCitizenship: owner.ownerCitizenship || "Nepalese",
                            ownerPhoneNumber: owner.ownerPhoneNumber,
                            ownerAlternatePhone: owner.ownerAlternatePhone || "",
                            ownerEmail: owner.ownerEmail,
                            governmentIdType: owner.governmentIdType,
                            governmentIdNumber: owner.governmentIdNumber,
                            governmentIdFront: getFinalVal(`ownerPrimaryController[${index}].governmentIdFront`),
                            governmentIdBack: getFinalVal(`ownerPrimaryController[${index}].governmentIdBack`),
                            ownerPhotoSelfie: getFinalVal(`ownerPrimaryController[${index}].ownerPhotoSelfie`),
                            permanentAddress: owner.permanentAddress,
                            houseNumber: owner.houseNumber,
                            streetName: owner.streetName,
                            wardNumber: parseInt(owner.wardNumber) || undefined,
                            municipality: owner.municipality,
                            district: owner.district,
                            province: owner.province,
                            country: owner.country,
                            fathersName: owner.fathersName,
                            grandFathersName: owner.grandFathersName,
                            ownershipPercentage: owner.ownershipPercentage
                        }))
                    };
                    break;
                case 'Financial':
                    payload = {
                        financialProfile: {
                            averageMonthlySales: kycData.financialProfile.averageMonthlySales,
                            paymentAcceptanceTypes: kycData.financialProfile.paymentAcceptanceTypes,
                            bankAccountExists: kycData.financialProfile.bankAccountExists,
                            bankName: kycData.financialProfile.bankName || null,
                            bankAccountNumber: kycData.financialProfile.bankAccountNumber || null,
                            bankStatementFile: getFinalVal('financialProfile.bankStatementFile'),
                            salesRecordsFile: getFinalVal('financialProfile.salesRecordsFile')
                        }
                    };
                    break;
                case 'Operational':
                    payload = {
                        operational: {
                            dailyOperatingHours: kycData.operational.dailyOperatingHours,
                            peakBusinessDays: kycData.operational.peakBusinessDays,
                            numberOfStaff: kycData.operational.numberOfStaff,
                            supplierDependencyLevel: kycData.operational.supplierDependencyLevel,
                            existingCreditObligations: kycData.operational.existingCreditObligations,
                            existingLenders: kycData.operational.existingLenders
                        }
                    };
                    break;
                case 'Payment Options':
                    payload = {
                        paymentOptions: {
                            paymentFrequency: kycData.paymentOptions.paymentFrequency,
                            selectedWeekday: kycData.paymentOptions.selectedWeekday,
                        }
                    };
                    break;
                case 'Consent':
                    payload = {
                        contractWalletConsent: {
                            preferredPaymentFrequency: kycData.paymentOptions.paymentFrequency,
                            autoDebitConsent: kycData.contractWalletConsent.autoDebitConsent,
                            walletTermsAccepted: kycData.contractWalletConsent.walletTermsAccepted,
                            platformTermsAccepted: kycData.contractWalletConsent.platformTermsAccepted,
                            dataUsageConsent: kycData.contractWalletConsent.dataUsageConsent,
                            collectionsConsent: kycData.contractWalletConsent.collectionsConsent,
                            marketingConsent: kycData.contractWalletConsent.marketingConsent
                        }
                    };
                    break;
            }

            await updateProfile.mutateAsync(payload);
            if (kycStep === TABS.length) {
                await refreshProfile();
                setKycStep(TABS.length + 1);
            } else {
                setKycStep(kycStep + 1);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to update KYC application');
        }
    };

    const updateKycFromVerification = async (data: any, s3Keys: string[], type: string = 'businessInformation', field?: string) => {
        // Prepare new data objects by merging the AI verification result with current state
        let updatedBusinessInfo = { ...kycData.businessInformation };
        let updatedTaxDocs = { ...kycData.taxStatutoryDocuments };

        let targetIndex = 0;
        if (field) {
            const match = field.match(/\[(\d+)\]/);
            if (match) targetIndex = parseInt(match[1]);
        }
        const updatedOwnerInfoArray = [...kycData.ownerPrimaryController];
        let updatedOwnerInfo = { ...updatedOwnerInfoArray[targetIndex] };

        const primaryS3Key = s3Keys[0];

        // Update the specific file field with the primary s3Key
        if (field) {
            const parts = field.split('.');
            let current: any;
            if (type === 'businessInformation') current = updatedBusinessInfo;
            else if (type === 'taxStatutoryDocuments') current = updatedTaxDocs;
            else if (type === 'ownerPrimaryController') current = updatedOwnerInfo;

            // Start from 0 since we've already selected the top-level or target owner
            // Wait, if it's businessInformation, parts[0] is 'businessInformation'
            // if it's ownerPrimaryController[0].field, parts[0] is 'ownerPrimaryController[0]'

            for (let i = 1; i < parts.length; i++) {
                const part = parts[i];
                const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);

                if (arrayMatch) {
                    const key = arrayMatch[1];
                    const index = parseInt(arrayMatch[2]);

                    if (i === parts.length - 1) {
                        current[key] = [...(current[key] || [])];
                        current[key][index] = primaryS3Key;
                    } else {
                        current[key] = [...(current[key] || [])];
                        current[key][index] = { ...current[key][index] };
                        current = current[key][index];
                    }
                } else {
                    if (i === parts.length - 1) {
                        current[part] = primaryS3Key;
                    } else {
                        current[part] = { ...current[part] };
                        current = current[part];
                    }
                }
            }
        }

        // Special handling for multiside IDs to ensure both keys are in the sync and state payload
        if (type === 'ownerPrimaryController' && s3Keys.length === 2) {
            updatedOwnerInfo.governmentIdFront = s3Keys[0];
            updatedOwnerInfo.governmentIdBack = s3Keys[1];
        }

        if (type === 'businessInformation') {
            if (data.businessInformation) {
                let yearsInOperation = data.businessInformation.yearsInOperation ? String(data.businessInformation.yearsInOperation) : updatedBusinessInfo.yearsInOperation;

                if (data.businessInformation.dateOfRegistration) {
                    const regDate = new Date(data.businessInformation.dateOfRegistration);
                    if (!isNaN(regDate.getTime())) {
                        const today = new Date();
                        let totalMonths = (today.getFullYear() - regDate.getFullYear()) * 12 + (today.getMonth() - regDate.getMonth());
                        if (today.getDate() < regDate.getDate()) {
                            totalMonths--;
                        }

                        const years = Math.floor(totalMonths / 12);
                        const months = totalMonths % 12;

                        const parts = [];
                        if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
                        if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
                        yearsInOperation = parts.join(' ') || '0 months';
                    }
                }

                updatedBusinessInfo = {
                    ...updatedBusinessInfo,
                    businessName: data.businessInformation.businessName || updatedBusinessInfo.businessName,
                    businessName_nepali: data.businessInformation.businessName_nepali || updatedBusinessInfo.businessName_nepali,
                    tradeName: data.businessInformation.tradeName || data.businessInformation.businessName || updatedBusinessInfo.tradeName,
                    businessRegistrationType: data.businessInformation.businessRegistrationType || updatedBusinessInfo.businessRegistrationType,
                    registrationNumber: data.businessInformation.registrationNumber || updatedBusinessInfo.registrationNumber,
                    dateOfRegistration: data.businessInformation.dateOfRegistration || updatedBusinessInfo.dateOfRegistration,
                    dateOfRegistration_bs: data.businessInformation.dateOfRegistration_bs || updatedBusinessInfo.dateOfRegistration_bs,
                    yearsInOperation,
                };
            }
        } else if (type === 'taxStatutoryDocuments') {
            if (data.taxStatutoryDocuments) {
                updatedTaxDocs = {
                    ...updatedTaxDocs,
                    panNumber: data.taxStatutoryDocuments.panNumber || updatedTaxDocs.panNumber,
                    vatNumber: data.taxStatutoryDocuments.vatNumber || updatedTaxDocs.vatNumber,
                };
            }
        } else if (type === 'ownerPrimaryController') {
            if (data.ownerPrimaryController) {
                updatedOwnerInfo = {
                    ...updatedOwnerInfo,
                    ownerFullName: data.ownerPrimaryController.ownerFullName || updatedOwnerInfo.ownerFullName,
                    ownerCitizenship: data.ownerPrimaryController.ownerCitizenship || updatedOwnerInfo.ownerCitizenship,
                    governmentIdNumber: data.ownerPrimaryController.governmentIdNumber || updatedOwnerInfo.governmentIdNumber,
                    governmentIdType: data.ownerPrimaryController.governmentIdType || updatedOwnerInfo.governmentIdType,
                    permanentAddress: data.ownerPrimaryController.permanentAddress || updatedOwnerInfo.permanentAddress,
                    houseNumber: data.ownerPrimaryController.houseNumber || updatedOwnerInfo.houseNumber,
                    streetName: data.ownerPrimaryController.streetName || updatedOwnerInfo.streetName,
                    wardNumber: data.ownerPrimaryController.wardNumber || updatedOwnerInfo.wardNumber,
                    municipality: data.ownerPrimaryController.municipality || updatedOwnerInfo.municipality,
                    district: data.ownerPrimaryController.district || updatedOwnerInfo.district,
                    province: data.ownerPrimaryController.province || updatedOwnerInfo.province,
                    country: data.ownerPrimaryController.country || updatedOwnerInfo.country,
                    fathersName: data.ownerPrimaryController.fathersName || updatedOwnerInfo.fathersName,
                    grandFathersName: data.ownerPrimaryController.grandFathersName || updatedOwnerInfo.grandFathersName,
                };
            }
            updatedOwnerInfoArray[targetIndex] = updatedOwnerInfo;
        }

        // Update local state
        setKycData((prev: any) => ({
            ...prev,
            businessInformation: type === 'businessInformation' ? updatedBusinessInfo : prev.businessInformation,
            taxStatutoryDocuments: type === 'taxStatutoryDocuments' ? updatedTaxDocs : prev.taxStatutoryDocuments,
            ownerPrimaryController: type === 'ownerPrimaryController' ? updatedOwnerInfoArray : prev.ownerPrimaryController,
        }));

        // Auto-save the extracted information to the profile
        try {
            if (type === 'businessInformation' && data.businessInformation?.businessName) {
                setForceSearchName(data.businessInformation.businessName);
            }
        } catch (error) {
            console.error('Failed to auto-save KYC data:', error);
        }
    };

    const handleKYCInputChange = (field: string, value: any) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
        setKycData((prev: any) => {
            const newState = { ...prev };
            const parts = field.split('.');
            let current: any = newState;

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);

                if (arrayMatch) {
                    const key = arrayMatch[1];
                    const index = parseInt(arrayMatch[2]);

                    if (i === parts.length - 1) {
                        const newArray = [...(current[key] || [])];
                        newArray[index] = value;
                        current[key] = newArray;
                    } else {
                        current[key] = [...(current[key] || [])];
                        current[key][index] = { ...current[key][index] };
                        current = current[key][index];
                    }
                } else {
                    if (i === parts.length - 1) {
                        current[part] = value;
                    } else {
                        current[part] = { ...current[part] };
                        current = current[part];
                    }
                }
            }
            return newState;
        });
    };

    if (kycStep === TABS.length + 1) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <header className="bg-white border-b px-8 py-6 flex justify-between items-center">
                    <Logo className="w-24 h-auto" />
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-gray-500 font-semibold hover:underline"
                        >
                            Skip
                        </button>
                        <button
                            onClick={logout}
                            className="text-red-500 font-semibold hover:underline border border-red-200 px-4 py-1.5 rounded-full hover:bg-red-50 transition"
                        >
                            Logout
                        </button>
                    </div>
                </header>
                <main className="flex-1 flex items-center justify-center px-8">
                    <div className="max-w-md w-full text-center">
                        <div className="flex justify-center mb-8">
                            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-4xl font-semibold mb-4 text-gray-900">Application Received</h1>
                        <p className="text-gray-600 mb-10 text-lg">
                            We are currently verifying your business details for <span className="font-semibold text-gray-900">{businessProfile?.businessInformation?.businessName || profile?.merchant?.name}</span>. This process usually takes 1-2 business days.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full bg-red-600 text-white font-semibold py-4 rounded-full hover:bg-red-700 transition shadow-lg active:scale-95"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    if (!kycData) {
        return null
    }

    return (
        <div className="min-h-screen bg-white flex flex-col overflow-auto relative">
            <div className='sticky top-0 z-20'>
                <header className="bg-white px-8 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Logo className="w-24 h-auto" />
                    </div>

                    <div className="w-full flex justify-center overflow-x-auto no-scrollbar bg-white sticky top-0 z-10 mx-4 pb-[0px]">
                        <div className="flex px-8 whitespace-nowrap min-w-max ">
                            {TABS.map((tab, index) => (
                                <button
                                    key={index}
                                    onClick={() => setKycStep(index + 1)}
                                    className={`px-6 py-4 text-sm font-semibold duration-200 transition-all ${kycStep === index + 1
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {kycStep === index + 1 ? (index + 1) + '. ' + tab : (index + 1)}

                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-gray-500 font-semibold hover:underline"
                        >
                            Skip
                        </button>
                        <button
                            onClick={logout}
                            className="text-red-500 font-semibold hover:underline border border-red-200 px-4 py-1.5 rounded-full hover:bg-red-50 transition"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="w-full bg-gray-200 h-1">
                    <div className="bg-primary h-1 transition-all duration-300" style={{ width: `${(kycStep / TABS.length) * 100}%` }}></div>
                </div>


            </div>


            <main className={`flex-1 ${TABS[kycStep - 1] === 'Payment Options' || (TABS[kycStep - 1] === 'Owner / Primary Controller' && !kycData.isSoleProprietor) ? 'max-w-6xl' : 'max-w-2xl'} min-h-[80vh] flex flex-col mx-auto px-8 pt-6 w-full`}>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 w-full">

                        {TABS[kycStep - 1] === 'Business Info' && (
                            <BusinessInfoTab
                                kycData={kycData}
                                handleKYCInputChange={handleKYCInputChange}
                                handleFileUpload={handleFileUpload}
                                uploadingField={uploadingField}
                                errors={errors}
                                forceSearchName={forceSearchName}
                                isLoaded={isLoaded}
                            />
                        )}

                        {TABS[kycStep - 1] === 'Tax Documents' && (
                            <TaxDocumentsTab
                                kycData={kycData}
                                handleKYCInputChange={handleKYCInputChange}
                                handleFileUpload={handleFileUpload}
                                uploadingField={uploadingField}
                                errors={errors}
                            />
                        )}

                        {TABS[kycStep - 1] === 'Location' && (
                            <LocationPremisesTab
                                kycData={kycData}
                                handleKYCInputChange={handleKYCInputChange}
                                handleFileUpload={handleFileUpload}
                                uploadingField={uploadingField}
                                errors={errors}
                            />
                        )}

                        {TABS[kycStep - 1] === 'Visuals' && (
                            <VisualVerificationTab
                                kycData={kycData}
                                handleKYCInputChange={handleKYCInputChange}
                                handleFileUpload={handleFileUpload}
                                uploadingField={uploadingField}
                                errors={errors}
                            />
                        )}

                        {TABS[kycStep - 1] === 'Owner / Primary Controller' && (
                            <OwnerPrimaryControllerTab
                                kycData={kycData}
                                handleKYCInputChange={handleKYCInputChange}
                                handleFileUpload={handleFileUpload}
                                uploadingField={uploadingField}
                                errors={errors}
                            />
                        )}

                        {TABS[kycStep - 1] === 'Financial' && (
                            <FinancialProfileTab
                                kycData={kycData}
                                handleKYCInputChange={handleKYCInputChange}
                                handleFileUpload={handleFileUpload}
                                uploadingField={uploadingField}
                                errors={errors}
                            />
                        )}

                        {TABS[kycStep - 1] === 'Operational' && (
                            <OperationalTab
                                kycData={kycData}
                                handleKYCInputChange={handleKYCInputChange}
                                errors={errors}
                            />
                        )}

                        {TABS[kycStep - 1] === 'Payment Options' && (
                            <PaymentOptionsTab
                                kycData={kycData}
                                handleKYCInputChange={handleKYCInputChange}
                                errors={errors}
                            />
                        )}

                        {TABS[kycStep - 1] === 'Consent' && (
                            <ConsentTab
                                kycData={kycData}
                                handleKYCInputChange={handleKYCInputChange}
                                errors={errors}
                            />
                        )}
                    </div>

                    {TABS[kycStep - 1] === 'Owner / Primary Controller' && !kycData.isSoleProprietor && (
                        <div className="hidden lg:block w-80 sticky top-32">
                            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">Ownership Summary</h3>
                                <div className="space-y-4 mb-8">
                                    {(kycData?.ownerPrimaryController || []).map((owner: any, index: number) => (
                                        <div key={index} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 truncate mr-4">
                                                {owner.ownerFullName || `Owner #${index + 1}`}
                                            </span>
                                            <span className="font-semibold text-gray-900 whitespace-nowrap">
                                                {owner.ownershipPercentage || 0}%
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-base font-semibold text-gray-900">Total Ownership</span>
                                        <span className={`text-lg font-bold ${Math.abs((kycData?.ownerPrimaryController || []).reduce((sum: number, o: any) => sum + (parseFloat(o.ownershipPercentage) || 0), 0) - 100) < 0.01 ? 'text-green-500' : 'text-red-500'}`}>
                                            {(kycData?.ownerPrimaryController || []).reduce((sum: number, o: any) => sum + (parseFloat(o.ownershipPercentage) || 0), 0)}%
                                        </span>
                                    </div>

                                    {Math.abs((kycData?.ownerPrimaryController || []).reduce((sum: number, o: any) => sum + (parseFloat(o.ownershipPercentage) || 0), 0) - 100) > 0.01 && (
                                        <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl text-xs text-red-600 font-mediumm leading-relaxed">
                                            <div className='mt-0.5'>
                                                <Icon name="alert-circle" size={14} />
                                            </div>
                                            <span>Total ownership must be exactly 100%. Please adjust percentages.</span>
                                        </div>
                                    )}
                                    {Math.abs((kycData?.ownerPrimaryController || []).reduce((sum: number, o: any) => sum + (parseFloat(o.ownershipPercentage) || 0), 0) - 100) < 0.01 && (kycData?.ownerPrimaryController || []).some((o: any) => !o.ownershipPercentage || parseFloat(o.ownershipPercentage) <= 0) && (
                                        <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl text-xs text-red-600 font-mediumm leading-relaxed">
                                            <div className='mt-0.5'>
                                                <Icon name="alert-circle" size={14} />
                                            </div>
                                            <span>Each owner must have a percentage greater than 0%.</span>
                                        </div>
                                    )}
                                    {Math.abs((kycData?.ownerPrimaryController || []).reduce((sum: number, o: any) => sum + (parseFloat(o.ownershipPercentage) || 0), 0) - 100) < 0.01 && !(kycData?.ownerPrimaryController || []).some((o: any) => !o.ownershipPercentage || parseFloat(o.ownershipPercentage) <= 0) && (
                                        <div className="flex items-start gap-2 p-3 bg-green-50 rounded-xl text-xs text-green-600 font-mediumm">
                                            <div className='mt-0.5'>
                                                <Icon name="check-circle" size={14} />
                                            </div>
                                            <span>Ownership distribution is valid!</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className='min-h-8'>

                </div>

                <div className="flex mt-auto justify-between items-center pt-4 border-t pb-4 sticky bottom-0 left-0 right-0 bg-white">
                    <button onClick={handleBack} className="px-6 py-3 text-gray-600 font-semibold">Back</button>
                    <button
                        onClick={handleKYCContinue}
                        disabled={updateProfile.isPending}
                        className={`px-8 py-3 bg-primary text-white font-semibold rounded-full ${updateProfile.isPending ? 'opacity-70' : ''}`}
                    >
                        {updateProfile.isPending ? 'Submitting...' : kycStep === TABS.length ? 'Finish' : 'Continue'}
                    </button>
                </div>
            </main>
        </div>
    );
}