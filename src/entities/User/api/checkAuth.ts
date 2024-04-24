import { buildApi } from '@/shared/api/lib/useApi';

export const checkAuthNamespace = 'checkAuth';

export const useCheckAuthApi = buildApi<void, void>(
    checkAuthNamespace, 
    { url: '/auth/refresh', method: 'POST', withCredentials: true}
);