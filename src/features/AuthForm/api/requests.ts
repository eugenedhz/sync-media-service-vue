import { User } from '@/entities/User';
import { buildApi } from '@/shared/api/lib/useApi';

export const loginNamespace = 'login';
export const signupNamespace = 'signup';

export interface LoginRequestArgs {
    password: string;
    username: string;
}

export const useLoginApi = buildApi<User, LoginRequestArgs>(loginNamespace, {
    url: '/auth/login',
    method: 'POST',
    withCredentials: true
});

export interface SignupRequestArgs {
    displayName: string;
    email: string;
    password: string;
    username: string;
}

export const useSignupApi = buildApi<User, SignupRequestArgs>(signupNamespace, {
    url: '/auth/signup',
    method: 'POST',
    withCredentials: true
});

