import { User } from '@/entities/User';
import { buildApi } from '@/shared/api/lib/useApi';

export const signupNamespace = 'signup';

export interface SignUpRequestArgs {
    displayName: string;
    email: string;
    password: string;
    username: string;
}

export const useSignUpApi = buildApi<User, SignUpRequestArgs>(
    signupNamespace, 
    { url: '/auth/signup', method: 'POST', withCredentials: true}
);