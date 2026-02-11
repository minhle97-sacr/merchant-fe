import React, { useState } from 'react';
import { Checkbox } from '../Checkbox';
import { Select } from '../Select';
import { Input } from '../Input';

interface OperationalTabProps {
    kycData: any;
    handleKYCInputChange: (field: string, value: any) => void;
    isProfileMode?: boolean;
    errors?: Record<string, string>;
}

export const OperationalTab = ({
    kycData,
    handleKYCInputChange,
    isProfileMode,
    errors = {}
}: OperationalTabProps) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Determine if we should start in "Same for all" mode by checking if all existing hours are identical
    const currentHours = kycData.operational.dailyOperatingHours || [];
    const areAllSame = currentHours.length > 0 && currentHours.every((h: string) => h === currentHours[0]);
    const [isSameForAll, setIsSameForAll] = useState(areAllSame || currentHours.length === 0);

    const handleHourChange = (index: number, value: string) => {
        const newHours = [...(kycData.operational.dailyOperatingHours || [])];
        newHours[index] = value;
        handleKYCInputChange('operational.dailyOperatingHours', newHours);
    };

    const handleAllHoursChange = (value: string) => {
        handleKYCInputChange('operational.dailyOperatingHours', new Array(7).fill(value));
    };

    return (
        <>
            <h1 className="text-4xl font-semibold mb-6">Operational</h1>
            <p className="text-gray-600 mb-10">How your business operates daily.</p>
            <div className="space-y-6">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold">Operating Hours</h3>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsSameForAll(true)}
                                className={`text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full transition ${isSameForAll ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}
                            >
                                Same for all days
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsSameForAll(false)}
                                className={`text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full transition ${!isSameForAll ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}
                            >
                                Set for Individually days
                            </button>
                        </div>
                    </div>

                    {isSameForAll ? (
                        <div className="flex-1 animate-in fade-in duration-200">
                            <Input
                                type="text"
                                label="Daily Hours (applied to all days)"
                                placeholder="09:00 - 18:00"
                                value={kycData.operational.dailyOperatingHours?.[0] || ''}
                                onChange={(e) => handleAllHoursChange(e.target.value)}
                                className="w-full"
                                error={errors['operational.dailyOperatingHours']}
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                            {days.map((day, index) => (
                                <div key={day} className="flex-1">
                                    <Input
                                        type="text"
                                        label={day}
                                        placeholder="09:00 - 18:00"
                                        value={kycData.operational.dailyOperatingHours?.[index] || ''}
                                        onChange={(e) => handleHourChange(index, e.target.value)}
                                        className="flex-1"
                                        error={index === 0 ? errors['operational.dailyOperatingHours'] : undefined}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <Input
                    label="Number of Staff *"
                    type="number"
                    value={kycData.operational.numberOfStaff}
                    onChange={(e) => handleKYCInputChange('operational.numberOfStaff', parseInt(e.target.value))}
                    error={errors['operational.numberOfStaff']}
                />
                <Select
                    label="Number of Suppliers *"
                    value={kycData.operational.supplierDependencyLevel}
                    onValueChange={(value) => handleKYCInputChange('operational.supplierDependencyLevel', value)}
                    options={[
                        'Single',
                        'Few (2-5)',
                        'Many (>5)'
                    ]}
                    error={errors['operational.supplierDependencyLevel']}
                />
                <div className="p-4 bg-gray-50 rounded-lg">
                    <Checkbox
                        id="existingCreditObligations"
                        checked={kycData.operational.existingCreditObligations}
                        onCheckedChange={(checked) => handleKYCInputChange('operational.existingCreditObligations', checked === true)}
                        label="Existing business loans or credit obligations?"
                    />
                </div>
            </div>
        </>
    );
};
