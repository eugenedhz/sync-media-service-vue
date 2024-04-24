import { User } from '@/entities/User';
import { buildApi } from '@/shared/api/lib/useApi';

export const loginNamespace = 'login';

export interface LogInRequestArgs {
    password: string;
    username: string;
}

export const useLogInApi = buildApi<User, LogInRequestArgs>(
    loginNamespace, 
    { url: '/auth/login', method: 'POST', withCredentials: true}
);