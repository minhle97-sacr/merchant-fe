'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  useGetSuperAdminMerchantsQuery, 
  useUpdateMerchantKycStatusMutation, 
  useGetFileUrlMutation
} from '@/services/api';
import { toast } from 'sonner';
import AdminLayout from '@/components/AdminLayout';
import * as Dialog from '@radix-ui/react-dialog';
import { Icon } from '@/components/Icon';

const EmptyValue = () => (
  <span className="text-gray-300 flex items-center gap-1.5 italic  text-xs">
    <Icon name="close" size={14} className="w-3.5 h-3.5 shrink-0" />
    Empty
  </span>
);

const DataField = ({ label, value, className = "" }: { label: string, value: any, className?: string }) => (
  <div className={className}>
    <p className="text-xs text-slate-500 mb-0.5 font-mediumm uppercase tracking-wider">{label}</p>
    <div className="font-semibold text-slate-900 leading-snug">
      {value || value === 0 ? value : <EmptyValue />}
    </div>
  </div>
);

export default function AdminDashboard() {
  const { data: allMerchants = [], isLoading: isLoadingMerchants, error: merchantsError } = useGetSuperAdminMerchantsQuery();
  const updateKycStatus = useUpdateMerchantKycStatusMutation();
  
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'being-verified'>('all');
  const [activeTab, setActiveTab] = useState('Business Info');

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

  const filteredMerchants = useMemo(() => {
    if (filter === 'all') return allMerchants;
    return allMerchants.filter((m: any) => m.kycStatus === 'being-verified');
  }, [allMerchants, filter]);

  useEffect(() => {
    if (selectedMerchant) {
      setActiveTab('Business Info');
    }
  }, [selectedMerchant?.id]);

  useEffect(() => {
    if (merchantsError) {
      const status = (merchantsError as any)?.response?.status;
      if (status === 401 || status === 403) {
        toast.error('Unauthorized: Super Admin access required');
      }
    }
  }, [merchantsError]);

  const handleUpdateStatus = async (id: number, status: 'done' | 'rejected') => {
    try {
      await updateKycStatus.mutateAsync({ id, status });
      toast.success(`Merchant ${status === 'done' ? 'Approved' : 'Rejected'} successfully`);
      setSelectedMerchant(null);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Update failed';
      toast.error(errorMessage);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
              {filter === 'all' ? 'All Merchants' : 'Being Verified'}
            </h2>
            <p className="text-slate-500 mt-1">Review and verify documentation for new merchant accounts.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                All Merchants
              </button>
              <button
                onClick={() => setFilter('being-verified')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'being-verified' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Being Verified
              </button>
            </div>
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
              <span className="text-sm text-slate-500 font-mediumm">Found: </span>
              <span className="text-sm font-semibold text-slate-900">{filteredMerchants.length} Results</span>
            </div>
          </div>
        </div>

        {isLoadingMerchants ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : filteredMerchants.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="check" size={40} className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">No merchants found</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">There are no merchants matching your current filter.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredMerchants.map((merchant: any) => (
                  <div key={merchant.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow flex items-center p-4 group">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-semibold text-slate-600 text-xl border border-slate-200 group-hover:bg-red-50 group-hover:text-red-600 group-hover:border-red-100 transition-colors shrink-0">
                      {merchant.name?.charAt(0)}
                    </div>

                    <div className="ml-4 flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-slate-900 truncate">{merchant.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                          <Icon name="location" size={12} className="w-3 h-3 text-slate-400" />
                          {merchant.address}
                        </p>
                      </div>

                      <div className="hidden md:block">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Owner</p>
                        <p className="text-sm font-semibold text-slate-700 truncate">{merchant.businessProfile?.ownerPrimaryController?.ownerFullName || 'N/A'}</p>
                      </div>

                      <div className="hidden md:block">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Category</p>
                        <p className="text-sm font-semibold text-slate-700 truncate">{merchant.businessProfile?.businessCategory || 'N/A'}</p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4">
                        <span className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-lg border transition-colors ${merchant.kycStatus === 'done' || merchant.kycStatus === 'verified'
                            ? 'bg-green-50 text-green-600 border-green-100'
                            : merchant.kycStatus === 'rejected'
                              ? 'bg-red-50 text-red-600 border-red-100'
                              : merchant.kycStatus === 'incomplete'
                                ? 'bg-slate-50 text-slate-600 border-slate-100'
                                : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                          {merchant.kycStatus}
                        </span>

                        <Dialog.Root open={selectedMerchant?.id === merchant.id} onOpenChange={(open) => !open && setSelectedMerchant(null)}>
                          <Dialog.Trigger asChild>
                            <button
                              className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-xs text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-[0.98]"
                              onClick={() => setSelectedMerchant(merchant)}
                            >
                              Review
                            </button>
                          </Dialog.Trigger>

                          <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in" />
                            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-50 p-0 animate-in zoom-in-95 duration-200">
                              <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between z-10">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white font-semibold text-2xl">
                                    {selectedMerchant?.name?.charAt(0)}
                                  </div>
                                  <div>
                                    <Dialog.Title className="text-2xl font-semibold text-slate-900 leading-tight">{selectedMerchant?.name}</Dialog.Title>
                                    <p className="text-sm text-slate-500 font-mediumm">Merchant ID: #{selectedMerchant?.id}</p>
                                  </div>
                                </div>
                                <Dialog.Close asChild>
                                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                                    <Icon name="close" size={24} className="w-6 h-6" />
                                  </button>
                                </Dialog.Close>
                              </div>

                              <div className="sticky top-[97px] bg-white border-b border-slate-100 z-20 px-4 md:px-8 py-3 overflow-x-auto no-scrollbar flex items-center gap-2">
                                {TABS.map((tab) => (
                                  <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold whitespace-nowrap transition-all border ${activeTab === tab
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
                                      }`}
                                  >
                                    {tab}
                                  </button>
                                ))}
                              </div>

                              <div className="p-4 md:p-8">
                                <div className="min-h-[400px]">
                                  {activeTab === 'Business Info' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        <DataField label="Registered Name" value={selectedMerchant?.name} />
                                        <DataField label="Trade Name" value={selectedMerchant?.businessProfile?.businessInformation?.tradeName} />
                                        <DataField label="Reg Type" value={selectedMerchant?.businessProfile?.businessInformation?.businessRegistrationType} />
                                        <DataField label="Registration No." value={selectedMerchant?.businessProfile?.businessInformation?.registrationNumber} />
                                        <DataField label="Reg. Date" value={selectedMerchant?.businessProfile?.businessInformation?.dateOfRegistration} />
                                        <DataField label="Years in Operation" value={selectedMerchant?.businessProfile?.businessInformation?.yearsInOperation} />
                                      </section>
                                      <section className="pt-8 border-t border-slate-100">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Registration Documents</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                          <DocButton label="Reg. Certificate" field="businessInformation.registrationCertificateFile" />
                                        </div>
                                      </section>
                                    </div>
                                  )}

                                  {activeTab === 'Tax Documents' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <DocButton label="PAN Certificate" field="taxStatutoryDocuments.panCertificateFile" />
                                        <DocButton label="VAT Certificate" field="taxStatutoryDocuments.vatCertificateFile" />
                                        <DocButton label="Audit Report" field="taxStatutoryDocuments.lastAuditReportFile" />
                                      </section>

                                      {selectedMerchant?.businessProfile?.taxStatutoryDocuments?.otherLicenses_licenseType?.length > 0 && (
                                        <section className="pt-8 border-t border-slate-100">
                                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Additional Licenses</h4>
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {selectedMerchant.businessProfile.taxStatutoryDocuments.otherLicenses_licenseType.map((type: string, idx: number) => (
                                              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">{type}</p>
                                                <p className="text-xs font-semibold text-slate-900 mb-4">{selectedMerchant.businessProfile.taxStatutoryDocuments.otherLicenses_licenseNumber?.[idx]}</p>
                                                {selectedMerchant.businessProfile.taxStatutoryDocuments.otherLicenses_licenseFile?.[idx] && (
                                                  <DocButton label="View License" key_value={selectedMerchant.businessProfile.taxStatutoryDocuments.otherLicenses_licenseFile[idx]} />
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </section>
                                      )}
                                    </div>
                                  )}

                                  {activeTab === 'Location' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        <DataField label="Physical Address" value={selectedMerchant?.address} className="md:col-span-2" />
                                        <DataField label="City" value={selectedMerchant?.businessProfile?.locationPremises?.city} />
                                        <DataField label="Ward Number" value={selectedMerchant?.businessProfile?.locationPremises?.wardNumber} />
                                        <DataField label="Premises Status" value={selectedMerchant?.businessProfile?.locationPremises?.ownershipOfPremises} />
                                        <DataField label="GPS Latitude" value={selectedMerchant?.businessProfile?.locationPremises?.gpsCoordinates_lat} />
                                        <DataField label="GPS Longitude" value={selectedMerchant?.businessProfile?.locationPremises?.gpsCoordinates_lng} />
                                      </section>
                                      <section className="pt-8 border-t border-slate-100">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Location Documents</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                          <DocButton label="Rent Agreement" field="locationPremises.rentAgreementFile" />
                                        </div>
                                      </section>
                                    </div>
                                  )}

                                  {activeTab === 'Visuals' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                        <DocButton label="Store Exterior" field="visualVerification.premisesExteriorPhoto" />
                                        <DocButton label="Store Interior" field="visualVerification.interiorPhoto" />
                                        <DocButton label="Signboard" field="visualVerification.signboardPhoto" />
                                        <DocButton label="Storage/Kitchen" field="visualVerification.storageOrKitchenPhoto" />
                                      </div>
                                    </div>
                                  )}

                                  {activeTab === 'Owner / Primary Controller' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                      {(!selectedMerchant?.businessProfile?.ownerPrimaryController || selectedMerchant.businessProfile.ownerPrimaryController.length === 0) ? (
                                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                                            <Icon name="close" size={32} className="text-slate-300" />
                                          </div>
                                          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">No Ownership Data</h3>
                                          <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                                            The merchant has not yet submitted their owner and primary controller information.
                                          </p>
                                        </div>
                                      ) : (
                                        <div className="space-y-6">
                                          {selectedMerchant.businessProfile.ownerPrimaryController.map((owner: any, index: number) => (
                                            <section key={index} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                                              <div className="flex items-center justify-between mb-6">
                                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                                  {selectedMerchant.businessProfile.ownerPrimaryController.length > 1 ? `Owner / Primary Controller #${index + 1}` : 'Owner / Primary Controller'}
                                                </h4>
                                                <span className={`px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-wider ${index === 0 ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'}`}>
                                                  {index === 0 ? 'Primary' : 'Additional owner'}
                                                </span>
                                              </div>
                                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                                <DataField label="Full Name" value={owner.ownerFullName} />
                                                <DataField label="Phone" value={owner.ownerPhoneNumber} />
                                                <DataField label="Email" value={owner.ownerEmail} />
                                                <DataField label="ID Info" value={owner.governmentIdType ? `${owner.governmentIdType}: ${owner.governmentIdNumber}` : null} />
                                                <DataField label="Address" value={owner.permanentAddress || owner.ownerPermanentAddress} />
                                                <DataField label="District" value={owner.district} />
                                                <DataField label="Municipality" value={owner.municipality} />
                                                <DataField label="Ward" value={owner.wardNumber} />
                                                <DataField label="Father's" value={owner.fathersName} />
                                                <DataField label="Grandfather's" value={owner.grandFathersName} />
                                                <DataField label="Ownership %" value={owner.ownershipPercentage ? `${owner.ownershipPercentage}%` : null} />
                                              </div>
                                              <div className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <DocButton label="ID Front" key_value={owner.governmentIdFront} />
                                                <DocButton label="ID Back" key_value={owner.governmentIdBack} />
                                                <DocButton label="Owner Selfie" key_value={owner.ownerPhotoSelfie} />
                                              </div>
                                            </section>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {activeTab === 'Financial' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        <DataField label="Avg Monthly Sales" value={selectedMerchant?.businessProfile?.financialProfile?.averageMonthlySales ? `NPR ${selectedMerchant.businessProfile.financialProfile.averageMonthlySales}` : 'N/A'} />
                                        <DataField label="Accepts Payments" value={selectedMerchant?.businessProfile?.financialProfile?.paymentAcceptanceTypes?.join(', ')} />
                                        <DataField label="Bank Name" value={selectedMerchant?.businessProfile?.financialProfile?.bankName} />
                                        <DataField label="Account Number" value={selectedMerchant?.businessProfile?.financialProfile?.bankAccountNumber} className="md:col-span-2" />
                                      </section>
                                      <section className="pt-8 border-t border-slate-100">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Financial Documents</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                          <DocButton label="Bank Statement" field="financialProfile.bankStatementFile" />
                                          <DocButton label="Sales Records" field="financialProfile.salesRecordsFile" />
                                        </div>
                                      </section>
                                    </div>
                                  )}

                                  {activeTab === 'Operational' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                      <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5 px-1">Weekly Operating Hours</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
                                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
                                            <div key={day} className="flex flex-col gap-1.5 border-l-2 border-slate-200 pl-4 py-1">
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{day}</span>
                                              <span className="text-xs font-semibold text-slate-700">
                                                {selectedMerchant?.businessProfile?.operational?.dailyOperatingHours?.[idx] || 'N/A'}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        <DataField label="Staff Size" value={selectedMerchant?.businessProfile?.operational?.numberOfStaff} />
                                        <DataField label="Peak Days" value={selectedMerchant?.businessProfile?.operational?.peakBusinessDays?.join(', ')} />
                                        <DataField label="Supplier Dependency" value={selectedMerchant?.businessProfile?.operational?.supplierDependencyLevel} />
                                        <DataField label="Credit Obligations" value={selectedMerchant?.businessProfile?.operational?.existingCreditObligations ? 'Has Current Credit' : 'No Current Credit'} />
                                      </section>
                                    </div>
                                  )}

                                  {activeTab === 'Payment Options' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        <DataField label="Payout Frequency" value={selectedMerchant?.businessProfile?.paymentOptions?.paymentFrequency} />
                                        {selectedMerchant?.businessProfile?.paymentOptions?.paymentFrequency === 'Weekly' && (
                                          <DataField label="Selected Weekday" value={selectedMerchant?.businessProfile?.paymentOptions?.selectedWeekday} />
                                        )}
                                      </section>
                                    </div>
                                  )}

                                  {activeTab === 'Consent' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                          { label: 'Wallet Terms Accepted', val: selectedMerchant?.businessProfile?.contractWalletConsent?.walletTermsAccepted },
                                          { label: 'Platform Terms Accepted', val: selectedMerchant?.businessProfile?.contractWalletConsent?.platformTermsAccepted },
                                          { label: 'Data Usage Consent', val: selectedMerchant?.businessProfile?.contractWalletConsent?.dataUsageConsent },
                                          { label: 'Auto-Debit Consent', val: selectedMerchant?.businessProfile?.contractWalletConsent?.autoDebitConsent },
                                          { label: 'Collections Consent', val: selectedMerchant?.businessProfile?.contractWalletConsent?.collectionsConsent },
                                          { label: 'Marketing Consent', val: selectedMerchant?.businessProfile?.contractWalletConsent?.marketingConsent },
                                        ].map((item, idx) => (
                                          <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                            <span className="text-xs font-bold text-slate-700">{item.label}</span>
                                            {item.val ? (
                                              <div className="flex items-center gap-1.5 text-green-600">
                                                <Icon name="check" size={16} />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Yes</span>
                                              </div>
                                            ) : (
                                              <div className="flex items-center gap-1.5 text-red-600">
                                                <Icon name="close" size={16} />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">No</span>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                                  {selectedMerchant?.kycStatus === 'done' || selectedMerchant?.kycStatus === 'verified' ? (
                                    <div className="flex-1 py-4 bg-slate-100 text-slate-500 font-semibold rounded-2xl flex items-center justify-center gap-2">
                                      <Icon name="check-circle" size={20} className="w-5 h-5 text-green-500" />
                                      Merchant Already Verified
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => handleUpdateStatus(selectedMerchant.id, 'done')}
                                        className="flex-1 py-4 bg-green-600 text-white font-semibold rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 active:scale-[0.98] flex items-center justify-center gap-2"
                                      >
                                        <Icon name="check" size={20} className="w-5 h-5" />
                                        Approve Merchant
                                      </button>
                                      <button
                                        onClick={() => handleUpdateStatus(selectedMerchant.id, 'rejected')}
                                        className="flex-1 py-4 bg-red-50 text-red-600 font-semibold rounded-2xl hover:bg-red-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                      >
                                        <Icon name="close" size={20} className="w-5 h-5" />
                                        Reject Merchant
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </Dialog.Content>
                          </Dialog.Portal>
                        </Dialog.Root>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
      </div>
    </AdminLayout>
  );

  function DocButton({ label, field, key_value }: { label: string, field?: string, key_value?: string }) {
    const getFileUrlMutation = useGetFileUrlMutation();
    let key = key_value;

    if (field) {
      const keys = field.split('.');
      let currentVal = selectedMerchant?.businessProfile;
      for (const k of keys) {
        currentVal = currentVal?.[k];
      }
      key = currentVal;
    }

    if (!key) return <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 opacity-50"><p className="text-xs text-slate-400">{label}</p><p className="text-xs italic">Not uploaded</p></div>;

    const handleView = async () => {
      try {
        const { url } = await getFileUrlMutation.mutateAsync(key!);
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        toast.error('Failed to generate document link');
      }
    };

    return (
      <button
        type="button"
        onClick={handleView}
        disabled={getFileUrlMutation.isPending}
        className="text-left block w-full p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all group disabled:opacity-50"
      >
        <p className="text-xs text-slate-500 group-hover:text-red-600 font-mediumm">{label}</p>
        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
          {getFileUrlMutation.isPending ? (
            <span className="animate-spin text-[10px]">
              <Icon name="loader" size={10} />
            </span>
          ) : (
            <Icon name="search" size={14} className="w-3.5 h-3.5" />
          )}
          {getFileUrlMutation.isPending ? 'Generating Link...' : 'View Document'}
        </p>
      </button>
    );
  }
}
