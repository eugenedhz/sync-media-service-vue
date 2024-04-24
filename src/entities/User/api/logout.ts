import { buildApi } from '@/shared/api/lib/useApi';

export const logoutNamespace = 'logoutAuth';

export const useLogOutApi = buildApi<void>(
    logoutNamespace, 
    { url: '/auth/logout', method: 'POST', withCredentials: true}
);