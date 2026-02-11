import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/store/useUserStore';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const useGetSuperAdminMerchantsQuery = () => {
    return useQuery({
        queryKey: ['super-admin-merchants'],
        queryFn: async () => {
            const response = await api.get('/v1/super-admin/merchants');
            return response.data;
        },
    });
};

export const useUpdateMerchantKycStatusMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: number; status: 'done' | 'rejected' | 'incomplete' | 'being-verified' }) => {
            const response = await api.patch(`/v1/super-admin/merchants/${id}/kyc-status`, { status });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['super-admin-merchants'] });
        },
    });
};

export const useGetSuperAdminUsersQuery = () => {
    return useQuery({
        queryKey: ['super-admin-users'],
        queryFn: async () => {
            const response = await api.get('/v1/super-admin/users');
            return response.data;
        },
    });
};

export const useUpdateUserSuspensionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, isSuspended }: { id: number; isSuspended: boolean }) => {
            const response = await api.patch(`/v1/super-admin/users/${id}/suspension`, { isSuspended });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['super-admin-users'] });
        },
    });
};

export const useGetPendingMerchantsQuery = (secretKey?: string) => {
    return useQuery({
        queryKey: ['merchants', 'pending', secretKey],
        queryFn: async () => {
            const response = await api.get('/v1/merchants/pending-kyc', {
                headers: {
                    'x-merchant-secret-key': secretKey
                }
            });
            return response.data;
        },
        enabled: !!secretKey,
    });
};

export const useVerifyMerchantMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status, secretKey }: { id: number; status: 'done' | 'rejected', secretKey: string }) => {
            const response = await api.patch(`/v1/merchants/${id}/verify-kyc`, { status }, {
                headers: {
                    'x-merchant-secret-key': secretKey
                }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['merchants'] });
            queryClient.invalidateQueries({ queryKey: ['me'] });
        }
    });
};

export const useCreateMerchantMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { 
            name: string; 
            address: string; 
            outletName: string; 
            slug?: string; 
            outletAddress?: string;
            businessCategory?: string;
            operationalCategory?: string;
        }) => {
            const response = await api.post('/v1/merchants', payload);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate or refetch queries if needed
            queryClient.invalidateQueries({ queryKey: ['me'] });
        }
    });
};
export const useGetOutletsQuery = () => {
    return useQuery({
        queryKey: ['outlets'],
        queryFn: async () => {
            const response = await api.get('/v1/outlets');
            return response.data;
        },
    });
};

export const useAddOutletMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { name: string; address?: string }) => {
            const response = await api.post('/v1/outlets', payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outlets'] });
        },
    });
};

export const useUpdateOutletMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...payload }: { id: number; name?: string; address?: string }) => {
            const response = await api.patch(`/v1/outlets/${id}`, payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outlets'] });
        },
    });
};

export const useDeleteOutletMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/v1/outlets/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outlets'] });
        },
    });
};
export const useUpdateBusinessProfileMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: any) => {
            const response = await api.post('/v1/merchants/business-profile', payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['me'] });
            queryClient.invalidateQueries({ queryKey: ['business-profile'] });
        }
    });
};

export const useGetBusinessProfileQuery = () => {
    return useQuery({
        queryKey: ['business-profile'],
        queryFn: async () => {
            const response = await api.get('/v1/merchants/business-profile');
            return response.data;
        },
    });
};

export const useGetMerchantMembersQuery = () => {
    return useQuery({
        queryKey: ['merchant-members'],
        queryFn: async () => {
            const response = await api.get('/v1/merchants/members');
            return response.data;
        },
    });
};

export const useAddMerchantMemberMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { phone: string; pinCode: string; role: 'manager' | 'operator' | 'staff'; email?: string }) => {
            const response = await api.post('/v1/merchants/members', payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['merchant-members'] });
        },
    });
};

export const useUpdateMerchantMemberMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ membershipId, payload }: { membershipId: number; payload: { phone?: string; pinCode?: string; role?: 'manager' | 'operator' | 'staff'; email?: string } }) => {
            const response = await api.patch(`/v1/merchants/members/${membershipId}`, payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['merchant-members'] });
        },
    });
};

export const useToggleMerchantMemberSuspensionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ membershipId, isSuspended }: { membershipId: number; isSuspended: boolean }) => {
            const response = await api.patch(`/v1/merchants/members/${membershipId}/suspension`, { isSuspended });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['merchant-members'] });
        },
    });
};

export const useDeleteMerchantMemberMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (membershipId: number) => {
            const response = await api.delete(`/v1/merchants/members/${membershipId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['merchant-members'] });
        },
    });
};

export const useGetPresignedUrlMutation = () => {
    return useMutation({
        mutationFn: async ({ fileName, category, contentType }: { fileName: string; category: string; contentType: string }) => {
            const response = await api.post('/v1/upload/presigned-url', { fileName, category, contentType });
            return response.data; // { url, key }
        },
    });
};

export const useVerifyUrlMutation = () => {
    return useMutation({
        mutationFn: async ({ urls, type }: { urls: string[]; type: string }) => {
            const response = await api.post('/v1/upload/verify-url', { urls, type });
            return response.data;
        },
    });
};

export const useGetFileUrlMutation = () => {
    return useMutation({
        mutationFn: async (key: string) => {
            const response = await api.get('/v1/upload/file-url', {
                params: { key }
            });
            return response.data; // string (the presigned URL)
        },
    });
};

export const uploadFileToS3 = async (url: string, file: File) => {
    await axios.put(url, file, {
        headers: {
            'Content-Type': file.type
        },
    });
};

// Auth Mutations
export const useSignupInit = () => {
    return useMutation({
        mutationFn: async (identifier: string) => {
            return await api.post('/v1/auth/signup/init', { identifier });
        },
    });
};

export const useGetMeQuery = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const response = await api.get('/v1/users/me');
            return response.data;
        },
        retry: false,
    });
};

export const useUpdateMeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { firstName?: string; lastName?: string }) => {
            const response = await api.patch('/v1/users/profile', payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['me'] });
        },
    });
};

export const useSignupVerify = () => {
    return useMutation({
        mutationFn: async ({ identifier, otp }: { identifier: string; otp: string }) => {
            return await api.post('/v1/auth/signup/verify', { identifier, otp });
        },
    });
};

export const useSignupComplete = () => {
    return useMutation({
        mutationFn: async (payload: any) => {
            return await api.post('/v1/auth/signup/complete', payload);
        },
    });
};

export const useCheckIdentity = () => {
    return useMutation({
        mutationFn: async (identifier: string) => {
            const response = await api.get(`/v1/auth/check-identity`, {
                params: { identifier }
            });
            return response.data;
        },
    });
};

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: async ({ phone, pinCode }: any) => {
            // Check for mock credentials first to maintain existing functionality if needed
            if (phone === '9800000000' && pinCode === '123456') {
                return {
                    data: {
                        user: { phone, name: 'Admin User', role: 'admin' },
                        access_token: 'mock-jwt-token'
                    }
                };
            }
            const data =  await api.post('/v1/auth/login', { identifier: phone, pinCode });
            return data;
        },
    });
};

export const useGetSSOTokenMutation = () => {
    return useMutation({
        mutationFn: async (token?: string | null) => {
            const response = await api.get('/v1/users/ecommerce-token', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        },
    });
};

// You can add interceptors here if needed
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        // Handle response data if needed
        return response;
    },
    error => {
        const isAuthRequest = error.config?.url?.includes('/v1/auth/');
        if (error.response?.status === 401 && !isAuthRequest) {
            // Clear auth data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('user_data');

            // Clear store
            useUserStore.getState().clearProfile();

            // Redirect to login

        }
        return Promise.reject(error);
    }
);