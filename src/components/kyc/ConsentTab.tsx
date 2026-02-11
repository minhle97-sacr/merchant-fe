import React from 'react';
import { Checkbox } from '../Checkbox';

interface ConsentTabProps {
    kycData: any;
    handleKYCInputChange: (field: string, value: any) => void;
    isProfileMode?: boolean;
    errors?: Record<string, string>;
}

export const ConsentTab = ({
    kycData,
    handleKYCInputChange,
    isProfileMode,
    errors = {}
}: ConsentTabProps) => {
    return (
        <>
            <h1 className="text-4xl font-semibold mb-6">Final Consent</h1>
            <p className="text-gray-600 mb-10">Confirm terms and accept final legal consents.</p>
            <div className="space-y-6">
                {/* Mandatory Wallet Consent */}
                <div className={`p-6 border rounded-2xl transition-colors ${errors['contractWalletConsent.walletTermsAccepted'] ? 'bg-red-50/50 border-red-200' : 'bg-gray-50/50 border-gray-100'}`}>
                    <Checkbox
                        id="walletTermsAccepted"
                        checked={kycData.contractWalletConsent.walletTermsAccepted}
                        onCheckedChange={(checked) => handleKYCInputChange('contractWalletConsent.walletTermsAccepted', checked === true)}
                        label={
                            <div>
                                <p className={`font-semibold mb-1 ${errors['contractWalletConsent.walletTermsAccepted'] ? 'text-red-600' : 'text-gray-900'}`}>Electronic Wallet Terms *</p>
                                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                                    I agree to the creation of a digital wallet for the purpose of receiving settlements. I understand that funds within this wallet are subject to RedTab&apos;s transaction policies.
                                </p>
                            </div>
                        }
                        className="items-start"
                        checkboxClassName="mt-1"
                        labelClassName="flex-1 cursor-pointer"
                    />
                    {errors['contractWalletConsent.walletTermsAccepted'] && <span className="text-xs text-red-500 ml-1 mt-1 font-mediumm">{errors['contractWalletConsent.walletTermsAccepted']}</span>}
                </div>

                {/* Mandatory Platform Consent */}
                <div className={`p-6 border rounded-2xl transition-colors ${errors['contractWalletConsent.platformTermsAccepted'] ? 'bg-red-50/50 border-red-200' : 'bg-gray-50/50 border-gray-100'}`}>
                    <Checkbox
                        id="platformTermsAccepted"
                        checked={kycData.contractWalletConsent.platformTermsAccepted}
                        onCheckedChange={(checked) => handleKYCInputChange('contractWalletConsent.platformTermsAccepted', checked === true)}
                        label={
                            <div>
                                <p className={`font-semibold mb-1 ${errors['contractWalletConsent.platformTermsAccepted'] ? 'text-red-600' : 'text-gray-900'}`}>Platform Service Agreement *</p>
                                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                                    I accept the general terms of service for the RedTab platform, including service level agreements, fee structures, and merchant conduct guidelines.
                                </p>
                            </div>
                        }
                        className="items-start"
                        checkboxClassName="mt-1"
                        labelClassName="flex-1 cursor-pointer"
                    />
                    {errors['contractWalletConsent.platformTermsAccepted'] && <span className="text-xs text-red-500 ml-1 mt-1 font-mediumm">{errors['contractWalletConsent.platformTermsAccepted']}</span>}
                </div>

                {/* Mandatory Data Usage */}
                <div className={`p-6 border rounded-2xl transition-colors ${errors['contractWalletConsent.dataUsageConsent'] ? 'bg-red-50/50 border-red-200' : 'bg-gray-50/50 border-gray-100'}`}>
                    <Checkbox
                        id="dataUsageConsent"
                        checked={kycData.contractWalletConsent.dataUsageConsent}
                        onCheckedChange={(checked) => handleKYCInputChange('contractWalletConsent.dataUsageConsent', checked === true)}
                        label={
                            <div>
                                <p className={`font-semibold mb-1 ${errors['contractWalletConsent.dataUsageConsent'] ? 'text-red-600' : 'text-gray-900'}`}>Data Processing & Privacy *</p>
                                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                                    I consent to the processing of my business and personal data as outlined in the Privacy Policy, including verification with third-party credit bureaus and government databases.
                                </p>
                            </div>
                        }
                        className="items-start"
                        checkboxClassName="mt-1"
                        labelClassName="flex-1 cursor-pointer"
                    />
                    {errors['contractWalletConsent.dataUsageConsent'] && <span className="text-xs text-red-500 ml-1 mt-1 font-mediumm">{errors['contractWalletConsent.dataUsageConsent']}</span>}
                </div>

                {/* Mandatory Auto-Debit */}
                <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50">
                    <Checkbox
                        id="autoDebitConsent"
                        checked={kycData.contractWalletConsent.autoDebitConsent}
                        onCheckedChange={(checked) => handleKYCInputChange('contractWalletConsent.autoDebitConsent', checked === true)}
                        label={
                            <div>
                                <p className="font-semibold text-gray-900 mb-1">Automatic Settlement Authorization *</p>
                                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                                    I authorize RedTab to automatically debit my wallet and credit my registered bank account based on my selected settlement frequency.
                                </p>
                            </div>
                        }
                        className="items-start"
                        checkboxClassName="mt-1"
                        labelClassName="flex-1 cursor-pointer"
                    />
                </div>

                {/* Mandatory Collections */}
                <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50">
                    <Checkbox
                        id="collectionsConsent"
                        checked={kycData.contractWalletConsent.collectionsConsent}
                        onCheckedChange={(checked) => handleKYCInputChange('contractWalletConsent.collectionsConsent', checked === true)}
                        label={
                            <div>
                                <p className="font-semibold text-gray-900 mb-1">Repayment & Collections Authorization *</p>
                                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                                    I explicitly authorize RedTab or its financing partners to collect outstanding PayLater dues directly from my future sales settlements and available wallet balance.
                                </p>
                            </div>
                        }
                        className="items-start"
                        checkboxClassName="mt-1"
                        labelClassName="flex-1 cursor-pointer"
                    />
                </div>

                {/* Optional Marketing */}
                <div className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                    <Checkbox
                        id="marketingConsent"
                        checked={kycData.contractWalletConsent.marketingConsent}
                        onCheckedChange={(checked) => handleKYCInputChange('contractWalletConsent.marketingConsent', checked === true)}
                        label={
                            <div>
                                <p className="font-semibold text-gray-900 mb-1">Marketing & Insights</p>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    I would like to receive personalized business insights, promotional offers, and platform updates via email or SMS.
                                </p>
                            </div>
                        }
                        className="items-start"
                        checkboxClassName="mt-1"
                        labelClassName="flex-1 cursor-pointer"
                    />
                </div>
            </div>
        </>
    );
};
