import { defineStore } from 'pinia';

import { api } from '@/shared/api';

const baseUrl = 'https://ilow-api.eugenv.ru';

export const authNamespace = 'auth';

interface User {
    avatar: string;
    birthday: number;
    description: string;
    displayName: string;
    email: string;
    id: number;
    isBanned: boolean;
    registrationDate: number;
    username: string;
}

export interface AuthSchema {
    user: User | null;
}

export interface AuthGetterSchema {
    isLoggedIn: (state: AuthSchema) => boolean;
}

export interface AuthActionSchema {
    login: (password: string, username: string) => Promise<void>;
    logout: () => Promise<void>;
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
                    `${baseUrl  }/auth/login`,
                    { password, username },
                    { withCredentials: true }
                );
                const userData = response.data as User;
                this.user = userData;
                localStorage.setItem('userData', JSON.stringify(userData));
                console.log('Login successful');
            } catch (error) {
                console.error('Login failed: ', error);
                throw error;
            }
        },
        async logout() {
            try {
                await api.post(
                    `${baseUrl  }/auth/logout`, 
                    '', 
                    { withCredentials: true}
                );
                localStorage.removeItem('userData');
                console.log('Logout successful');
            } catch (error) {
                console.error('Logout failed: ', error);
                throw error;
            }
        },
        async signup(displayName:string, email:string, password: string, username: string) {
            try {
                const response = await api.post(
                    `${baseUrl  }/auth/signup`,
                    {displayName, email, password, username},
                    { withCredentials: true }
                );
                const userData = response.data as User;
                this.user = userData;
                localStorage.setItem('userData', JSON.stringify(userData));
                console.log('Signup successful');
            }
            catch(error) {
                console.error('Signup failed: ', error);
                throw error;
            }
        }
    }
    // getters: {
    //     isLoggedIn: (state) => !!state.accessToken
    // }
});
