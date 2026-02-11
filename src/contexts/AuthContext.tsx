import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { api, useGetSSOTokenMutation } from '@/services/api';
import { useUserStore } from '@/store/useUserStore';
import { queryClient } from '@/lib/query-client';

interface User {
    phone: string;
    firstName?: string;
    lastName?: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    redirect_uri: string | null;
    completeAuth: (user: User, token: string, keepSignedIn?: boolean) => void;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const searchParams = useSearchParams();
    const redirect_uri = searchParams.get('redirect_uri');
    const getSSOTokenMutation = useGetSSOTokenMutation()
    const pathname = usePathname();
    const { setProfile, clearProfile } = useUserStore();

    useEffect(() => {
        // Check for stored auth token on mount
        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkAuth = async () => {
        try {
            // Check localStorage (permanent) or sessionStorage (session only)
            const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
            const userData = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');

            if (token && userData) {
                setUser(JSON.parse(userData));
                await fetchProfile();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await api.get('/v1/users/me');
            const profile = response.data;
            setProfile(profile);
            if (redirect_uri) {
                const tokenData = await getSSOTokenMutation.mutateAsync(response.data.access_token);

                if (tokenData.ecommerce_token) {
                    const finalUrl = `${redirect_uri}${redirect_uri.includes('?') ? '&' : '?'}jwt=${tokenData.ecommerce_token}`;
                    console.log(finalUrl);
                    window.location.replace(finalUrl);
                }

                return;
            }

            if (pathname === "/dashboard" && profile.isSuperAdmin) {
                router.replace('/admin/dashboard');
                return
            }

            // Handle redirection logic based on merchant status
            if (pathname === '/login' || pathname === '/') {
                if (profile.isSuperAdmin) {
                    router.replace('/admin/dashboard');
                } else if (!profile.isMerchantMember) {
                    router.replace('/business-type');
                } else {
                    router.replace('/dashboard');
                }
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    };

    const completeAuth = async (userData: User, token: string, keepSignedIn: boolean = true) => {
        if (keepSignedIn) {
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user_data', JSON.stringify(userData));
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('user_data');
        } else {
            sessionStorage.setItem('auth_token', token);
            sessionStorage.setItem('user_data', JSON.stringify(userData));
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
        }
        setUser(userData);
        await fetchProfile();
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user_data');
        setUser(null);
        clearProfile();
        queryClient.clear();
        router.replace('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, redirect_uri, completeAuth, logout, refreshProfile: fetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
