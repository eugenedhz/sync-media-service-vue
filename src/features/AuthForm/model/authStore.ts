import { defineStore } from 'pinia';

import { User } from '@/entities/User';
import { api } from '@/shared/api';

export const authNamespace = 'auth';

export interface AuthSchema {
    user: User | null;
}

export interface AuthGetterSchema {
    isLoggedIn: (state: AuthSchema) => boolean;
}

export interface AuthActionSchema {
    login: (password: string, username: string) => Promise<void>;
    signup: (displayName:string, email:string, password: string, username: string) => Promise<void>;
}

export const useAuthStore = defineStore(authNamespace, {
    state: (): AuthSchema => ({
        user: null
    }),
    actions: {
        async login(password: string, username: string) {
            try {
                const response = await api.post(
                    '/auth/login',
                    { password, username },
                    { withCredentials: true }
                );
                const userData = response.data as User;
                this.user = userData;
                localStorage.setItem('userData', JSON.stringify(userData));
            } catch (error) {
                console.error('Login failed: ', error);
                throw error;
            }
        },
        async signup(displayName:string, email:string, password: string, username: string) {
            try {
                const response = await api.post(
                    '/auth/signup',
                    {displayName, email, password, username},
                    { withCredentials: true }
                );
                const userData = response.data as User;
                this.user = userData;
                localStorage.setItem('userData', JSON.stringify(userData));
            }
            catch(error) {
                console.error('Signup failed: ', error);
                throw error;
            }
        }
    }
});
