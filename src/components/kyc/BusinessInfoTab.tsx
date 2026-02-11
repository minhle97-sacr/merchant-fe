import React, { useState, useEffect, useRef } from 'react';
import { DocPreview } from './DocPreview';
import { Select } from '../Select';
import { Input } from '../Input';
import { DatePicker } from '../DatePicker';
import { Icon } from '@/components/Icon';
import { ALLOWED_GOOGLE_BUSINESS_TYPES } from '@/utils/constants';
import { toast } from 'sonner';
import { useGetOutletsQuery } from '@/services/api';
import { adToBs, bsToAd } from '@/utils/dateConverter';

// Custom hook for debouncing values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface BusinessInfoTabProps {
  kycData: any;
  handleKYCInputChange: (field: string, value: any) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  uploadingField: string | null;
  isProfileMode?: boolean;
  errors?: Record<string, string>;
  forceSearchName?: string;
  isLoaded: boolean;
}

export const BusinessInfoTab = ({
  kycData,
  handleKYCInputChange,
  handleFileUpload,
  uploadingField,
  isProfileMode,
  errors = {},
  forceSearchName,
  isLoaded
}: BusinessInfoTabProps) => {
  const isRegistrationTypeSelected = !!kycData.businessInformation.businessRegistrationType;
  const [inputValue, setInputValue] = useState("");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [placeSuggestions, setPlaceSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: outlets } = useGetOutletsQuery();
  const showOutletInput = !outlets || outlets.length === 0;

  const debouncedSearchTerm = useDebounce(inputValue, 500);
  const sessionToken = useRef<any>(null);

  useEffect(() => {
    const initToken = async () => {
      if (isLoaded && window.google) {
        try {
          const { AutocompleteSessionToken } = await window.google.maps.importLibrary("places") as any;
          sessionToken.current = new AutocompleteSessionToken();
        } catch (e) {
          console.error("Error loading places library", e);
        }
      }
    };
    initToken();
  }, [isLoaded]);

  const fetchPlaceSuggestions = async (businessName: string) => {
    if (!isLoaded || !window.google) return;

    try {
      const { AutocompleteSessionToken, AutocompleteService } = await window.google.maps.importLibrary("places") as any;

      const service = new AutocompleteService();
      sessionToken.current = new AutocompleteSessionToken();

      service.getPlacePredictions({
        input: businessName,
        types: ['establishment'],
        componentRestrictions: { country: 'np' },
        sessionToken: sessionToken.current
      }, (predictions: any) => {
        if (predictions) {
          const filteredResults = predictions
            .filter((p: any) =>
              p.types?.some((t: string) => ALLOWED_GOOGLE_BUSINESS_TYPES.includes(t))
            )
            .map((p: any) => ({
              placeId: p.place_id,
              mainText: { text: p.structured_formatting.main_text },
              secondaryText: { text: p.structured_formatting.secondary_text },
              types: p.types
            }))
            .slice(0, 5);
          setPlaceSuggestions(filteredResults);
        }
      });
    } catch (error) {
      console.error('Error fetching place suggestions:', error);
    }
  };

  useEffect(() => {
    if (forceSearchName && isLoaded) {
      fetchPlaceSuggestions(forceSearchName);
    }
  }, [forceSearchName, isLoaded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (debouncedSearchTerm && debouncedSearchTerm.length >= 2 && showDropdown && isLoaded && window.google) {
        try {
          const { AutocompleteService } = await window.google.maps.importLibrary("places") as any;
          const service = new AutocompleteService();
          service.getPlacePredictions({
            input: debouncedSearchTerm,
            types: ['establishment'],
            componentRestrictions: { country: 'np' },
            sessionToken: sessionToken.current
          }, (predictions: any) => {
            if (predictions) {
              const filteredResults = predictions
                .filter((p: any) =>
                  p.types?.some((t: string) => ALLOWED_GOOGLE_BUSINESS_TYPES.includes(t))
                )
                .map((p: any) => ({
                  placeId: p.place_id,
                  mainText: { text: p.structured_formatting.main_text },
                  secondaryText: { text: p.structured_formatting.secondary_text },
                  types: p.types
                }));
              setPredictions(filteredResults);
            } else {
              setPredictions([]);
            }
          });
        } catch (error) {
          console.error('Error fetching predictions:', error);
          setPredictions([]);
        }
      } else {
        setPredictions([]);
      }
    };
    fetchPredictions();
  }, [debouncedSearchTerm, showDropdown, isLoaded]);

  const handleInputChange = (value: string) => {
    setInputValue(value);

    if (!value || value.length < 2) {
      setPredictions([]);
      setShowDropdown(false);
      return;
    }
    setShowDropdown(true);
  };

  const handlePredictionSelect = async (prediction: any) => {
    if (isLoaded && window.google) {
      try {
        const { Place, AutocompleteSessionToken } = await window.google.maps.importLibrary("places") as any;
        const place = new Place({ id: prediction.placeId });

        await place.fetchFields({
          fields: [
            'displayName',
            'formattedAddress',
            'addressComponents',
            'location',
            'nationalPhoneNumber',
            'regularOpeningHours'
          ]
        });

        if (place) {
          // Basic Info
          const displayName = place.displayName || '';
          handleKYCInputChange('businessInformation.businessName', displayName);
          handleKYCInputChange('businessInformation.tradeName', displayName);

          // Location Info
          if (place.formattedAddress) {
            handleKYCInputChange('locationPremises.physicalAddress', place.formattedAddress);
          }

          if (place.location) {
            handleKYCInputChange('locationPremises.gpsCoordinates_lat', place.location.lat());
            handleKYCInputChange('locationPremises.gpsCoordinates_lng', place.location.lng());
          }

          // Parse address components
          if (place.addressComponents) {
            const cityComp = place.addressComponents.find((c: any) => c.types.includes('locality'));
            if (cityComp) {
              handleKYCInputChange('locationPremises.city', cityComp.longText);
            }

            const sublocality = place.addressComponents.find((c: any) => c.types.includes('sublocality_level_1'));
            if (sublocality) {
              const wardMatch = sublocality.longText.match(/Ward\s+(\d+)/i) || sublocality.longText.match(/(\d+)/);
              if (wardMatch) {
                handleKYCInputChange('locationPremises.wardNumber', wardMatch[1]);
              }
            }
          }

          // Contact Info
          if (place.nationalPhoneNumber) {
            handleKYCInputChange('ownerPrimaryController.ownerPhoneNumber', place.nationalPhoneNumber.replace(/\s+/g, ''));
          }

          // Operational Info - Daily Operating Hours
          if (place.regularOpeningHours?.weekdayDescriptions) {
            const mappedHours = new Array(7).fill("Closed");
            const dayMap: { [key: string]: number } = {
              'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3,
              'Friday': 4, 'Saturday': 5, 'Sunday': 6
            };

            place.regularOpeningHours.weekdayDescriptions.forEach((text: string) => {
              const [dayName, hours] = text.split(': ');
              if (dayMap[dayName] !== undefined) {
                mappedHours[dayMap[dayName]] = hours;
              }
            });
            handleKYCInputChange('operational.dailyOperatingHours', mappedHours);
          }

          setPredictions([]);
          setPlaceSuggestions([]);
          setShowDropdown(false);
          toast.success('Business details auto-filled!');

          // Clear session token for next use
          sessionToken.current = new AutocompleteSessionToken();
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
        toast.error('Failed to fetch business details');
      }
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const dateStr = date.toISOString();
      handleKYCInputChange('businessInformation.dateOfRegistration', dateStr);

      // Sync with BS Date
      const bsDate = adToBs(date);
      if (bsDate) {
        handleKYCInputChange('businessInformation.dateOfRegistration_bs', bsDate);
      }

      const today = new Date();
      let totalMonths = (today.getFullYear() - date.getFullYear()) * 12 + (today.getMonth() - date.getMonth());
      if (today.getDate() < date.getDate()) {
        totalMonths--;
      }

      const years = Math.floor(totalMonths / 12);
      const months = totalMonths % 12;

      const parts = [];
      if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
      if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
      const yearsInOperation = parts.join(' ') || '0 months';

      handleKYCInputChange('businessInformation.yearsInOperation', yearsInOperation);
    } else {
      handleKYCInputChange('businessInformation.dateOfRegistration', '');
      handleKYCInputChange('businessInformation.dateOfRegistration_bs', '');
      handleKYCInputChange('businessInformation.yearsInOperation', '');
    }
  };

  const handleBsDateChange = (value: string) => {
    // Only allow numbers and hyphens
    const bsDateStr = value.replace(/[^0-9-]/g, '');
    handleKYCInputChange('businessInformation.dateOfRegistration_bs', bsDateStr);

    if (/^\d{4}-\d{2}-\d{2}$/.test(bsDateStr)) {
      const adDate = bsToAd(bsDateStr);
      if (adDate) {
        handleKYCInputChange('businessInformation.dateOfRegistration', adDate.toISOString());

        const today = new Date();
        let totalMonths = (today.getFullYear() - adDate.getFullYear()) * 12 + (today.getMonth() - adDate.getMonth());
        if (today.getDate() < adDate.getDate()) {
          totalMonths--;
        }

        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;

        const parts = [];
        if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
        if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
        const yearsInOperation = parts.join(' ') || '0 months';

        handleKYCInputChange('businessInformation.yearsInOperation', yearsInOperation);
      }
    }
  };

  return (
    <>
      <h1 className="text-4xl font-semibold mb-6">Business Information</h1>
      <p className="text-gray-600 mb-10">Basic details about your registered entity.</p>

      <div className="mb-0 relative" ref={dropdownRef}>
        <div className='mb-4'>
          <h3 className={`text-sm font-semibold mb-2 ${errors['businessInformation.registrationCertificateFile'] ? 'text-red-500' : ''}`}>Registration Certificate *</h3>
          <DocPreview
            field="businessInformation.registrationCertificateFile"
            kycData={kycData}
            handleFileUpload={handleFileUpload}
            uploadingField={uploadingField}
            error={errors['businessInformation.registrationCertificateFile']}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Select
            label="Registration Type *"
            value={kycData.businessInformation.businessRegistrationType}
            onValueChange={(value) => handleKYCInputChange('businessInformation.businessRegistrationType', value)}
            options={[
              'VAT Registration',
              'PAN Registration',
              'Company Act',
              'Partnership Act'
            ]}
            error={errors['businessInformation.businessRegistrationType']}
          />
          <Input
            label="Registration Number *"
            type="text"
            disabled={!isRegistrationTypeSelected}
            value={kycData.businessInformation.registrationNumber}
            onChange={(e) => handleKYCInputChange('businessInformation.registrationNumber', e.target.value)}
            error={errors['businessInformation.registrationNumber']}
          />
        </div>

        {placeSuggestions.length > 0 && (
          <div className="mb-3 p-4 bg-gray-50/50 rounded-[32px] border border-primary animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Found your business on Google?</h3>
                <p className="text-sm text-gray-500">Select a location to auto-fill details.</p>
              </div>
              <button
                onClick={() => setPlaceSuggestions([])}
                className="text-xs font-semibold text-gray-400 hover:text-gray-600 uppercase tracking-wider"
              >
                Dismiss
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pb-2">
              {placeSuggestions.map((p) => (
                <button
                  key={p.placeId}
                  onClick={() => handlePredictionSelect(p)}
                  className="w-full text-left bg-white border border-gray-100 rounded-[24px] p-3 hover:border-red-500 hover:shadow-md transition-all group flex flex-col"
                >
                  <div className='flex gap-2 items-center'>
                    <div className="min-w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-red-50 transition-colors">
                      <Icon name="location" size={20} className="text-gray-400 group-hover:text-red-600" />
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900 group-hover:text-red-700 mb-1 line-clamp-2 min-h-[40px]">
                      {p.mainText.text}
                    </h4>
                  </div>

                  <p className="text-[11px] text-gray-500 line-clamp-2 flex-1">
                    {p.secondaryText.text}
                  </p>
                  <div className="flex items-center justify-between pt-0 border-t border-gray-50">
                    <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider truncate mr-2">
                      {p.types?.find((t: string) => !['establishment', 'point_of_interest', 'store', 'premise'].includes(t))?.replace(/_/g, ' ') || 'Business'}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-red-600 transition-all">
                      <Icon name="chevron-right" size={12} className="text-gray-400 group-hover:text-white" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex items-start gap-4 mb-0">
              <div className="flex-1 border-none pb-1 relative">
                <Input
                  label="Enter your business name as registered on Google"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => predictions.length > 0 && setShowDropdown(true)}
                  placeholder="Start by typing business name"
                  className="w-full"
                />
                {showDropdown && predictions.length > 0 && (
                  <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-100 rounded-[24px] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="pt-4 pb-1 px-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Top Suggestions</span>
                    </div>
                    <div className="max-h-[380px] overflow-y-auto">
                      {predictions.map((p, i) => (
                        <button
                          key={p.placeId}
                          onClick={() => handlePredictionSelect(p)}
                          className="w-full flex items-center gap-4 px-6 py-3 hover:bg-primary/5 transition-all text-left group"
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                            <Icon name="location" size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[15px] font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                              {p.mainText.text}
                            </div>
                            <div className="text-[12px] text-gray-500 mt-0.5 truncate font-mediumm flex items-center gap-1.5">
                              <span className="truncate">{p.secondaryText.text}</span>
                              <span className="text-gray-300">-</span>
                              <span>{p.types?.find((t: string) => !['establishment', 'point_of_interest', 'store', 'premise'].includes(t))?.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Store'}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

      <div className='mb-4'>
        <Input
          label="Business Name *"
          value={kycData.businessInformation.businessName}
          onChange={(e) => handleKYCInputChange('businessInformation.businessName', e.target.value)}
          className="w-full"
          error={errors['businessInformation.businessName']}
        />
      </div>

      <div className='mb-4'>
        <Input
          label="Business Name (Nepali)"
          value={kycData.businessInformation.businessName_nepali}
          onChange={(e) => handleKYCInputChange('businessInformation.businessName_nepali', e.target.value)}
          className="w-full"
          placeholder=""
          error={errors['businessInformation.businessName_nepali']}
        />
      </div>


      <div className="space-y-6">
        <Input
          label="Trade Name (Optional)"
          type="text"
          value={kycData.businessInformation.tradeName}
          onChange={(e) => handleKYCInputChange('businessInformation.tradeName', e.target.value)}
        />

        {showOutletInput && (
          <Input
            label="Outlet Name *"
            type="text"
            value={kycData.businessInformation.outletName}
            onChange={(e) => handleKYCInputChange('businessInformation.outletName', e.target.value)}
            placeholder="e.g. Acme - Downtown Branch"
            error={errors['businessInformation.outletName']}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DatePicker
            label="Date of Registration (A.D.) *"
            date={kycData.businessInformation.dateOfRegistration ? new Date(kycData.businessInformation.dateOfRegistration) : undefined}
            onDateChange={handleDateChange}
            error={errors['businessInformation.dateOfRegistration']}
          />
          <Input
            disabled
            label="Date of Registration (B.S.)"
            placeholder="YYYY-MM-DD"
            value={kycData.businessInformation.dateOfRegistration_bs}
            onChange={(e) => handleBsDateChange(e.target.value)}
            error={errors['businessInformation.dateOfRegistration_bs']}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Years in Operation *"
            type="text"
            disabled={true}
            value={kycData.businessInformation.yearsInOperation}
            onChange={(e) => handleKYCInputChange('businessInformation.yearsInOperation', e.target.value)}
            error={errors['businessInformation.yearsInOperation']}
          />
          <Select
            label="Business Status *"
            value={kycData.businessInformation.businessStatus}
            onValueChange={(value) => handleKYCInputChange('businessInformation.businessStatus', value)}
            options={[
              'Active',
              'Seasonal',
              'Temporarily Closed'
            ]}
            error={errors['businessInformation.businessStatus']}
          />
        </div>
      </div>
    </>
  );
};
