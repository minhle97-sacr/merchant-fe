import React, { useState } from 'react';
import { Checkbox } from '../Checkbox';
import { Select } from '../Select';

interface PaymentOptionsTabProps {
    kycData: any;
    handleKYCInputChange: (field: string, value: any) => void;
    isProfileMode?: boolean;
    errors?: Record<string, string>;
}

export const PaymentOptionsTab = ({
    kycData,
    handleKYCInputChange,
    isProfileMode,
    errors = {}
}: PaymentOptionsTabProps) => {
    const [confirmed, setConfirmed] = useState(false);

    if (isProfileMode) {
        return (
            <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <div className="w-1 h-5 bg-red-600 rounded-full" />
                    Payment Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                        label="Payment Frequency *"
                        labelClassName="text-xs font-semibold text-gray-400 uppercase tracking-wider"
                        value={kycData.paymentOptions.paymentFrequency}
                        onValueChange={(value) => handleKYCInputChange('paymentOptions.paymentFrequency', value)}
                        options={['Daily', 'Weekly']}
                    />
                    {kycData.paymentOptions.paymentFrequency === 'Weekly' && (
                        <Select
                            label="Preferred Weekday *"
                            labelClassName="text-xs font-semibold text-gray-400 uppercase tracking-wider"
                            value={kycData.paymentOptions.selectedWeekday}
                            onValueChange={(value) => handleKYCInputChange('paymentOptions.selectedWeekday', value)}
                            options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
                        />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                {/* Left Side: Information Panel */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 sticky top-24">
                        <div className="space-y-10">
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-xs font-semibold">1</div>
                                    <h3 className="font-semibold text-gray-900 text-3xl">What is Redtab PayLater?</h3>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Redtab PayLater is a payment solution designed to help your business manage cash flow while you access inventory and supplies immediately. Instead of paying upfront for your purchases, you can pay <span className="font-semibold text-gray-900">daily or weekly</span> based on your preference.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-xs font-semibold">2</div>
                                    <h3 className="font-semibold text-gray-900 text-3xl">How Payment Works</h3>
                                </div>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex gap-2 text-gray-600">
                                        <span className="text-primary font-semibold">•</span>
                                        <span><span className="font-semibold text-gray-900">Daily Payment:</span> Amount owed must be paid <span className="font-semibold">by 11:59 PM</span> the next day.</span>
                                    </li>
                                    <li className="flex gap-2 text-gray-600">
                                        <span className="text-primary font-semibold">•</span>
                                        <span><span className="font-semibold text-gray-900">Weekly Payment:</span> Amount owed must be paid on your <span className="font-semibold">selected weekday</span>.</span>
                                    </li>
                                </ul>
                                <div className="mt-4 p-4 bg-gray-50 rounded-xl border-l-4 border-primary/20">
                                    <p className="text-[11px] text-gray-500 italic leading-relaxed">
                                        <span className="font-semibold uppercase text-gray-900 not-italic block mb-1">Note:</span>
                                        Payments are automatically tracked. Missing a payment may lead to penalties or temporary suspension of your PayLater account.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-xs font-semibold">3</div>
                                    <h3 className="font-semibold text-gray-900 text-3xl">Benefits</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        'Access stock immediately without upfront cash',
                                        'Flexible repayment according to your business rhythm',
                                        'Transparent penalties and clear payment schedule',
                                        'Builds a track record for higher credit in the future'
                                    ].map((benefit, i) => (
                                        <div key={i} className="flex gap-3 text-sm text-gray-600 items-start">
                                            <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                            </div>
                                            {benefit}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-xs font-semibold">4</div>
                                    <h3 className="font-semibold text-gray-900 text-3xl">Important Rules</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="text-sm text-gray-600 leading-relaxed">
                                        Your selected frequency will be <span className="font-semibold text-gray-900">locked after activation</span>.
                                    </li>
                                    <li className="text-sm text-gray-600 leading-relaxed">
                                        Payments directly impact your <span className="font-semibold text-gray-900">credit limit and future eligibility</span>.
                                    </li>
                                    <li className="text-sm text-gray-600 leading-relaxed">
                                        Penalties apply after a <span className="font-semibold text-gray-900">2-day grace period</span> (1% weekly).
                                    </li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>


                {/* Right Side: Input Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="min-w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-xs font-semibold">5</div>
                                <h3 className={`font-semibold text-2xl ${errors['paymentOptions.paymentFrequency'] ? 'text-red-500' : 'text-gray-900'}`}>How do you want to Pay?</h3>
                            </div>
                            <p className="text-xs text-gray-500 mb-4">Please choose one option:</p>

                            <div className="gap-4 flex flex-col">
                                <button
                                    onClick={() => handleKYCInputChange('paymentOptions.paymentFrequency', 'Daily')}
                                    className={`flex items-start gap-4 p-5 border-2 rounded-2xl text-left transition-all ${kycData.paymentOptions.paymentFrequency === 'Daily'
                                        ? 'border-primary bg-red-50 ring-4 ring-red-50'
                                        : errors['paymentOptions.paymentFrequency'] ? 'border-red-200 bg-white hover:border-red-300' : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
                                        }`}
                                >
                                    <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${kycData.paymentOptions.paymentFrequency === 'Daily'
                                        ? 'border-primary'
                                        : errors['paymentOptions.paymentFrequency'] ? 'border-red-300' : 'border-gray-300'
                                        }`}>
                                        {kycData.paymentOptions.paymentFrequency === 'Daily' && (
                                            <div className="w-3 h-3 bg-primary rounded-full" />
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-900 block text-lg">Daily Payment</span>
                                        <span className="text-sm text-gray-600">I will pay every day by 11:59 PM next day.</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleKYCInputChange('paymentOptions.paymentFrequency', 'Weekly')}
                                    className={`flex items-start gap-4 p-5 border-2 rounded-2xl text-left transition-all ${kycData.paymentOptions.paymentFrequency === 'Weekly'
                                        ? 'border-primary bg-red-50 ring-4 ring-red-50'
                                        : errors['paymentOptions.paymentFrequency'] ? 'border-red-200 bg-white hover:border-red-300' : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
                                        }`}
                                >
                                    <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${kycData.paymentOptions.paymentFrequency === 'Weekly'
                                        ? 'border-primary'
                                        : errors['paymentOptions.paymentFrequency'] ? 'border-red-300' : 'border-gray-300'
                                        }`}>
                                        {kycData.paymentOptions.paymentFrequency === 'Weekly' && (
                                            <div className="w-3 h-3 bg-primary rounded-full" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <span className="font-semibold text-gray-900 block text-lg">Weekly Payment</span>
                                        <span className="text-sm text-gray-600 block mb-4">I will pay once per week on my chosen day:</span>

                                        {kycData.paymentOptions.paymentFrequency === 'Weekly' && (
                                            <div className="bg-white border border-gray-200 rounded-xl p-4" onClick={(e) => e.stopPropagation()}>
                                                <Select
                                                    label="Day of Week"
                                                    labelClassName="text-[10px] font-semibold uppercase text-gray-400 mb-2 block tracking-widest"
                                                    value={kycData.paymentOptions.selectedWeekday}
                                                    onValueChange={(value) => handleKYCInputChange('paymentOptions.selectedWeekday', value)}
                                                    options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
                                                    className="w-full border-none rounded-lg focus:ring-2 focus:ring-primary text-gray-900 font-semibold text-sm outline-none"
                                                    error={errors['paymentOptions.selectedWeekday']}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </div>
                            {errors['paymentOptions.paymentFrequency'] && <p className="text-xs text-red-500 mt-2 font-mediumm">{errors['paymentOptions.paymentFrequency']}</p>}
                            <p className="text-[11px] text-gray-400 italic mt-4 px-2">
                                This selection is <span className="font-semibold">indicative only</span> at this stage and will be finalized at <span className="font-semibold">contract acceptance</span>.
                            </p>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-xs font-semibold">6</div>
                                <h3 className="font-semibold text-gray-900 text-2xl">Confirm Understanding</h3>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                                    By selecting a preferred payment frequency, you confirm that you have <span className="font-semibold">read and understood</span> how Redtab PayLater works. You will be required to reconfirm this selection when signing your official contract.
                                </p>
                                <Checkbox
                                    id="confirmation"
                                    checked={confirmed}
                                    onCheckedChange={(checked) => setConfirmed(checked === true)}
                                    label="I understand the rules and penalties of Redtab PayLater and have made my preferred selection."
                                    className="items-start"
                                    checkboxClassName="mt-0.5"
                                    labelClassName="text-sm font-semibold text-gray-700 cursor-pointer flex-1"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
