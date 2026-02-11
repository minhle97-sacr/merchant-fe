'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Icon } from '@/components/Icon';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from '@/components/Input';

export default function PaymentsScreen() {
    const [activeTab, setActiveTab] = useState('electric');
    const [step, setStep] = useState<'form' | 'confirm'>('form');
    const [showSuccess, setShowSuccess] = useState(false);

    const transactions = [
        { id: 1, type: 'Electric bill', account: '8821001', date: '10/25/2023, 7:01:00 AM', amount: '- रू 250.00', status: 'Completed' },
        { id: 2, type: 'Water bill', account: 'INET_JD_99', date: '10/25/2023, 7:01:00 AM', amount: '- रू 250.00', status: 'Completed' },
        { id: 3, type: 'Electric bill', account: '10/25/2023, 7:01:00 AM', date: '10/25/2023, 7:01:00 AM', amount: '- रू 250.00', status: 'Pending' },
        { id: 4, type: 'Electric bill', account: 'WAT_882', date: '10/25/2023, 7:01:00 AM', amount: '- रू 250.00', status: 'Completed' },
    ];

    const tabs = [
        { id: 'electric', label: 'Electric bill', icon: 'electric', color: 'bg-orange-50 text-orange-500' },
        { id: 'water', label: 'Water bill', icon: 'water', color: 'bg-blue-50 text-blue-500' },
        { id: 'internet', label: 'Internet', icon: 'internet', color: 'bg-green-50 text-green-500' },
    ];

    return (
        <DashboardLayout>
            <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600">
                    <Icon name="payment" size={20} className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-semiboldd text-gray-900">Utility Payments</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Left Tabs */}
                    <div className="w-full md:w-48 space-y-6 flex flex-row md:flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${activeTab === tab.id
                                        ? 'bg-white shadow-md ring-1 ring-gray-100 transform scale-105'
                                        : 'hover:bg-gray-50 text-gray-500'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tab.color}`}>
                                    <Icon name={tab.icon} size={24} className="w-6 h-6" />
                                </div>
                                <span className={`text-sm font-mediumm ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Right Form */}
                    <div className="flex-1 max-w-2xl">
                        {step === 'form' ? (
                            <div className="mb-8">
                                <h2 className="text-xl font-semiboldd text-gray-900 mb-6">
                                    {tabs.find(t => t.id === activeTab)?.label}
                                </h2>

                                <div className="space-y-6">
                                    <Input
                                        label={
                                            activeTab === 'electric' ? 'Electricity Account Number' :
                                                activeTab === 'water' ? 'Water Connection ID' :
                                                    'Customer ID / Username'
                                        }
                                        type="text"
                                        placeholder="eg. 234234228"
                                    />

                                    <Input
                                        label="Amount to Pay (रू)"
                                        type="text"
                                        placeholder="0.00"
                                    />

                                    <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                                        <span className="text-sm font-mediumm text-gray-600">Convenience fee</span>
                                        <span className="text-sm font-semiboldd text-green-600">Free</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-lg font-semiboldd text-gray-900">Total</span>
                                        <span className="text-xl font-semiboldd text-gray-900">रू 2,575.00</span>
                                    </div>

                                    <button
                                        onClick={() => setStep('confirm')}
                                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semiboldd py-4 rounded-xl transition-colors mt-4"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <button
                                        onClick={() => setStep('form')}
                                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                    >
                                        <Icon name="arrow-left" size={20} className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <h2 className="text-xl font-semiboldd text-gray-900 mx-auto pr-14">Confirm payment</h2>
                                </div>

                                <div className="text-center mb-8">
                                    <p className="text-3xl font-semiboldd leading-tight text-gray-900">
                                        You are paying <span className="text-red-600">रू 2,575.00</span>
                                        <br />
                                        for your {tabs.find(t => t.id === activeTab)?.label}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 space-y-4 mb-8">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Provider</span>
                                        <span className="font-mediumm text-gray-900">Redtab Utils</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Account</span>
                                        <span className="font-mediumm text-gray-900">3424234</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Deduction</span>
                                        <span className="font-mediumm text-gray-900">Merchant Wallet</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowSuccess(true)}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semiboldd py-4 rounded-xl transition-colors shadow-lg shadow-red-200"
                                >
                                    Confirm and Pay
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semiboldd text-gray-900">Recent Utility Bill History</h3>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-mediumm hover:bg-gray-50 text-gray-700">
                        Statement
                        <Icon name="download" size={16} className="w-4 h-4" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left">
                            <tr className="text-xs font-semiboldd text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Utility Type</th>
                                <th className="px-6 py-4">Account No.</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type.includes('Electric') ? 'bg-orange-50 text-orange-500' :
                                                    tx.type.includes('Water') ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'
                                                }`}>
                                                <Icon name={
                                                    tx.type.includes('Electric') ? 'electric' :
                                                        tx.type.includes('Water') ? 'water' : 'internet'
                                                } size={16} className="w-4 h-4" />
                                            </div>
                                            <span className="font-mediumm text-gray-900">{tx.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{tx.account}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{tx.date}</td>
                                    <td className="px-6 py-4 text-sm font-mediumm text-gray-900">{tx.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mediumm border ${tx.status === 'Completed'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-orange-50 text-orange-700 border-orange-200'
                                            }`}>
                                            {tx.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Success Modal */}
            <Dialog.Root
                open={showSuccess}
                onOpenChange={(open) => {
                    if (!open) {
                        setShowSuccess(false);
                        setStep('form');
                    }
                }}
            >
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 max-w-md w-full z-50 animate-in fade-in zoom-in duration-200 focus:outline-none">
                        <Dialog.Close className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <Icon name="close" size={20} className="w-5 h-5 text-gray-400" />
                        </Dialog.Close>

                        <div className="text-center">
                            <Dialog.Title className="text-lg font-mediumm text-gray-900 mb-8">Payment Result</Dialog.Title>

                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
                                <Icon name="check" size={48} className="w-12 h-12 text-white" />
                            </div>

                            <h2 className="text-3xl font-semiboldd text-gray-900 mb-4">Payment Success</h2>

                            <Dialog.Description className="text-gray-600 mb-8 leading-relaxed">
                                Your {tabs.find(t => t.id === activeTab)?.label ?? 'Electricity bill'} has been settled. Transaction ID: RTU-57550
                            </Dialog.Description>

                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setShowSuccess(false);
                                        setStep('form');
                                    }}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semiboldd py-4 rounded-full transition-colors shadow-lg shadow-red-200"
                                >
                                    Make another Payment
                                </button>
                                <button
                                    onClick={() => {
                                        setShowSuccess(false);
                                        setStep('form');
                                    }}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semiboldd py-4 rounded-full transition-colors"
                                >
                                    View in Ledger
                                </button>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </DashboardLayout>
    );
}

