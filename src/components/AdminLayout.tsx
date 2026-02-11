import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStore } from '@/store/useUserStore';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Icon } from '@/components/Icon';
import Logo from '@/components/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const { profile } = useUserStore();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/login');
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
            <div className="flex items-center gap-2">
              <Logo width={100} height={28} />
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">Admin</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 md:hidden"
            >
              <Icon name="close" size={24} className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-1">
            <SidebarItem
              icon="shield-check"
              label="Merchant KYC"
              path="/admin/dashboard"
              onClick={() => setIsSidebarOpen(false)}
            />
            <SidebarItem
              icon="catalog"
              label="Catalog Management"
              path="/admin/catalog"
              onClick={() => setIsSidebarOpen(false)}
            />
            <SidebarItem
              icon="users"
              label="User Management"
              path="/admin/users"
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
              <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">Admin Management</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Super Admin
              </div>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <div
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-semibold border border-gray-200"
              >
                {profile?.firstName?.charAt(0) || 'A'}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function SidebarItem({ icon, label, path, hasDropdown, onClick }: { icon: string, label: string, path: string, hasDropdown?: boolean, onClick?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === path;

  return (
    <button
      onClick={() => {
        router.push(path);
        if (onClick) onClick();
      }}
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
    </button>
  );
}

