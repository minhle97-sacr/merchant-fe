'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Icon } from '@/components/Icon';

export default function WalletScreen() {

    const transactions = [
        { id: 1, type: 'deposit', amount: '+ रू 5,000.00', date: 'Oct 26, 2023', status: 'Completed', source: 'Bank Transfer •••• 4242' },
        { id: 2, type: 'withdrawal', amount: '- रू 1,200.00', date: 'Oct 25, 2023', status: 'Completed', source: 'Withdraw to Bank •••• 8888' },
        { id: 3, type: 'payment', amount: '- रू 450.00', date: 'Oct 24, 2023', status: 'Completed', source: 'Redtab Pay Later Settlement' },
        { id: 4, type: 'deposit', amount: '+ रू 10,000.00', date: 'Oct 20, 2023', status: 'Completed', source: 'UPI Transfer' },
    ];

    return (
        <DashboardLayout>
            <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                    <Icon name="wallet" size={20} className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">My Wallet</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Balance & Actions */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Balance Card */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                        <div className="relative z-10">
                            <p className="text-gray-400 text-sm mb-2">Total Balance</p>
                            <h2 className="text-4xl font-semibold mb-8">रू 14,250.00</h2>

                            <div className="flex gap-4">
                                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-mediumm flex items-center gap-2 transition-colors">
                                    <Icon name="plus" size={16} className="w-4 h-4" />
                                    Add Money
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg font-mediumm flex items-center gap-2 transition-colors backdrop-blur-sm">
                                    <Icon name="arrow-up-right" size={16} className="w-4 h-4" />
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
                            <button className="text-sm text-red-600 font-mediumm hover:text-red-700">View All</button>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            <Icon name={tx.type === 'deposit' ? 'arrow-down-left' : 'arrow-up-right'} size={20} className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-mediumm text-gray-900">{tx.source}</p>
                                            <p className="text-xs text-gray-500">{tx.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${tx.type === 'deposit' ? 'text-green-600' : 'text-gray-900'
                                            }`}>{tx.amount}</p>
                                        <p className="text-xs text-green-600">{tx.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Payment Methods & Quick Stats */}
                <div className="space-y-8">
                    {/* Payment Methods */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-gray-900">Saved Cards</h3>
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Icon name="plus" size={16} className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Card 1 */}
                            <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-red-200 transition-colors cursor-pointer group">
                                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[8px] font-semibold">VISA</div>
                                <div className="flex-1">
                                    <p className="text-sm font-mediumm text-gray-900">•••• 4242</p>
                                    <p className="text-xs text-gray-500">Expires 12/24</p>
                                </div>
                                <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-red-500 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-red-500 opacity-0 group-hover:opacity-100"></div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-red-200 transition-colors cursor-pointer group">
                                <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center text-white text-[8px] font-semibold">MC</div>
                                <div className="flex-1">
                                    <p className="text-sm font-mediumm text-gray-900">•••• 8888</p>
                                    <p className="text-xs text-gray-500">Expires 09/25</p>
                                </div>
                                <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-red-500 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-red-500 opacity-0 group-hover:opacity-100"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats or Promo */}
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                            <Icon name="badge-percent" className="w-5 h-5" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Get 5% Cashback</h4>
                        <p className="text-sm text-gray-600 mb-4">Top up your wallet with रू 2000 or more and get instant 5% cashback.</p>
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View Offer Details →</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

