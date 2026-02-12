'use client';

const Page = () => {
    return (
        <div>
            Enter
        </div>
    );
}

export default Page;

// import React, { useState, useEffect, useRef } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { useUserStore } from '@/store/useUserStore';
// import {
//     useUpdateBusinessProfileMutation,
//     useGetPresignedUrlMutation,
//     useVerifyUrlMutation,
//     uploadFileToS3,
//     useGetBusinessProfileQuery,
//     useGetOutletsQuery
// } from '@/services/api';
// import DashboardLayout from '@/components/DashboardLayout';
// import { Icon } from '@/components/Icon';
// import { toast } from 'sonner';
// import { TABS } from '@/utils/constants';
// import {
//     BusinessInfoTab,
//     TaxDocumentsTab,
//     LocationPremisesTab,
//     VisualVerificationTab,
//     OwnerPrimaryControllerTab,
//     FinancialProfileTab,
//     OperationalTab,
//     PaymentOptionsTab,
//     ConsentTab,
//     DocPreview
// } from '@/components/kyc/index';
// import { useJsApiLoader } from '@react-google-maps/api';
// import { LIBRARIES } from '../kyc/page';


// export default function BusinessProfileScreen() {
//     const { refreshProfile } = useAuth();
//     const { profile } = useUserStore();
//     const merchant = profile?.merchant;
//     const [activeTab, setActiveTab] = useState('Business Info');
//     const [isEditing, setIsEditing] = useState(false);
//     const [tempFiles, setTempFiles] = useState<Record<string, File>>({});
//     const [errors, setErrors] = useState<Record<string, string>>({});
//     const [forceSearchName, setForceSearchName] = useState<string | undefined>(undefined);

//     // Get merchant details from business profile API
//     const { data: userMerchant, isLoading: isProfileLoading } = useGetBusinessProfileQuery();
//     const { data: outlets } = useGetOutletsQuery();
//     const showOutletField = !outlets || outlets.length === 0;

//     const updateProfile = useUpdateBusinessProfileMutation();

//     const { isLoaded } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
//         libraries: LIBRARIES,
//         region: 'NP'
//     });

//     const [kycData, setKycData] = useState({
//         businessInformation: {
//             businessName: userMerchant?.businessInformation?.businessName || merchant?.name || '',
//             businessName_nepali: userMerchant?.businessInformation?.businessName_nepali || '',
//             tradeName: userMerchant?.businessInformation?.tradeName || '',
//             outletName: "",
//             businessRegistrationType: userMerchant?.businessInformation?.businessRegistrationType || '',
//             registrationNumber: userMerchant?.businessInformation?.registrationNumber || '',
//             registrationCertificateFile: userMerchant?.businessInformation?.registrationCertificateFile || '',
//             dateOfRegistration: userMerchant?.businessInformation?.dateOfRegistration || '',
//             dateOfRegistration_bs: userMerchant?.businessInformation?.dateOfRegistration_bs || '',
//             yearsInOperation: userMerchant?.businessInformation?.yearsInOperation?.toString() || '',
//             businessStatus: userMerchant?.businessInformation?.businessStatus || '',
//         },
//         taxStatutoryDocuments: {
//             panCertificateFile: userMerchant?.taxStatutoryDocuments?.panCertificateFile || '',
//             panNumber: userMerchant?.taxStatutoryDocuments?.panNumber || '',
//             vatCertificateFile: userMerchant?.taxStatutoryDocuments?.vatCertificateFile || '',
//             vatNumber: userMerchant?.taxStatutoryDocuments?.vatNumber || '',
//             lastAuditReportFile: userMerchant?.taxStatutoryDocuments?.lastAuditReportFile || '',
//             otherLicenses_licenseType: userMerchant?.taxStatutoryDocuments?.otherLicenses_licenseType || [],
//             otherLicenses_licenseNumber: userMerchant?.taxStatutoryDocuments?.otherLicenses_licenseNumber || [],
//             otherLicenses_licenseExpiryDate: userMerchant?.taxStatutoryDocuments?.otherLicenses_licenseExpiryDate || [],
//             otherLicenses_licenseFile: userMerchant?.taxStatutoryDocuments?.otherLicenses_licenseFile || [],
//         },
//         locationPremises: {
//             physicalAddress: userMerchant?.locationPremises?.physicalAddress || merchant?.address || '',
//             wardNumber: userMerchant?.locationPremises?.wardNumber?.toString() || '',
//             city: userMerchant?.locationPremises?.city || '',
//             gpsCoordinates_lat: userMerchant?.locationPremises?.gpsCoordinates_lat || 0,
//             gpsCoordinates_lng: userMerchant?.locationPremises?.gpsCoordinates_lng || 0,
//             ownershipOfPremises: userMerchant?.locationPremises?.ownershipOfPremises || '',
//             rentAgreementFile: userMerchant?.locationPremises?.rentAgreementFile || '',
//         },
//         visualVerification: {
//             premisesExteriorPhoto: userMerchant?.visualVerification?.premisesExteriorPhoto || '',
//             interiorPhoto: userMerchant?.visualVerification?.interiorPhoto || '',
//             signboardPhoto: userMerchant?.visualVerification?.signboardPhoto || '',
//             storageOrKitchenPhoto: userMerchant?.visualVerification?.storageOrKitchenPhoto || '',
//         },
//         ownerPrimaryController: Array.isArray(userMerchant?.ownerPrimaryController) && userMerchant.ownerPrimaryController.length > 0
//             ? userMerchant.ownerPrimaryController.map((owner: any) => ({
//                 ownerFullName: owner.ownerFullName || '',
//                 ownerCitizenship: owner.ownerCitizenship || '',
//                 ownerEmail: owner.ownerEmail || '',
//                 ownerPhoneNumber: owner.ownerPhoneNumber || '',
//                 ownerAlternatePhone: owner.ownerAlternatePhone || '',
//                 governmentIdNumber: owner.governmentIdNumber || '',
//                 governmentIdType: owner.governmentIdType || '',
//                 governmentIdFront: owner.governmentIdFront || '',
//                 governmentIdBack: owner.governmentIdBack || '',
//                 ownerPhotoSelfie: owner.ownerPhotoSelfie || '',
//                 permanentAddress: owner.permanentAddress || owner.ownerPermanentAddress || '',
//                 houseNumber: owner.houseNumber || '',
//                 streetName: owner.streetName || '',
//                 wardNumber: owner.wardNumber || '',
//                 municipality: owner.municipality || '',
//                 district: owner.district || '',
//                 province: owner.province || '',
//                 country: owner.country || '',
//                 fathersName: owner.fathersName || '',
//                 grandFathersName: owner.grandFathersName || '',
//                 ownershipPercentage: owner.ownershipPercentage || (userMerchant?.isSoleProprietor) ? 100 : 0,
//             }))
//             : [{
//                 ownerFullName: userMerchant?.ownerPrimaryController?.ownerFullName || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim(),
//                 ownerCitizenship: userMerchant?.ownerPrimaryController?.ownerCitizenship || '',
//                 ownerEmail: userMerchant?.ownerPrimaryController?.ownerEmail || '',
//                 ownerPhoneNumber: userMerchant?.ownerPrimaryController?.ownerPhoneNumber || profile?.phone || '',
//                 ownerAlternatePhone: userMerchant?.ownerPrimaryController?.ownerAlternatePhone || '',
//                 governmentIdNumber: userMerchant?.ownerPrimaryController?.governmentIdNumber || '',
//                 governmentIdType: userMerchant?.ownerPrimaryController?.governmentIdType || '',
//                 governmentIdFront: userMerchant?.ownerPrimaryController?.governmentIdFront || '',
//                 governmentIdBack: userMerchant?.ownerPrimaryController?.governmentIdBack || '',
//                 ownerPhotoSelfie: userMerchant?.ownerPrimaryController?.ownerPhotoSelfie || '',
//                 permanentAddress: userMerchant?.ownerPrimaryController?.ownerPermanentAddress || '',
//                 houseNumber: userMerchant?.ownerPrimaryController?.houseNumber || '',
//                 streetName: userMerchant?.ownerPrimaryController?.streetName || '',
//                 wardNumber: userMerchant?.ownerPrimaryController?.wardNumber || '',
//                 municipality: userMerchant?.ownerPrimaryController?.municipality || '',
//                 district: userMerchant?.ownerPrimaryController?.district || '',
//                 province: userMerchant?.ownerPrimaryController?.province || '',
//                 country: userMerchant?.ownerPrimaryController?.country || '',
//                 fathersName: userMerchant?.ownerPrimaryController?.fathersName || '',
//                 grandFathersName: userMerchant?.ownerPrimaryController?.grandFathersName || '',
//                 ownershipPercentage: 100,
//             }],
//         isSoleProprietor: userMerchant?.isSoleProprietor ?? true,
//         financialProfile: {
//             averageMonthlySales: userMerchant?.financialProfile?.averageMonthlySales || 0,
//             paymentAcceptanceTypes: userMerchant?.financialProfile?.paymentAcceptanceTypes || [],
//             bankAccountExists: userMerchant?.financialProfile?.bankAccountExists ?? true,
//             bankName: userMerchant?.financialProfile?.bankName || '',
//             bankAccountNumber: userMerchant?.financialProfile?.bankAccountNumber || '',
//             bankStatementFile: userMerchant?.financialProfile?.bankStatementFile || '',
//             salesRecordsFile: userMerchant?.financialProfile?.salesRecordsFile || '',
//         },
//         operational: {
//             dailyOperatingHours: userMerchant?.operational?.dailyOperatingHours || [],
//             peakBusinessDays: userMerchant?.operational?.peakBusinessDays || [],
//             numberOfStaff: userMerchant?.operational?.numberOfStaff || 0,
//             supplierDependencyLevel: userMerchant?.operational?.supplierDependencyLevel || "",
//             existingCreditObligations: userMerchant?.operational?.existingCreditObligations ?? false,
//             existingLenders: userMerchant?.operational?.existingLenders || [],
//         },
//         businessCategory: userMerchant?.businessCategory || '',
//         operationalCategory: userMerchant?.businessCategory || '',
//         paymentOptions: {
//             paymentFrequency: userMerchant?.paymentOptions?.paymentFrequency || '',
//             selectedWeekday: userMerchant?.paymentOptions?.selectedWeekday || '',
//         },
//         contractWalletConsent: {
//             preferredPaymentFrequency: userMerchant?.contractWalletConsent?.preferredPaymentFrequency || "",
//             autoDebitConsent: userMerchant?.contractWalletConsent?.autoDebitConsent ?? false,
//             walletTermsAccepted: userMerchant?.contractWalletConsent?.walletTermsAccepted ?? false,
//             platformTermsAccepted: userMerchant?.contractWalletConsent?.platformTermsAccepted ?? false,
//             dataUsageConsent: userMerchant?.contractWalletConsent?.dataUsageConsent ?? false,
//             collectionsConsent: userMerchant?.contractWalletConsent?.collectionsConsent ?? false,
//             marketingConsent: userMerchant?.contractWalletConsent?.marketingConsent ?? false,
//         }
//     });

//     useEffect(() => {
//         if (userMerchant) {
//             setKycData(prev => ({
//                 ...prev,
//                 businessInformation: {
//                     ...prev.businessInformation,
//                     businessName: userMerchant.businessInformation?.businessName || merchant?.name || prev.businessInformation.businessName,
//                     tradeName: userMerchant.businessInformation?.tradeName || prev.businessInformation.tradeName,
//                     outletName: "",
//                     registrationNumber: userMerchant.businessInformation?.registrationNumber || prev.businessInformation.registrationNumber,
//                     yearsInOperation: userMerchant.businessInformation?.yearsInOperation?.toString() || prev.businessInformation.yearsInOperation,
//                     businessRegistrationType: userMerchant.businessInformation?.businessRegistrationType || prev.businessInformation.businessRegistrationType,
//                     registrationCertificateFile: userMerchant.businessInformation?.registrationCertificateFile || prev.businessInformation.registrationCertificateFile,
//                     dateOfRegistration: userMerchant.businessInformation?.dateOfRegistration || prev.businessInformation.dateOfRegistration,
//                     businessStatus: userMerchant.businessInformation?.businessStatus || prev.businessInformation.businessStatus,
//                 },
//                 locationPremises: {
//                     ...prev.locationPremises,
//                     physicalAddress: userMerchant.locationPremises?.physicalAddress || merchant?.address || prev.locationPremises.physicalAddress,
//                     wardNumber: userMerchant.locationPremises?.wardNumber?.toString() || prev.locationPremises.wardNumber,
//                     city: userMerchant.locationPremises?.city || prev.locationPremises.city,
//                     gpsCoordinates_lat: userMerchant.locationPremises?.gpsCoordinates_lat || prev.locationPremises.gpsCoordinates_lat,
//                     gpsCoordinates_lng: userMerchant.locationPremises?.gpsCoordinates_lng || prev.locationPremises.gpsCoordinates_lng,
//                     ownershipOfPremises: userMerchant.locationPremises?.ownershipOfPremises || prev.locationPremises.ownershipOfPremises,
//                     rentAgreementFile: userMerchant.locationPremises?.rentAgreementFile || prev.locationPremises.rentAgreementFile,
//                 },
//                 ownerPrimaryController: Array.isArray(userMerchant.ownerPrimaryController) && userMerchant.ownerPrimaryController.length > 0
//                     ? userMerchant.ownerPrimaryController.map((owner: any) => ({
//                         ownerFullName: owner.ownerFullName || '',
//                         ownerCitizenship: owner.ownerCitizenship || '',
//                         ownerEmail: owner.ownerEmail || '',
//                         ownerPhoneNumber: owner.ownerPhoneNumber || '',
//                         ownerAlternatePhone: owner.ownerAlternatePhone || '',
//                         governmentIdNumber: owner.governmentIdNumber || '',
//                         governmentIdType: owner.governmentIdType || '',
//                         governmentIdFront: owner.governmentIdFront || '',
//                         governmentIdBack: owner.governmentIdBack || '',
//                         ownerPhotoSelfie: owner.ownerPhotoSelfie || '',
//                         permanentAddress: owner.permanentAddress || owner.ownerPermanentAddress || '',
//                         houseNumber: owner.houseNumber || '',
//                         streetName: owner.streetName || '',
//                         wardNumber: owner.wardNumber || '',
//                         municipality: owner.municipality || '',
//                         district: owner.district || '',
//                         province: owner.province || '',
//                         country: owner.country || '',
//                         fathersName: owner.fathersName || '',
//                         grandFathersName: owner.grandFathersName || '',
//                         ownershipPercentage: owner.ownershipPercentage || (userMerchant.isSoleProprietor) ? 100 : 0,
//                     }))
//                     : [{
//                         ownerFullName: userMerchant.ownerPrimaryController?.ownerFullName || prev.ownerPrimaryController?.[0]?.ownerFullName || '',
//                         ownerCitizenship: userMerchant.ownerPrimaryController?.ownerCitizenship || prev.ownerPrimaryController?.[0]?.ownerCitizenship || '',
//                         ownerEmail: userMerchant.ownerPrimaryController?.ownerEmail || prev.ownerPrimaryController?.[0]?.ownerEmail || '',
//                         ownerPhoneNumber: userMerchant.ownerPrimaryController?.ownerPhoneNumber || prev.ownerPrimaryController?.[0]?.ownerPhoneNumber || '',
//                         ownerAlternatePhone: userMerchant.ownerPrimaryController?.ownerAlternatePhone || prev.ownerPrimaryController?.[0]?.ownerAlternatePhone || '',
//                         governmentIdNumber: userMerchant.ownerPrimaryController?.governmentIdNumber || prev.ownerPrimaryController?.[0]?.governmentIdNumber || '',
//                         governmentIdType: userMerchant.ownerPrimaryController?.governmentIdType || prev.ownerPrimaryController?.[0]?.governmentIdType || '',
//                         governmentIdFront: userMerchant.ownerPrimaryController?.governmentIdFront || prev.ownerPrimaryController?.[0]?.governmentIdFront || '',
//                         governmentIdBack: userMerchant.ownerPrimaryController?.governmentIdBack || prev.ownerPrimaryController?.[0]?.governmentIdBack || '',
//                         ownerPhotoSelfie: userMerchant.ownerPrimaryController?.ownerPhotoSelfie || prev.ownerPrimaryController?.[0]?.ownerPhotoSelfie || '',
//                         permanentAddress: userMerchant.ownerPrimaryController?.ownerPermanentAddress || prev.ownerPrimaryController?.[0]?.permanentAddress || '',
//                         houseNumber: userMerchant.ownerPrimaryController?.houseNumber || prev.ownerPrimaryController?.[0]?.houseNumber || '',
//                         streetName: userMerchant.ownerPrimaryController?.streetName || prev.ownerPrimaryController?.[0]?.streetName || '',
//                         wardNumber: userMerchant.ownerPrimaryController?.wardNumber || prev.ownerPrimaryController?.[0]?.wardNumber || '',
//                         municipality: userMerchant.ownerPrimaryController?.municipality || prev.ownerPrimaryController?.[0]?.municipality || '',
//                         district: userMerchant.ownerPrimaryController?.district || prev.ownerPrimaryController?.[0]?.district || '',
//                         province: userMerchant.ownerPrimaryController?.province || prev.ownerPrimaryController?.[0]?.province || '',
//                         country: userMerchant.ownerPrimaryController?.country || prev.ownerPrimaryController?.[0]?.country || '',
//                         fathersName: userMerchant.ownerPrimaryController?.fathersName || prev.ownerPrimaryController?.[0]?.fathersName || '',
//                         grandFathersName: userMerchant.ownerPrimaryController?.grandFathersName || prev.ownerPrimaryController?.[0]?.grandFathersName || '',
//                         ownershipPercentage: 100,
//                     }],
//                 isSoleProprietor: userMerchant.isSoleProprietor ?? prev.isSoleProprietor,
//                 financialProfile: {
//                     ...prev.financialProfile,
//                     averageMonthlySales: userMerchant.financialProfile?.averageMonthlySales || prev.financialProfile.averageMonthlySales,
//                     paymentAcceptanceTypes: userMerchant.financialProfile?.paymentAcceptanceTypes || prev.financialProfile.paymentAcceptanceTypes,
//                     bankAccountExists: userMerchant.financialProfile?.bankAccountExists ?? prev.financialProfile.bankAccountExists,
//                     bankName: userMerchant.financialProfile?.bankName || prev.financialProfile.bankName,
//                     bankAccountNumber: userMerchant.financialProfile?.bankAccountNumber || prev.financialProfile.bankAccountNumber,
//                     bankStatementFile: userMerchant.financialProfile?.bankStatementFile || prev.financialProfile.bankStatementFile,
//                     salesRecordsFile: userMerchant.financialProfile?.salesRecordsFile || prev.financialProfile.salesRecordsFile,
//                 },
//                 taxStatutoryDocuments: {
//                     ...prev.taxStatutoryDocuments,
//                     panCertificateFile: userMerchant.taxStatutoryDocuments?.panCertificateFile || prev.taxStatutoryDocuments?.panCertificateFile,
//                     panNumber: userMerchant.taxStatutoryDocuments?.panNumber || prev.taxStatutoryDocuments?.panNumber,
//                     vatCertificateFile: userMerchant.taxStatutoryDocuments?.vatCertificateFile || prev.taxStatutoryDocuments?.vatCertificateFile,
//                     vatNumber: userMerchant.taxStatutoryDocuments?.vatNumber || prev.taxStatutoryDocuments?.vatNumber,
//                     lastAuditReportFile: userMerchant.taxStatutoryDocuments?.lastAuditReportFile || prev.taxStatutoryDocuments?.lastAuditReportFile,
//                     otherLicenses_licenseType: userMerchant.taxStatutoryDocuments?.otherLicenses_licenseType || prev.taxStatutoryDocuments?.otherLicenses_licenseType,
//                     otherLicenses_licenseNumber: userMerchant.taxStatutoryDocuments?.otherLicenses_licenseNumber || prev.taxStatutoryDocuments?.otherLicenses_licenseNumber,
//                     otherLicenses_licenseExpiryDate: userMerchant.taxStatutoryDocuments?.otherLicenses_licenseExpiryDate || prev.taxStatutoryDocuments?.otherLicenses_licenseExpiryDate,
//                     otherLicenses_licenseFile: userMerchant.taxStatutoryDocuments?.otherLicenses_licenseFile || prev.taxStatutoryDocuments?.otherLicenses_licenseFile,
//                 },
//                 visualVerification: {
//                     ...prev.visualVerification,
//                     premisesExteriorPhoto: userMerchant.visualVerification?.premisesExteriorPhoto || prev.visualVerification.premisesExteriorPhoto,
//                     interiorPhoto: userMerchant.visualVerification?.interiorPhoto || prev.visualVerification.interiorPhoto,
//                     signboardPhoto: userMerchant.visualVerification?.signboardPhoto || prev.visualVerification.signboardPhoto,
//                     storageOrKitchenPhoto: userMerchant.visualVerification?.storageOrKitchenPhoto || prev.visualVerification.storageOrKitchenPhoto,
//                 },
//                 operational: {
//                     ...prev.operational,
//                     dailyOperatingHours: userMerchant.operational?.dailyOperatingHours || prev.operational.dailyOperatingHours,
//                     peakBusinessDays: userMerchant.operational?.peakBusinessDays || prev.operational.peakBusinessDays,
//                     numberOfStaff: userMerchant.operational?.numberOfStaff || prev.operational.numberOfStaff,
//                     supplierDependencyLevel: userMerchant.operational?.supplierDependencyLevel || prev.operational.supplierDependencyLevel,
//                     existingCreditObligations: userMerchant.operational?.existingCreditObligations ?? prev.operational.existingCreditObligations,
//                     existingLenders: userMerchant.operational?.existingLenders || prev.operational.existingLenders,
//                 },
//                 businessCategory: userMerchant.businessCategory || prev.businessCategory,
//                 contractWalletConsent: {
//                     ...prev.contractWalletConsent,
//                     preferredPaymentFrequency: userMerchant.contractWalletConsent?.preferredPaymentFrequency || prev.contractWalletConsent.preferredPaymentFrequency,
//                     autoDebitConsent: userMerchant.contractWalletConsent?.autoDebitConsent ?? prev.contractWalletConsent.autoDebitConsent,
//                     walletTermsAccepted: userMerchant.contractWalletConsent?.walletTermsAccepted ?? prev.contractWalletConsent.walletTermsAccepted,
//                     platformTermsAccepted: userMerchant.contractWalletConsent?.platformTermsAccepted ?? prev.contractWalletConsent.platformTermsAccepted,
//                     dataUsageConsent: userMerchant.contractWalletConsent?.dataUsageConsent ?? prev.contractWalletConsent.dataUsageConsent,
//                     collectionsConsent: userMerchant.contractWalletConsent?.collectionsConsent ?? prev.contractWalletConsent.collectionsConsent,
//                     marketingConsent: userMerchant.contractWalletConsent?.marketingConsent ?? prev.contractWalletConsent.marketingConsent,
//                 },
//                 paymentOptions: {
//                     ...prev.paymentOptions,
//                     paymentFrequency: userMerchant.paymentOptions?.paymentFrequency || prev.paymentOptions.paymentFrequency,
//                     selectedWeekday: userMerchant.paymentOptions?.selectedWeekday || prev.paymentOptions.selectedWeekday,
//                 },
//             }));
//         }
//     }, [userMerchant, merchant]);

//     const getPresignedUrl = useGetPresignedUrlMutation();
//     const verifyUrl = useVerifyUrlMutation();
//     const [uploadingField, setUploadingField] = useState<string | null>(null);

//     const updateKycFromVerification = async (data: any, s3Keys: string[], type: string = 'businessInformation', field?: string) => {
//         // Prepare new data objects by merging the AI verification result with current state
//         let updatedBusinessInfo = { ...kycData.businessInformation };
//         let updatedTaxDocs = { ...kycData.taxStatutoryDocuments };

//         let targetIndex = 0;
//         if (field) {
//             const match = field.match(/\[(\d+)\]/);
//             if (match) targetIndex = parseInt(match[1]);
//         }
//         const updatedOwnerInfoArray = [...kycData.ownerPrimaryController];
//         let updatedOwnerInfo = { ...updatedOwnerInfoArray[targetIndex] };

//         const primaryS3Key = s3Keys[0];

//         // Update the specific file field with the primary s3Key
//         if (field) {
//             const parts = field.split('.');
//             let current: any;
//             if (type === 'businessInformation') current = updatedBusinessInfo;
//             else if (type === 'taxStatutoryDocuments') current = updatedTaxDocs;
//             else if (type === 'ownerPrimaryController') current = updatedOwnerInfo;

//             for (let i = 1; i < parts.length; i++) {
//                 const part = parts[i];
//                 const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);

//                 if (arrayMatch) {
//                     const key = arrayMatch[1];
//                     const index = parseInt(arrayMatch[2]);

//                     if (i === parts.length - 1) {
//                         current[key] = [...(current[key] || [])];
//                         current[key][index] = primaryS3Key;
//                     } else {
//                         current[key] = [...(current[key] || [])];
//                         current[key][index] = { ...current[key][index] };
//                         current = current[key][index];
//                     }
//                 } else {
//                     if (i === parts.length - 1) {
//                         current[part] = primaryS3Key;
//                     } else {
//                         current[part] = { ...current[part] };
//                         current = current[part];
//                     }
//                 }
//             }
//         }

//         // Special handling for multiside IDs to ensure both keys are in the sync and state payload
//         if (type === 'ownerPrimaryController' && s3Keys.length === 2) {
//             updatedOwnerInfo.governmentIdFront = s3Keys[0];
//             updatedOwnerInfo.governmentIdBack = s3Keys[1];
//         }

//         if (type === 'businessInformation') {
//             if (data.businessInformation) {
//                 let yearsInOperation = data.businessInformation.yearsInOperation ? String(data.businessInformation.yearsInOperation) : updatedBusinessInfo.yearsInOperation;

//                 if (data.businessInformation.dateOfRegistration) {
//                     const regDate = new Date(data.businessInformation.dateOfRegistration);
//                     if (!isNaN(regDate.getTime())) {
//                         const today = new Date();
//                         let totalMonths = (today.getFullYear() - regDate.getFullYear()) * 12 + (today.getMonth() - regDate.getMonth());
//                         if (today.getDate() < regDate.getDate()) {
//                             totalMonths--;
//                         }

//                         const years = Math.floor(totalMonths / 12);
//                         const months = totalMonths % 12;

//                         const parts = [];
//                         if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
//                         if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
//                         yearsInOperation = parts.join(' ') || '0 months';
//                     }
//                 }

//                 updatedBusinessInfo = {
//                     ...updatedBusinessInfo,
//                     businessName: data.businessInformation.businessName || updatedBusinessInfo.businessName,
//                     businessName_nepali: data.businessInformation.businessName_nepali || updatedBusinessInfo.businessName_nepali,
//                     tradeName: data.businessInformation.tradeName || data.businessInformation.businessName || updatedBusinessInfo.tradeName,
//                     businessRegistrationType: data.businessInformation.businessRegistrationType || updatedBusinessInfo.businessRegistrationType,
//                     registrationNumber: data.businessInformation.registrationNumber || updatedBusinessInfo.registrationNumber,
//                     dateOfRegistration: data.businessInformation.dateOfRegistration || updatedBusinessInfo.dateOfRegistration,
//                     dateOfRegistration_bs: data.businessInformation.dateOfRegistration_bs || updatedBusinessInfo.dateOfRegistration_bs,
//                     yearsInOperation,
//                 };
//             }
//         } else if (type === 'taxStatutoryDocuments') {
//             if (data.taxStatutoryDocuments) {
//                 updatedTaxDocs = {
//                     ...updatedTaxDocs,
//                     panNumber: data.taxStatutoryDocuments.panNumber || updatedTaxDocs.panNumber,
//                     vatNumber: data.taxStatutoryDocuments.vatNumber || updatedTaxDocs.vatNumber,
//                 };
//             }
//         } else if (type === 'ownerPrimaryController') {
//             if (data.ownerPrimaryController) {
//                 updatedOwnerInfo = {
//                     ...updatedOwnerInfo,
//                     ownerFullName: data.ownerPrimaryController.ownerFullName || updatedOwnerInfo.ownerFullName,
//                     ownerCitizenship: data.ownerPrimaryController.ownerCitizenship || updatedOwnerInfo.ownerCitizenship,
//                     governmentIdNumber: data.ownerPrimaryController.governmentIdNumber || updatedOwnerInfo.governmentIdNumber,
//                     governmentIdType: data.ownerPrimaryController.governmentIdType || updatedOwnerInfo.governmentIdType,
//                     permanentAddress: data.ownerPrimaryController.permanentAddress || updatedOwnerInfo.permanentAddress,
//                     houseNumber: data.ownerPrimaryController.houseNumber || updatedOwnerInfo.houseNumber,
//                     streetName: data.ownerPrimaryController.streetName || updatedOwnerInfo.streetName,
//                     wardNumber: data.ownerPrimaryController.wardNumber || updatedOwnerInfo.wardNumber,
//                     municipality: data.ownerPrimaryController.municipality || updatedOwnerInfo.municipality,
//                     district: data.ownerPrimaryController.district || updatedOwnerInfo.district,
//                     province: data.ownerPrimaryController.province || updatedOwnerInfo.province,
//                     country: data.ownerPrimaryController.country || updatedOwnerInfo.country,
//                     fathersName: data.ownerPrimaryController.fathersName || updatedOwnerInfo.fathersName,
//                     grandFathersName: data.ownerPrimaryController.grandFathersName || updatedOwnerInfo.grandFathersName,
//                 };
//             }
//             updatedOwnerInfoArray[targetIndex] = updatedOwnerInfo;
//         }

//         // Update local state
//         setKycData((prev: any) => ({
//             ...prev,
//             businessInformation: type === 'businessInformation' ? updatedBusinessInfo : prev.businessInformation,
//             taxStatutoryDocuments: type === 'taxStatutoryDocuments' ? updatedTaxDocs : prev.taxStatutoryDocuments,
//             ownerPrimaryController: type === 'ownerPrimaryController' ? updatedOwnerInfoArray : prev.ownerPrimaryController,
//         }));

//         // Auto-save the extracted information to the profile
//         try {
//             if (type === 'businessInformation' && data.businessInformation?.businessName) {
//                 setForceSearchName(data.businessInformation.businessName);
//             }
//         } catch (error) {
//             console.error('Failed to auto-save KYC data:', error);
//         }
//     };

//     const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
//         const file = event.target.files?.[0];
//         if (!file) return;

//         // Special handling for ID Front/Back combination - wait for both
//         const isIdFront = field.includes('governmentIdFront');
//         const isIdBack = field.includes('governmentIdBack');
//         const baseFieldMatch = field.match(/^ownerPrimaryController\[\d+\]/);
//         const baseField = baseFieldMatch ? baseFieldMatch[0] : null;
//         const frontField = baseField ? `${baseField}.governmentIdFront` : field;
//         const backField = baseField ? `${baseField}.governmentIdBack` : field;

//         if (isIdFront) {
//             setTempFiles(prev => ({ ...prev, [field]: file }));
//             // Set File object locally to show selected state in DocPreview
//             handleKYCInputChange(field, file);
//             toast.info('Front ID image saved locally. Please upload the Back ID to complete.');
//             return;
//         }

//         try {
//             setUploadingField(field);
//             let s3Keys: string[] = [];
//             let fieldToUpdate = field;

//             if (isIdBack) {
//                 const frontFile = tempFiles[frontField];
//                 if (!frontFile) {
//                     toast.error('Please upload Government ID Front first');
//                     setUploadingField(null);
//                     return;
//                 }

//                 toast.info('Uploading ID images...');
//                 const frontKey = await uploadFile(frontFile);
//                 const backKey = await uploadFile(file);

//                 s3Keys = [frontKey, backKey];

//                 // Update local state with S3 keys
//                 handleKYCInputChange(frontField, frontKey);
//                 handleKYCInputChange(backField, backKey);
//                 fieldToUpdate = frontField; // Use front as base for extraction mapping

//                 // Clear temp file
//                 setTempFiles(prev => {
//                     const newState = { ...prev };
//                     delete newState[frontField];
//                     return newState;
//                 });
//             } else {
//                 const s3Key = await uploadFile(file);
//                 s3Keys = [s3Key];
//                 handleKYCInputChange(field, s3Key);
//             }

//             // Particular fields trigger AI verification
//             const verifyMapping: Record<string, string> = {
//                 'businessInformation.registrationCertificateFile': 'businessInformation',
//                 'taxStatutoryDocuments.panCertificateFile': 'taxStatutoryDocuments',
//                 'taxStatutoryDocuments.vatCertificateFile': 'taxStatutoryDocuments',
//             };

//             let verificationType = verifyMapping[field];
//             if (!verificationType && baseField && (isIdFront || isIdBack)) {
//                 verificationType = 'ownerPrimaryController';
//             }
//             if (!verificationType && field.includes('otherLicenses_licenseFile')) {
//                 verificationType = 'taxStatutoryDocuments';
//             }

//             if (verificationType) {
//                 // Only trigger verification for ID if both front and back are provided (total of 2 s3Keys)
//                 if (verificationType === 'ownerPrimaryController' && s3Keys.length < 2) {
//                     toast.success('File uploaded');
//                     setUploadingField(null);
//                     return;
//                 }

//                 toast.info('Verifying document...');
//                 const verificationResult = await verifyUrl.mutateAsync({ urls: s3Keys, type: verificationType });
//                 if (verificationResult?.error) {
//                     // toast.error(verificationResult.error);
//                     handleKYCInputChange(field, null);
//                     setErrors(prev => ({ ...prev, [field]: verificationResult.error }));
//                     setUploadingField(null);
//                     return;
//                 }
//                 if (verificationResult) {
//                     // Update from verification using all keys (e.g. front/back)
//                     await updateKycFromVerification(verificationResult, s3Keys, verificationType, fieldToUpdate);
//                     toast.success('Document verified and info extracted!');
//                 }
//             } else {
//                 toast.success('File uploaded');
//             }
//         } catch (err) {
//             console.error('File upload/verification error:', err);
//             toast.error('Failed to upload/verify file. Please try again.');
//         } finally {
//             setUploadingField(null);
//         }
//     };

//     const uploadFile = async (file: File) => {
//         const { url, key } = await getPresignedUrl.mutateAsync({
//             fileName: file.name,
//             category: activeTab,
//             contentType: file.type
//         });
//         await uploadFileToS3(url, file);
//         return key;
//     };

//     const handleKYCInputChange = (field: string, value: any) => {
//         setErrors(prev => {
//             const newErrors = { ...prev };
//             delete newErrors[field];
//             return newErrors;
//         });
//         setKycData(prev => {
//             const newState = { ...prev };
//             const parts = field.split('.');
//             let current: any = newState;

//             for (let i = 0; i < parts.length; i++) {
//                 const part = parts[i];
//                 const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);

//                 if (arrayMatch) {
//                     const key = arrayMatch[1];
//                     const index = parseInt(arrayMatch[2]);

//                     if (i === parts.length - 1) {
//                         const newArray = [...(current[key] || [])];
//                         newArray[index] = value;
//                         current[key] = newArray;
//                     } else {
//                         current[key] = [...(current[key] || [])];
//                         current[key][index] = { ...current[key][index] };
//                         current = current[key][index];
//                     }
//                 } else {
//                     if (i === parts.length - 1) {
//                         current[part] = value;
//                     } else {
//                         current[part] = { ...current[part] };
//                         current = current[part];
//                     }
//                 }
//             }
//             return newState;
//         });
//     };

//     const handleSaveProfile = async () => {
//         try {
//             // Mapping of tabs to kycData sections
//             const tabToSections: Record<string, string[]> = {
//                 'Business Info': ['businessInformation'],
//                 'Tax Documents': ['taxStatutoryDocuments'],
//                 'Location': ['locationPremises'],
//                 'Visuals': ['visualVerification'],
//                 'Owner / Primary Controller': ['ownerPrimaryController', 'isSoleProprietor'],
//                 'Financial': ['financialProfile'],
//                 'Operational': ['operational', 'businessCategory', 'operationalCategory'],
//                 'Payment Options': ['paymentOptions'],
//                 'Consent': ['contractWalletConsent']
//             };

//             const activeSections = tabToSections[activeTab] || [];

//             // Validation for Owner / Primary Controller
//             if (activeTab === 'Owner / Primary Controller') {
//                 const totalOwnership = kycData.ownerPrimaryController.reduce((sum: number, owner: any) => sum + (parseFloat(owner.ownershipPercentage?.toString() || '0')), 0);
//                 if (totalOwnership !== 100) {
//                     toast.error(`Total ownership percentage must be exactly 100%. Current total: ${totalOwnership}%`);
//                     return;
//                 }
//                 for (const owner of kycData.ownerPrimaryController) {
//                     if (!owner.ownershipPercentage || owner.ownershipPercentage <= 0 || owner.ownershipPercentage > 100) {
//                         toast.error(`Owner ${owner.ownerFullName || ''} must have an ownership percentage between 1% and 100%`);
//                         return;
//                     }
//                 }
//             }

//             // 1. Gather all File objects currently in state for ACTIVE SECTIONS ONLY
//             const pendingFiles: { field: string, file: File }[] = [];
//             const findFiles = (obj: any, prefix = '') => {
//                 if (!obj) return;

//                 if (Array.isArray(obj)) {
//                     obj.forEach((item, index) => {
//                         const fullKey = `${prefix}[${index}]`;
//                         // Only add if it belongs to an active section
//                         if (activeSections.some(s => fullKey.startsWith(s))) {
//                             if (item instanceof File) {
//                                 pendingFiles.push({ field: fullKey, file: item });
//                             } else if (item && typeof item === 'object' && !(item instanceof Date)) {
//                                 findFiles(item, fullKey);
//                             }
//                         }
//                     });
//                 } else {
//                     for (const key in obj) {
//                         const value = obj[key];
//                         const fullKey = prefix ? `${prefix}.${key}` : key;

//                         // Only add if it belongs to an active section
//                         if (activeSections.some(s => fullKey.startsWith(s))) {
//                             if (value instanceof File) {
//                                 pendingFiles.push({ field: fullKey, file: value });
//                             } else if (value && typeof value === 'object' && !(value instanceof Date)) {
//                                 findFiles(value, fullKey);
//                             }
//                         }
//                     }
//                 }
//             };
//             findFiles(kycData);

//             // 2. Upload them and store keys
//             const uploadedKeys: Record<string, string> = {};
//             if (pendingFiles.length > 0) {
//                 setUploadingField('processing');
//                 for (const item of pendingFiles) {
//                     try {
//                         const s3Key = await uploadFile(item.file);
//                         uploadedKeys[item.field] = s3Key;
//                         handleKYCInputChange(item.field, s3Key);
//                     } catch {
//                         toast.error(`Failed to upload ${item.field}`);
//                         setUploadingField(null);
//                         return;
//                     }
//                 }
//                 setUploadingField(null);
//             }

//             const getFinalVal = (fieldPath: string, defaultVal: any = null) => {
//                 if (uploadedKeys[fieldPath]) return uploadedKeys[fieldPath];
//                 const val = fieldPath.split('.').reduce((acc, part) => acc && acc[part], kycData as any);
//                 if (val instanceof File) return defaultVal;
//                 return val || defaultVal;
//             };

//             const getFinalArray = (fieldPath: string) => {
//                 const parts = fieldPath.split('.');
//                 const arr = parts.reduce((acc, part) => acc && acc[part], kycData as any);
//                 if (!Array.isArray(arr)) return [];
//                 return arr.map((item, index) => {
//                     const key = `${fieldPath}[${index}]`;
//                     if (uploadedKeys[key]) return uploadedKeys[key];
//                     if (item instanceof File) return null;
//                     return item;
//                 });
//             };

//             // Build partial payload
//             const payload: any = {};

//             if (activeTab === 'Business Info') {
//                 payload.businessInformation = {
//                     businessName: kycData.businessInformation.businessName,
//                     businessName_nepali: kycData.businessInformation.businessName_nepali,
//                     tradeName: kycData.businessInformation.tradeName || kycData.businessInformation.businessName,
//                     outletName: showOutletField ? kycData.businessInformation.outletName : undefined,
//                     businessRegistrationType: kycData.businessInformation.businessRegistrationType,
//                     registrationNumber: kycData.businessInformation.registrationNumber,
//                     registrationCertificateFile: getFinalVal('businessInformation.registrationCertificateFile'),
//                     dateOfRegistration: kycData.businessInformation.dateOfRegistration,
//                     dateOfRegistration_bs: kycData.businessInformation.dateOfRegistration_bs,
//                     yearsInOperation: kycData.businessInformation.yearsInOperation || "",
//                     businessStatus: kycData.businessInformation.businessStatus
//                 };
//             }

//             if (activeTab === 'Tax Documents') {
//                 payload.taxStatutoryDocuments = {
//                     panCertificateFile: getFinalVal('taxStatutoryDocuments.panCertificateFile'),
//                     panNumber: kycData.taxStatutoryDocuments.panNumber,
//                     vatCertificateFile: getFinalVal('taxStatutoryDocuments.vatCertificateFile'),
//                     vatNumber: kycData.taxStatutoryDocuments.vatNumber,
//                     lastAuditReportFile: getFinalVal('taxStatutoryDocuments.lastAuditReportFile'),
//                     otherLicenses_licenseType: kycData.taxStatutoryDocuments.otherLicenses_licenseType,
//                     otherLicenses_licenseNumber: kycData.taxStatutoryDocuments.otherLicenses_licenseNumber,
//                     otherLicenses_licenseExpiryDate: kycData.taxStatutoryDocuments.otherLicenses_licenseExpiryDate,
//                     otherLicenses_licenseFile: getFinalArray('taxStatutoryDocuments.otherLicenses_licenseFile')
//                 };
//             }

//             if (activeTab === 'Location') {
//                 payload.locationPremises = {
//                     physicalAddress: kycData.locationPremises.physicalAddress,
//                     wardNumber: parseInt(kycData.locationPremises.wardNumber) || 1,
//                     city: kycData.locationPremises.city || "Kathmandu",
//                     gpsCoordinates_lat: kycData.locationPremises.gpsCoordinates_lat,
//                     gpsCoordinates_lng: kycData.locationPremises.gpsCoordinates_lng,
//                     ownershipOfPremises: kycData.locationPremises.ownershipOfPremises,
//                     rentAgreementFile: getFinalVal('locationPremises.rentAgreementFile')
//                 };
//             }

//             if (activeTab === 'Visuals') {
//                 payload.visualVerification = {
//                     premisesExteriorPhoto: getFinalVal('visualVerification.premisesExteriorPhoto'),
//                     signboardPhoto: getFinalVal('visualVerification.signboardPhoto'),
//                     interiorPhoto: getFinalVal('visualVerification.interiorPhoto'),
//                     storageOrKitchenPhoto: getFinalVal('visualVerification.storageOrKitchenPhoto')
//                 };
//             }

//             if (activeTab === 'Owner / Primary Controller') {
//                 payload.isSoleProprietor = kycData.isSoleProprietor;
//                 payload.ownerPrimaryController = kycData.ownerPrimaryController.map((owner: any, index: number) => ({
//                     ownerFullName: owner.ownerFullName,
//                     ownerCitizenship: owner.ownerCitizenship || "Nepalese",
//                     ownerPhoneNumber: owner.ownerPhoneNumber,
//                     ownerAlternatePhone: owner.ownerAlternatePhone || "",
//                     ownerEmail: owner.ownerEmail,
//                     governmentIdType: owner.governmentIdType,
//                     governmentIdNumber: owner.governmentIdNumber,
//                     governmentIdFront: getFinalVal(`ownerPrimaryController[${index}].governmentIdFront`),
//                     governmentIdBack: getFinalVal(`ownerPrimaryController[${index}].governmentIdBack`),
//                     ownerPhotoSelfie: getFinalVal(`ownerPrimaryController[${index}].ownerPhotoSelfie`),
//                     permanentAddress: owner.permanentAddress,
//                     houseNumber: owner.houseNumber,
//                     streetName: owner.streetName,
//                     wardNumber: parseInt(owner.wardNumber) || undefined,
//                     municipality: owner.municipality,
//                     district: owner.district,
//                     province: owner.province,
//                     country: owner.country,
//                     fathersName: owner.fathersName,
//                     grandFathersName: owner.grandFathersName,
//                     ownershipPercentage: owner.ownershipPercentage
//                 }));
//             }

//             if (activeTab === 'Financial') {
//                 payload.financialProfile = {
//                     averageMonthlySales: kycData.financialProfile.averageMonthlySales,
//                     paymentAcceptanceTypes: kycData.financialProfile.paymentAcceptanceTypes,
//                     bankAccountExists: kycData.financialProfile.bankAccountExists,
//                     bankName: kycData.financialProfile.bankName || null,
//                     bankAccountNumber: kycData.financialProfile.bankAccountNumber || null,
//                     bankStatementFile: getFinalVal('financialProfile.bankStatementFile'),
//                     salesRecordsFile: getFinalVal('financialProfile.salesRecordsFile')
//                 };
//             }

//             if (activeTab === 'Operational') {
//                 payload.operational = {
//                     dailyOperatingHours: kycData.operational.dailyOperatingHours,
//                     peakBusinessDays: kycData.operational.peakBusinessDays,
//                     numberOfStaff: kycData.operational.numberOfStaff,
//                     supplierDependencyLevel: kycData.operational.supplierDependencyLevel,
//                     existingCreditObligations: kycData.operational.existingCreditObligations,
//                     existingLenders: kycData.operational.existingLenders
//                 };
//                 payload.businessCategory = kycData.businessCategory || "Retail";
//                 payload.businessType = [kycData.operationalCategory || "General"];
//             }

//             if (activeTab === 'Payment Options') {
//                 payload.paymentOptions = {
//                     paymentFrequency: kycData.paymentOptions.paymentFrequency,
//                     selectedWeekday: kycData.paymentOptions.selectedWeekday,
//                 };
//             }

//             if (activeTab === 'Consent') {
//                 payload.contractWalletConsent = {
//                     preferredPaymentFrequency: kycData.contractWalletConsent.preferredPaymentFrequency,
//                     autoDebitConsent: kycData.contractWalletConsent.autoDebitConsent,
//                     walletTermsAccepted: kycData.contractWalletConsent.walletTermsAccepted,
//                     platformTermsAccepted: kycData.contractWalletConsent.platformTermsAccepted,
//                     dataUsageConsent: kycData.contractWalletConsent.dataUsageConsent,
//                     collectionsConsent: kycData.contractWalletConsent.collectionsConsent,
//                     marketingConsent: kycData.contractWalletConsent.marketingConsent
//                 };
//             }

//             await updateProfile.mutateAsync(payload);
//             await refreshProfile();
//             toast.success(`${activeTab} updated successfully`);
//         } catch (error: any) {
//             toast.error(error?.response?.data?.message || `Failed to update ${activeTab}`);
//         }
//     };

//     if (isProfileLoading) {
//         return (
//             <DashboardLayout>
//                 <div className="flex items-center justify-center min-h-[400px]">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//                 </div>
//             </DashboardLayout>
//         );
//     }

//     if (isEditing) {
//         return (
//             <DashboardLayout>
//                 <div className={`mx-auto transition-all duration-300 ${(activeTab === 'Owner / Primary Controller' && !kycData.isSoleProprietor) ? 'max-w-6xl' : 'max-w-4xl'}`}>
//                     <div className="sticky -top-6 z-30 bg-gray-50 -mt-4 pt-4 pb-4 flex flex-col gap-6 -mx-4 sm:-mx-8 px-4 sm:px-8">
//                         <div className="flex items-center justify-between py-4">
//                             <div className="flex items-center gap-4">
//                                 <button
//                                     onClick={() => setIsEditing(false)}
//                                     className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white border hover:border-gray-200 transition"
//                                 >
//                                     <Icon name="chevron-left" size={20} className="text-gray-500" />
//                                 </button>
//                                 <div>
//                                     <h1 className="text-xl font-semibold text-gray-900">Edit {activeTab}</h1>
//                                     <p className="text-xs text-gray-500">Update specific details for this category.</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-3">
//                                 <button
//                                     onClick={() => setIsEditing(false)}
//                                     className="px-6 py-2 text-gray-400 font-semibold hover:text-gray-600 transition"
//                                 >
//                                     Finish
//                                 </button>
//                                 <button
//                                     onClick={handleSaveProfile}
//                                     disabled={updateProfile.isPending}
//                                     className={`px-8 py-2 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark shadow-md active:scale-95 transition ${updateProfile.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
//                                 >
//                                     {updateProfile.isPending ? 'Saving...' : `Save ${activeTab}`}
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="flex items-center justify-center border-gray-200 gap-4">
//                             <div className="flex overflow-x-auto scrollbar-hide">
//                                 {TABS.map((tab, index) => (
//                                     <button
//                                         key={tab}
//                                         onClick={() => setActiveTab(tab)}
//                                         className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === tab
//                                             ? 'border-red-600 text-red-600'
//                                             : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                             }`}
//                                     >
//                                         <span className="font-semibold text-sm">{activeTab === tab ? (index + 1) + ". " + tab : (index + 1)}</span>
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex flex-col lg:flex-row gap-8 items-start">
//                         <div className="bg-white rounded-[32px] border border-gray-100 p-8 mt-2 shadow-sm flex-1 w-full">
//                             {activeTab === 'Business Info' && (
//                                 <BusinessInfoTab
//                                     isLoaded={isLoaded}
//                                     kycData={kycData}
//                                     handleKYCInputChange={handleKYCInputChange}
//                                     handleFileUpload={handleFileUpload}
//                                     uploadingField={uploadingField}
//                                     isProfileMode={true}
//                                     errors={errors}
//                                     forceSearchName={forceSearchName}
//                                 />
//                             )}

//                             {activeTab === 'Tax Documents' && (
//                                 <TaxDocumentsTab
//                                     kycData={kycData}
//                                     handleKYCInputChange={handleKYCInputChange}
//                                     handleFileUpload={handleFileUpload}
//                                     uploadingField={uploadingField}
//                                     isProfileMode={true}
//                                     errors={errors}
//                                 />
//                             )}

//                             {activeTab === 'Location' && (
//                                 <LocationPremisesTab
//                                     kycData={kycData}
//                                     handleKYCInputChange={handleKYCInputChange}
//                                     handleFileUpload={handleFileUpload}
//                                     uploadingField={uploadingField}
//                                     isProfileMode={true}
//                                     errors={errors}
//                                 />
//                             )}

//                             {activeTab === 'Visuals' && (
//                                 <VisualVerificationTab
//                                     kycData={kycData}
//                                     handleKYCInputChange={handleKYCInputChange}
//                                     handleFileUpload={handleFileUpload}
//                                     uploadingField={uploadingField}
//                                     isProfileMode={true}
//                                     errors={errors}
//                                 />
//                             )}

//                             {activeTab === 'Owner / Primary Controller' && (
//                                 <OwnerPrimaryControllerTab
//                                     kycData={kycData}
//                                     handleKYCInputChange={handleKYCInputChange}
//                                     handleFileUpload={handleFileUpload}
//                                     uploadingField={uploadingField}
//                                     isProfileMode={true}
//                                     errors={errors}
//                                 />
//                             )}

//                             {activeTab === 'Financial' && (
//                                 <FinancialProfileTab
//                                     kycData={kycData}
//                                     handleKYCInputChange={handleKYCInputChange}
//                                     handleFileUpload={handleFileUpload}
//                                     uploadingField={uploadingField}
//                                     isProfileMode={true}
//                                     errors={errors}
//                                 />
//                             )}

//                             {activeTab === 'Operational' && (
//                                 <OperationalTab
//                                     kycData={kycData}
//                                     handleKYCInputChange={handleKYCInputChange}
//                                     isProfileMode={true}
//                                     errors={errors}
//                                 />
//                             )}

//                             {activeTab === 'Payment Options' && (
//                                 <PaymentOptionsTab
//                                     kycData={kycData}
//                                     handleKYCInputChange={handleKYCInputChange}
//                                     isProfileMode={true}
//                                     errors={errors}
//                                 />
//                             )}

//                             {activeTab === 'Consent' && (
//                                 <ConsentTab
//                                     kycData={kycData}
//                                     handleKYCInputChange={handleKYCInputChange}
//                                     isProfileMode={true}
//                                     errors={errors}
//                                 />
//                             )}
//                         </div>

//                         {activeTab === 'Owner / Primary Controller' && !kycData.isSoleProprietor && (
//                             <div className="hidden lg:block w-80 sticky top-32 mt-2">
//                                 <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
//                                     <h3 className="text-xl font-semibold text-gray-900 mb-6">Ownership Summary</h3>
//                                     <div className="space-y-4 mb-8">
//                                         {(kycData?.ownerPrimaryController || []).map((owner: any, index: number) => (
//                                             <div key={index} className="flex justify-between items-center text-sm">
//                                                 <span className="text-gray-500 truncate mr-4">
//                                                     {owner.ownerFullName || `Owner #${index + 1}`}
//                                                 </span>
//                                                 <span className="font-semibold text-gray-900 whitespace-nowrap">
//                                                     {owner.ownershipPercentage || 0}%
//                                                 </span>
//                                             </div>
//                                         ))}
//                                     </div>

//                                     <div className="pt-6 border-t border-gray-100">
//                                         <div className="flex justify-between items-center mb-4">
//                                             <span className="text-base font-semibold text-gray-900">Total Ownership</span>
//                                             <span className={`text-lg font-bold ${Math.abs((kycData?.ownerPrimaryController || []).reduce((sum: number, o: any) => sum + (parseFloat(o.ownershipPercentage?.toString() || '0')), 0) - 100) < 0.01 ? 'text-green-500' : 'text-red-500'}`}>
//                                                 {(kycData?.ownerPrimaryController || []).reduce((sum: number, o: any) => sum + (parseFloat(o.ownershipPercentage?.toString() || '0')), 0)}%
//                                             </span>
//                                         </div>

//                                         {Math.abs((kycData?.ownerPrimaryController || []).reduce((sum: number, o: any) => sum + (parseFloat(o.ownershipPercentage?.toString() || '0')), 0) - 100) > 0.01 && (
//                                             <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl text-xs text-red-600 font-mediumm leading-relaxed">
//                                                 <div className='mt-0.5'>
//                                                     <Icon name="alert-warning" size={14} />
//                                                 </div>
//                                                 <span>Total ownership must be exactly 100%. Please adjust percentages.</span>
//                                             </div>
//                                         )}
//                                         {Math.abs((kycData?.ownerPrimaryController || []).reduce((sum: number, o: any) => sum + (parseFloat(o.ownershipPercentage?.toString() || '0')), 0) - 100) < 0.01 && (kycData?.ownerPrimaryController || []).some((o: any) => !o.ownershipPercentage || parseFloat(o.ownershipPercentage.toString()) <= 0) && (
//                                             <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl text-xs text-red-600 font-mediumm leading-relaxed">
//                                                 <div className='mt-0.5'>
//                                                     <Icon name="alert-warning" size={14} />
//                                                 </div>
//                                                 <span>Each owner must have a percentage greater than 0%.</span>
//                                             </div>
//                                         )}
//                                         {Math.abs((kycData?.ownerPrimaryController || []).reduce((sum: number, o: any) => sum + (parseFloat(o.ownershipPercentage?.toString() || '0')), 0) - 100) < 0.01 && !(kycData?.ownerPrimaryController || []).some((o: any) => !o.ownershipPercentage || parseFloat(o.ownershipPercentage.toString()) <= 0) && (
//                                             <div className="flex items-start gap-2 p-3 bg-green-50 rounded-xl text-xs text-green-600 font-mediumm">
//                                                 <div className='mt-0.5'>
//                                                     <Icon name="check-circle" size={14} />
//                                                 </div>
//                                                 <span>Ownership distribution is valid!</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </DashboardLayout>
//         );
//     }

//     return (
//         <DashboardLayout>
//             <div className="">
//                 <div className="mb-0 flex flex-col items-center">
//                     <div className="max-w-4xl w-full flex items-center gap-4 mb-2 mt-4 ">
//                         <h1 className="text-2xl font-semibold text-gray-900">Business Profile</h1>
//                         <div className={`px-4 py-1.5 rounded-full flex items-center justify-center gap-2 border shadow-sm ${merchant?.kycStatus === 'done'
//                             ? 'bg-green-50 border-green-100 text-green-700'
//                             : 'bg-blue-50 border-blue-100 text-blue-700'
//                             }`}>
//                             <Icon name="check-circle" size={16} className={merchant?.kycStatus === 'done' ? 'text-green-600' : 'text-blue-600'} />
//                             <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
//                                 {merchant?.kycStatus === 'done' ? 'Verified' : 'Under Review'}
//                             </span>
//                         </div>

//                         <button
//                             onClick={() => setIsEditing(true)}
//                             className="ml-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-200 hover:border-primary-dark hover:text-primary-dark text-gray-700 rounded-full transition-all font-semibold text-xs shadow-sm active:scale-95 whitespace-nowrap mb-1"
//                         >
//                             <Icon name="edit" size={14} className="text-gray-500" />
//                             <span>Edit Profile</span>
//                         </button>

//                     </div>
//                     <p className="max-w-4xl w-full text-sm text-gray-500 leading-relaxed">
//                         {merchant?.kycStatus === 'done'
//                             ? 'Your business profile is fully verified. You have full access to platform features, settlement tools, and credit facilities.'
//                             : 'Your business verification is currently pending review. Redtab will verify your details and documents shortly to unlock full platform features and higher credit limits.'}
//                     </p>
//                 </div>

//                 {/* Tabs */}
//                 <div className="sticky left-0 right-0 -top-6 bg-gray-50 z-30 pt-2 -mx-4 sm:-mx-8 px-4 sm:px-8">
//                     <div className="flex items-center justify-center border-gray-200 gap-4">
//                         <div className="flex overflow-x-auto scrollbar-hide">
//                             {TABS.map((tab, index) => (
//                                 <button
//                                     key={tab}
//                                     onClick={() => setActiveTab(tab)}
//                                     className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === tab
//                                         ? 'border-red-600 text-red-600'
//                                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                         }`}
//                                 >

//                                     <span className="font-semibold text-sm">{activeTab === tab ? (index + 1) + ". " + tab : (index + 1)}</span>
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-2xl sm:rounded-[32px] border border-gray-100 p-5 mt-4 sm:p-8 shadow-sm min-h-[500px]">
//                     {activeTab === 'Business Info' && (
//                         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                             <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
//                                 <div className="w-1 h-5 bg-red-600 rounded-full" />
//                                 Registration Details
//                             </h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
//                                 <DetailField label="Business Name" value={kycData.businessInformation.businessName} />
//                                 <DetailField label="Business Name (Nepali)" value={kycData.businessInformation.businessName_nepali} />
//                                 <DetailField label="Trade Name" value={kycData.businessInformation.tradeName} />
//                                 <DetailField label="Date of Registration (AD)" value={kycData.businessInformation.dateOfRegistration ? new Date(kycData.businessInformation.dateOfRegistration).toLocaleDateString() : ''} />
//                                 <DetailField label="Date of Registration (BS)" value={kycData.businessInformation.dateOfRegistration_bs} />
//                                 <DetailField label="Years in Operation" value={kycData.businessInformation.yearsInOperation} />
//                                 <DetailField label="Business Status" value={kycData.businessInformation.businessStatus} />
//                                 <DetailField label="Registration Type" value={kycData.businessInformation.businessRegistrationType} />
//                                 <DetailField label="Registration Number" value={kycData.businessInformation.registrationNumber} />
//                                 <div className="md:col-span-2">
//                                     <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Registration Certificate</p>
//                                     <DocPreview key_value={kycData.businessInformation.registrationCertificateFile} />
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {activeTab === 'Tax Documents' && (
//                         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                             <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
//                                 <div className="w-1 h-5 bg-red-600 rounded-full" />
//                                 Tax & Statutory
//                             </h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                                 {kycData.businessInformation?.businessRegistrationType === 'VAT Registration' ? (
//                                     <>
//                                         <div className="md:col-span-2">
//                                             <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">VAT Certificate</p>
//                                             <DocPreview key_value={kycData.taxStatutoryDocuments.vatCertificateFile} />
//                                         </div>
//                                         <div className="md:col-span-2">
//                                             <DetailField label="VAT Number" value={kycData.taxStatutoryDocuments.vatNumber} />
//                                         </div>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <div className="md:col-span-2">
//                                             <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">PAN Certificate</p>
//                                             <DocPreview key_value={kycData.taxStatutoryDocuments.panCertificateFile} />
//                                         </div>
//                                         <div className="md:col-span-2">
//                                             <DetailField label="PAN Number" value={kycData.taxStatutoryDocuments.panNumber} />
//                                         </div>
//                                     </>
//                                 )}
//                                 <div className="md:col-span-2">
//                                     <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Last Audit Report</p>
//                                     <DocPreview key_value={kycData.taxStatutoryDocuments.lastAuditReportFile} />
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {activeTab === 'Location' && (
//                         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                             <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
//                                 <div className="w-1 h-5 bg-red-600 rounded-full" />
//                                 Location Details
//                             </h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
//                                 <div className="md:col-span-2">
//                                     <DetailField label="Physical Address" value={kycData.locationPremises.physicalAddress} />
//                                 </div>
//                                 <DetailField label="City" value={kycData.locationPremises.city} />
//                                 <DetailField label="Ward Number" value={kycData.locationPremises.wardNumber} />
//                                 <DetailField label="Ownership Type" value={kycData.locationPremises.ownershipOfPremises} />
//                                 {kycData.locationPremises.ownershipOfPremises === 'Rented' && (
//                                     <div className="md:col-span-2">
//                                         <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Rent Agreement</p>
//                                         <DocPreview key_value={kycData.locationPremises.rentAgreementFile} />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     )}

//                     {activeTab === 'Visuals' && (
//                         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                             <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
//                                 <div className="w-1 h-5 bg-red-600 rounded-full" />
//                                 Verification Photos
//                             </h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                                 <div>
//                                     <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Exterior view</p>
//                                     <DocPreview key_value={kycData.visualVerification.premisesExteriorPhoto} />
//                                 </div>
//                                 <div>
//                                     <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Interior view</p>
//                                     <DocPreview key_value={kycData.visualVerification.interiorPhoto} />
//                                 </div>
//                                 <div>
//                                     <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Signboard photo</p>
//                                     <DocPreview key_value={kycData.visualVerification.signboardPhoto} />
//                                 </div>
//                                 <div>
//                                     <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Storage/Kitchen View</p>
//                                     <DocPreview key_value={kycData.visualVerification.storageOrKitchenPhoto} />
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {activeTab === 'Owner / Primary Controller' && (
//                         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                             <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
//                                 <div className="w-1 h-5 bg-red-600 rounded-full" />
//                                 Owner / Primary Controller Details
//                             </h3>
//                             <div className="p-6 border border-gray-100 rounded-[32px] bg-gray-50/50 text-center">
//                                 <p className="text-sm font-semibold text-gray-700 mb-2">
//                                     {kycData.isSoleProprietor
//                                         ? 'Registered as a Sole Proprietor'
//                                         : 'Multiple owners registered'}
//                                 </p>
//                                 <p className="text-xs text-gray-500 mb-6">Ownership data is synchronized with regulatory filings.</p>
//                             </div>

//                             {kycData.ownerPrimaryController.map((owner: any, index: number) => (
//                                 <div key={index} className={`mt-4 pt-6 ${index > 0 ? 'border-t border-gray-100' : ''}`}>
//                                     <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
//                                         <div className="w-1 h-5 bg-red-600 rounded-full" />
//                                         Owner / Primary Controller {kycData.ownerPrimaryController.length > 1 ? `#${index + 1}` : ''}
//                                     </h3>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
//                                         <DetailField label="Full Name" value={owner.ownerFullName} />
//                                         <DetailField label="Citizenship" value={owner.ownerCitizenship} />
//                                         <DetailField label="Email Address" value={owner.ownerEmail} />
//                                         <DetailField label="Phone Number" value={owner.ownerPhoneNumber} />

//                                         <DetailField label="ID Type" value={owner.governmentIdType} />
//                                         <DetailField label="ID Number" value={owner.governmentIdNumber} />
//                                         <DetailField label="Permanent Address" value={owner.permanentAddress || owner.ownerPermanentAddress} />
//                                         <DetailField label="District" value={owner.district} />
//                                         <DetailField label="Municipality" value={owner.municipality} />
//                                         <DetailField label="Ward Number" value={owner.wardNumber} />
//                                         <DetailField label="Father's Name" value={owner.fathersName} />
//                                         <DetailField label="Grandfather's Name" value={owner.grandFathersName} />
//                                         <DetailField label="Ownership %" value={owner.ownershipPercentage ? `${owner.ownershipPercentage}%` : "100%"} />

//                                         <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
//                                             <div>
//                                                 <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Govt ID Front</p>
//                                                 <DocPreview key_value={owner.governmentIdFront} />
//                                             </div>
//                                             <div>
//                                                 <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Govt ID Back</p>
//                                                 <DocPreview key_value={owner.governmentIdBack} />
//                                             </div>
//                                         </div>
//                                         <div className="md:col-span-2">
//                                             <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Owner Photo / Selfie</p>
//                                             <DocPreview key_value={owner.ownerPhotoSelfie} />
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     {activeTab === 'Financial' && (
//                         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                                 <div className="w-1 h-5 bg-red-600 rounded-full" />
//                                 Financial Profile
//                             </h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
//                                 <DetailField label="Avg. Monthly Sales" value={`NPR ${kycData.financialProfile.averageMonthlySales}`} />
//                                 <DetailField label="Bank Name" value={kycData.financialProfile.bankName} />
//                                 <div className="md:col-span-2">
//                                     <DetailField label="Account Number" value={kycData.financialProfile.bankAccountNumber} />
//                                 </div>
//                                 <div>
//                                     <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Bank Statement</p>
//                                     <DocPreview key_value={kycData.financialProfile.bankStatementFile} />
//                                 </div>
//                                 <div>
//                                     <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Sales Records</p>
//                                     <DocPreview key_value={kycData.financialProfile.salesRecordsFile} />
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {activeTab === 'Operational' && (
//                         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                             <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
//                                 <div className="w-1 h-5 bg-red-600 rounded-full" />
//                                 Operational Stats
//                             </h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
//                                 <div className="md:col-span-2">
//                                     <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Hours of Operation</p>
//                                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
//                                         {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
//                                             <div key={day} className="flex flex-col gap-1.5 border-l-2 border-gray-50 pl-3">
//                                                 <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{day}</span>
//                                                 <span className="text-xs font-semibold text-gray-900">{kycData.operational.dailyOperatingHours[idx] || 'Not set'}</span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                                 <DetailField label="Number of Staff" value={kycData.operational.numberOfStaff.toString()} />
//                                 <DetailField label="Business Category" value={kycData.businessCategory} />
//                                 <DetailField label="Number of Suppliers" value={kycData.operational.supplierDependencyLevel} />
//                                 <DetailField label="Peak Business Days" value={kycData.operational.peakBusinessDays.join(', ')} />
//                                 <DetailField label="Credit Obligations" value={kycData.operational.existingCreditObligations ? 'Yes' : 'No'} />
//                                 {kycData.operational.existingCreditObligations && (
//                                     <div className="md:col-span-2">
//                                         <DetailField label="Existing Lenders" value={kycData.operational.existingLenders.join(', ') || 'None listed'} />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     )}

//                     {activeTab === 'Payment Options' && (
//                         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                             <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
//                                 <div className="w-1 h-5 bg-red-600 rounded-full" />
//                                 Payment Options
//                             </h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
//                                 <DetailField label="Payment Frequency" value={kycData.paymentOptions.paymentFrequency} />
//                                 {kycData.paymentOptions.paymentFrequency === 'Weekly' && (
//                                     <DetailField label="Preferred Weekday" value={kycData.paymentOptions.selectedWeekday} />
//                                 )}
//                             </div>
//                         </div>
//                     )}

//                     {activeTab === 'Consent' && (
//                         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
//                             <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
//                                 <div className="w-1 h-5 bg-red-600 rounded-full" />
//                                 Agreements & Consents
//                             </h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
//                                 <DetailField label="Settlement Frequency" value={kycData.contractWalletConsent.preferredPaymentFrequency} />
//                                 <DetailField label="Auto-Debit Enabled" value={kycData.contractWalletConsent.autoDebitConsent ? 'Yes' : 'No'} />
//                                 <DetailField label="Marketing Opt-in" value={kycData.contractWalletConsent.marketingConsent ? 'Yes' : 'No'} />
//                                 <DetailField label="Collections Consent" value={kycData.contractWalletConsent.collectionsConsent ? 'Yes' : 'No'} />
//                                 <DetailField label="Data Usage Consent" value={kycData.contractWalletConsent.dataUsageConsent ? 'Yes' : 'No'} />
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </DashboardLayout>
//     );
// }

// function DetailField({ label, value }: { label: string, value: any }) {
//     let displayValue = (value !== null && value !== undefined && value !== '') ? value : null;

//     if (Array.isArray(value)) {
//         displayValue = value.join(', ');
//     }

//     return (
//         <div className="flex flex-col gap-1.5">
//             <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
//             <div className="text-sm font-semibold text-gray-900 border-b border-gray-50 pb-2">
//                 {displayValue ?? <span className="text-gray-300 italic">Not provided</span>}
//             </div>
//         </div>
//     );
// }
