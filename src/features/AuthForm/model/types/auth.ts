import { useAuthStore } from '../authStore';

export type AuthType = 'signup' | 'login';
export type AuthStoreType = ReturnType<typeof useAuthStore>;

export interface AuthContent {
    welcomeMsg: string;
    buttonText: string;
    linkText: string;
    authType: AuthType;
    route: string;
}