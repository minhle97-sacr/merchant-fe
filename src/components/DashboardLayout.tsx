import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStore } from '@/store/useUserStore';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Icon } from '@/components/Icon';
import { Input } from './Input';
import { toast } from 'sonner';
import { useGetSSOTokenMutation, useGetOutletsQuery, useAddOutletMutation } from '@/services/api';
import OutletModal from '@/components/OutletModal';

import Logo from '@/components/Logo';
import { IconIn, IconInstagram, IconMail, IconPhone, IconPin, IconYoutube } from '../../public/icons';
import Image from 'next/image';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { logout } = useAuth();
    const { profile, selectedOutlet, setSelectedOutlet } = useUserStore();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
    const [isOutletModalOpen, setIsOutletModalOpen] = useState(false);
    const [outletName, setOutletName] = useState('');
    const [outletAddress, setOutletAddress] = useState('');

    const getSSOToken = useGetSSOTokenMutation();
    const { data: outlets = [] } = useGetOutletsQuery();
    const addOutletMutation = useAddOutletMutation();

    // Auto-select first outlet if none selected and outlets exist
    React.useEffect(() => {
        if (!selectedOutlet && outlets.length > 0) {   
            setSelectedOutlet(outlets[0]);
        }
    }, [outlets, selectedOutlet, setSelectedOutlet]);

    const handleOpenMarket = async () => {
        try {
            const loadingToast = toast.loading('Connecting to Market...');
            const result = await getSSOToken.mutateAsync(null);
            const ssoToken = result.ecommerce_token

            if (ssoToken) {
                toast.dismiss(loadingToast);
                // Open in new tab
                console.log(`${process.env.EXPO_PUBLIC_MARKET_URL}/sso?jwt=${ssoToken}`);
                
                window.open(`${process.env.EXPO_PUBLIC_MARKET_URL}/sso?jwt=${ssoToken}`, '_blank');
            } else {
                toast.error('Failed to get SSO token', { id: loadingToast });
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to connect to Market');
        }
    };

    const handleLogout = () => {
        logout();
        router.replace('/login');
    };

    const handleCreateOutlet = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!outletName.trim()) {
            toast.error('Please enter an outlet name');
            return;
        }

        try {
            await addOutletMutation.mutateAsync({ name: outletName, address: outletAddress });
            toast.success('Outlet created successfully');
            setOutletName('');
            setOutletAddress('');
            setIsOutletModalOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create outlet');
        }
    };
    
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800 relative overflow-x-hidden">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
                    md:relative md:translate-x-0
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}>
                    <div className="p-6 flex items-center justify-between gap-2">
                        <Logo width={100} height={28} />
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1 text-gray-400 hover:text-gray-600 md:hidden"
                        >
                            <Icon name="close" size={24} className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-8 space-y-1">
                        <SidebarItem
                            icon="dashboard"
                            label="Dashboard"
                            path="/dashboard"
                            hasDropdown
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <SidebarItem
                            icon="clock"
                            label="Redtab Pay Later"
                            path="/redtab-paylater"
                            hasDropdown
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <SidebarItem
                            icon="wallet"
                            label="Wallet"
                            path="/wallet"
                            hasDropdown
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <SidebarItem
                            icon="payments"
                            label="Payments"
                            path="/payments"
                            hasDropdown
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <SidebarItem
                            icon="cart"
                            label="Purchases"
                            path="/purchases"
                            hasDropdown
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <SidebarItem
                            icon="sales"
                            label="Sales"
                            path="/sales"
                            hasDropdown
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <SidebarItem
                            icon="catalog"
                            label="Catalog"
                            path="/catalog"
                            hasDropdown
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <SidebarItem
                            icon="users"
                            label="Team"
                            path="/team-management"
                            hasDropdown
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <SidebarItem
                            icon="shield-check"
                            label="My profile"
                            path="/business-profile"
                            hasDropdown
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <SidebarItem
                            icon="settings"
                            label="Settings"
                            path="/settings"
                            hasDropdown
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-red-600 w-full transition-colors text-sm font-mediumm">
                            <Icon size={20} name="logout" className="w-5 h-5 opacity-70" />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <header className="bg-white border-b border-gray-100 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30">
                        <div className="flex items-center gap-4 flex-1">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
                            >
                                <Icon name="menu" size={24} className="w-6 h-6" />
                            </button>

                            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 border border-gray-100 rounded-lg bg-gray-50/50 text-xs font-mediumm text-gray-600">
                                <Icon name="location" size={14} className="text-gray-400" />
                                <span className="max-w-[150px] truncate">{selectedOutlet?.name || 'No Outlet'}</span>
                            </div>

                            <div className="relative w-full max-w-[400px] ml-4">
                                <Input
                                    type="text"
                                    placeholder="Search products..."
                                    className="!py-1.5 !rounded-lg !bg-gray-50 focus:!bg-white !text-xs !px-4"
                                    endIcon={<Icon name="search" size={14} />}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-1">
                                <button onClick={handleOpenMarket} className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg relative cursor-pointer">
                                    <Icon name="cart" size={18} />
                                </button>
                                <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                                    <Icon name="bell" size={18} />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 pl-4 border-l border-gray-100 relative">
                                <div className="text-right hidden xl:block">
                                    <div className="font-semibold text-gray-900 text-sm">रू 500,000</div>
                                    <div className="text-[10px] text-green-600 font-mediumm">Credit Limit</div>
                                </div>
                                <button
                                    onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
                                    className={`flex items-center gap-2 p-0.5 rounded-full transition-all ${isProfilePopupOpen ? 'ring-2 ring-red-100' : ''}`}
                                >
                                    <div className="relative">
                                        <div
                                            className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-semibold text-sm border border-red-100"
                                        >
                                            {profile?.firstName?.charAt(0) || 'U'}{profile?.lastName?.charAt(0) || ''}
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <Icon name="chevron-down" size={14} className={`text-gray-400 transition-transform hidden sm:block ${isProfilePopupOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isProfilePopupOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsProfilePopupOpen(false)} />
                                        <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                            {/* User Info */}
                                            <div className="px-5 py-4 border-b border-gray-100">
                                                <h3 className="text-base font-semibold text-gray-900 leading-tight">
                                                    {profile?.firstName} {profile?.lastName || ''}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-0.5 capitalize">{profile?.role || 'Member'}</p>
                                            </div>

                                            {/* Switch Outlet */}
                                            <div className="py-2">
                                                {outlets.length > 0 ? (
                                                    <>
                                                        <div className="px-5 py-2 flex items-center justify-between">
                                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.05em]">Outlets</p>
                                                            <button 
                                                                onClick={() => {
                                                                    setIsOutletModalOpen(true);
                                                                    setIsProfilePopupOpen(false);
                                                                }}
                                                                className="text-[10px] font-semibold text-red-600 hover:text-red-700 uppercase tracking-[0.05em] flex items-center gap-1"
                                                            >
                                                                <Icon name="plus" size={10} />
                                                                <span>Add Outlet</span>
                                                            </button>
                                                        </div>
                                                        <div className="max-h-48 overflow-y-auto">
                                                            {outlets.map((outlet: any) => (
                                                                <button
                                                                    key={outlet.id}
                                                                    onClick={() => {
                                                                        setSelectedOutlet(outlet);
                                                                        setIsProfilePopupOpen(false);
                                                                    }}
                                                                    className={`w-full text-left px-5 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between group ${selectedOutlet?.id === outlet.id ? 'bg-gray-50/50' : ''}`}
                                                                >
                                                                    <div className="min-w-0 pr-4">
                                                                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-red-600 transition-colors">{outlet.name}</p>
                                                                        <p className="text-[10px] text-gray-500 truncate mt-0.5">{outlet.address || 'No address provided'}</p>
                                                                    </div>
                                                                    {selectedOutlet?.id === outlet.id && (
                                                                        <div className="shrink-0 text-green-500">
                                                                            <Icon name="check" size={16} />
                                                                        </div>
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="px-5 py-2">
                                                        <button 
                                                            onClick={() => {
                                                                setIsOutletModalOpen(true);
                                                                setIsProfilePopupOpen(false);
                                                            }}
                                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-100 rounded-xl text-gray-500 hover:text-red-600 hover:border-red-100 hover:bg-red-50/50 transition-all text-xs font-semibold"
                                                        >
                                                            <Icon name="plus" size={14} />
                                                            <span>Add Your First Outlet</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="py-1.5 border-t border-gray-100 bg-gray-50/30">
                                                <Link
                                                    href="/profile"
                                                    onClick={() => setIsProfilePopupOpen(false)}
                                                    className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                                                >
                                                    <Icon name="users" size={18} className="text-gray-400" />
                                                    <span>Manage Profile</span>
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <Icon name="logout" size={18} className="text-red-400" />
                                                    <span>Sign Out</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto p-6 relative ">
                        {children}

                        <OutletModal
                            isOpen={isOutletModalOpen}
                            onClose={() => setIsOutletModalOpen(false)}
                            title="Add New Outlet"
                            onSubmit={handleCreateOutlet}
                            name={outletName}
                            onNameChange={setOutletName}
                            address={outletAddress}
                            onAddressChange={setOutletAddress}
                            isPending={addOutletMutation.isPending}
                            submitLabel="Create Outlet"
                        />

                        {/* Footer */}
                        <footer className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-12 pb-8">
                            <div>
                                <h4 className="font-semibold text-lg mb-4">Company</h4>
                                <p className="text-xs text-gray-500 mb-1">Redtab Private Limited</p>
                                <p className="text-xs text-gray-400 mb-4">CIN: U74900DL2015PTC286208</p>
                                <div className="space-y-2 text-xs text-gray-500">
                                    <div className="flex gap-2 items-start">
                                        <Image src={IconPin} alt="Location" className='w-8 h-8' />
                                        <p>Ground Floor, 12A, 94 KTM,<br />Lalitpur, Patan Dhoka - 110001</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Image src={IconPhone} alt="Phone" className='w-8 h-8' />
                                        <p>+91-11-4117171</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Image src={IconMail} alt="Mail" className='w-8 h-8' />
                                        <p>help@redtab.com</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-lg mb-4">Know More</h4>
                                <div className="flex flex-col gap-2 text-sm text-gray-500">
                                    <a href="#" className="hover:text-red-600">About</a>
                                    <a href="#" className="hover:text-red-600">Privacy</a>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-lg mb-4">Connect with us</h4>
                                <p className="text-xs text-gray-500 mb-4">Follow us on social media</p>
                                <div className="flex gap-3">
                                    <Image src={IconIn} alt="LinkedIn" className='h-10 w-10' />
                                    <Image src={IconInstagram} alt="Instagram" className='h-10 w-10' />
                                    <Image src={IconYoutube} alt="YouTube" className='h-10 w-10' />
                                </div>
                            </div>
                        </footer>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}

// Components

function SidebarItem({ icon, label, path, hasDropdown, onClick }: { icon: string, label: string, path: string, hasDropdown?: boolean, onClick?: () => void }) {
    const pathname = usePathname();
    const isActive = pathname === path;

    return (
        <Link
            href={path as any}
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-mediumm transition-all ${isActive
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
        >
            <Icon size={18} name={icon} className={`w-[18px] h-[18px] ${isActive ? 'text-gray-900' : 'text-gray-400 opacity-70'}`} />
            <span className="flex-1 text-left">{label}</span>
            {hasDropdown && (
                <Icon name="chevron-down" size={12} className={`text-gray-300 transition-transform ${isActive ? 'rotate-0' : '-rotate-90'}`} />
            )}
        </Link>
    );
}