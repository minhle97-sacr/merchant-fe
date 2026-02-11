'use client';


import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Icon } from '@/components/Icon';

export default function RedtabPaylaterScreen() {

    const transactions = [
        { id: 'TX-C001', date: '10/25/2023, 7:01:00 AM', activity: 'REPAYMENT', detail: 'Daily Credit Installment (Auto)', impact: '- रू 250.00', status: 'COMPLETED' },
        { id: 'TX-C002', date: '10/25/2023, 7:01:00 AM', activity: 'USAGE', detail: 'Order #ORD-8821 Usage', impact: '- रू 250.00', status: 'COMPLETED' },
        { id: 'TX-C003', date: '10/25/2023, 7:01:00 AM', activity: 'ADJUSTMENT', detail: 'Limit Increase (Tier Upgrade)', impact: '- रू 250.00', status: 'COMPLETED' },
        { id: 'TX-C003', date: '10/25/2023, 7:01:00 AM', activity: 'ADJUSTMENT', detail: 'Limit Increase (Tier Upgrade)', impact: '- रू 250.00', status: 'COMPLETED' },
        { id: 'TX-C003', date: '10/25/2023, 7:01:00 AM', activity: 'ADJUSTMENT', detail: 'Limit Increase (Tier Upgrade)', impact: '- रू 250.00', status: 'COMPLETED' },
    ];

    return (
        <DashboardLayout>
            <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                    <Icon name="clock" size={20} className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">Redtab Paylater</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Facility Limit */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 mb-4 font-mediumm">Facility Limit</p>
                    <div className="mb-2">
                        <span className="text-2xl font-semibold text-gray-900">रू 50,000</span>
                    </div>
                    <p className="text-xs text-red-500 font-mediumm">Active Merchant Credit Line</p>
                </div>

                {/* Daily Dues */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 mb-4 font-mediumm">Daily Dues</p>
                    <div className="mb-2">
                        <span className="text-2xl font-semibold text-gray-900">रू 250.00</span>
                    </div>
                    <p className="text-xs text-blue-500 font-mediumm">Automatic Settlement</p>
                </div>

                {/* Merchant Score */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 mb-4 font-mediumm">Merchant Score</p>
                    <div className="mb-2">
                        <span className="text-2xl font-semibold text-gray-900">85/100</span>
                    </div>
                    <p className="text-xs text-green-500 font-mediumm">Automatic Settlement</p>
                </div>
            </div>

            {/* History Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Repayment & Usage History</h2>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-mediumm text-gray-600 hover:bg-gray-200">
                            <span>Filter</span>
                            <Icon name="filter" size={16} className="w-4 h-4" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-mediumm text-gray-600 hover:bg-gray-200">
                            <span>Export</span>
                            <Icon name="download" size={16} className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-mediumm">
                            <tr>
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">Activity</th>
                                <th className="px-6 py-4 text-right">Credit Impact</th>
                                <th className="px-6 py-4 text-right">Transaction ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((tx, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-600">{tx.id}</td>
                                    <td className="px-6 py-4 text-gray-600">{tx.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-xs text-gray-500 uppercase">{tx.activity}</div>
                                        <div className="text-gray-500 text-xs">{tx.detail}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mediumm text-green-600">{tx.impact}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mediumm bg-green-100 text-green-800 border border-green-200">
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
