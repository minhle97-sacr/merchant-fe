import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Outlet {
    id: number;
    name: string;
    address?: string;
}

interface BusinessProfile {
    id: number;
    isSoleProprietor: boolean;
    businessInformation: {
        businessName: string | null;
        businessName_nepali: string | null;
        tradeName: string | null;
        businessRegistrationType: string | null;
        registrationNumber: string | null;
        registrationCertificateFile: string | null;
        dateOfRegistration: string | null;
        dateOfRegistration_bs: string | null;
        yearsInOperation: number | null;
        businessStatus: string | null;
    };
    taxStatutoryDocuments: {
        panCertificateFile: string | null;
        panNumber: string | null;
        vatCertificateFile: string | null;
        vatNumber: string | null;
        lastAuditReportFile: string | null;
        otherLicenses_licenseType: string[];
        otherLicenses_licenseNumber: string[];
        otherLicenses_licenseExpiryDate: string[];
        otherLicenses_licenseFile: string[];
    };
    locationPremises: {
        physicalAddress: string | null;
        wardNumber: number | null;
        city: string | null;
        gpsCoordinates_lat: number | null;
        gpsCoordinates_lng: number | null;
        ownershipOfPremises: string | null;
        rentAgreementFile: string | null;
    };
    visualVerification: {
        premisesExteriorPhoto: string | null;
        signboardPhoto: string | null;
        interiorPhoto: string | null;
        storageOrKitchenPhoto: string | null;
    };
    ownerPrimaryController: Array<{
        ownerFullName: string | null;
        ownerCitizenship: string | null;
        ownerEmail: string | null;
        ownerPhoneNumber: string | null;
        ownerAlternatePhone: string | null;
        governmentIdNumber: string | null;
        governmentIdType: string | null;
        governmentIdFront: string | null;
        governmentIdBack: string | null;
        ownerPhotoSelfie: string | null;
        permanentAddress: string | null;
        houseNumber: string | null;
        streetName: string | null;
        wardNumber: number | null;
        municipality: string | null;
        district: string | null;
        province: string | null;
        country: string | null;
        fathersName: string | null;
        grandFathersName: string | null;
        ownershipPercentage: number | null;
    }>;
    financialProfile: {
        averageMonthlySales: number | null;
        paymentAcceptanceTypes: string[];
        bankAccountExists: boolean;
        bankName: string | null;
        bankAccountNumber: string | null;
        bankStatementFile: string | null;
        salesRecordsFile: string | null;
    };
    operational: {
        dailyOperatingHours: string[] | null;
        peakBusinessDays: string[];
        numberOfStaff: number | null;
        supplierDependencyLevel: string | null;
        existingCreditObligations: boolean;
        existingLenders: string[];
    };
    businessCategory: string | null;
    contractWalletConsent: {
        preferredPaymentFrequency: string | null;
        autoDebitConsent: boolean;
        walletTermsAccepted: boolean;
        platformTermsAccepted: boolean;
        dataUsageConsent: boolean;
        collectionsConsent: boolean;
        marketingConsent: boolean;
    };
    merchantId: number;
    createdAt: string;
    updatedAt: string;
}

interface UserProfile {
    id: number;
    phone: string;
    firstName: string | null;
    lastName: string | null;
    isVerified: boolean;
    email: string | null;
    isOtpVerified: boolean;
    merchant: {
        id: number;
        name: string;
        address: string;
        slug: string;
        kycStatus: 'incomplete' | 'being-verified' | 'done' | 'rejected';
    } | null;
    createdAt: string;
    updatedAt: string;
    role: 'owner' | 'manager' | 'operator' | "staff";
    isMerchantMember: boolean;
    isMerchantKycVerified: boolean;
    isSuperAdmin: boolean;
}

interface UserStore {
    profile: UserProfile | null;
    selectedOutlet: Outlet | null;
    setProfile: (profile: UserProfile | null) => void;
    setSelectedOutlet: (outlet: Outlet | null) => void;
    clearProfile: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            profile: null,
            selectedOutlet: null,
            setProfile: (profile) => set({ profile }),
            setSelectedOutlet: (selectedOutlet) => set({ selectedOutlet }),
            clearProfile: () => set({ profile: null, selectedOutlet: null }),
        }),
        {
            name: 'user-storage',
        }
    )
);
