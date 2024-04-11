import { _GettersTree, defineStore } from 'pinia';

import { useLogInStore } from '../api/loginRequest';
import { useSignUpStore } from '../api/signupRequest';

import { LogInRequestArgs } from './types/login';
import { SignUpRequestArgs } from './types/signup';

import { useUserStore } from '@/entities/User';

export const authNamespace = 'auth';

export interface AuthSchema {
    error?: string;
}

export interface AuthGetterSchema extends _GettersTree<AuthSchema> {
    
}
export interface AuthActionSchema {
    login: (params: LogInRequestArgs) => Promise<void>;
    signup: (params: SignUpRequestArgs) => Promise<void>;
    clear: () => void;
}

export const useAuthStore = defineStore<string, AuthSchema, AuthGetterSchema, AuthActionSchema>(authNamespace, {
    state: (): AuthSchema => ({
        error: undefined
    }),
    actions: {
        async login(authData: LogInRequestArgs) {
            const loginStore = useLogInStore();
            await loginStore.login(authData);
            if (!loginStore.error) {
                const userData = loginStore.data;
                if(userData) {
                    const userStore = useUserStore();
                    userStore.setUser(userData);
                }
                this.clear();
            }
            else {
                this.error = loginStore.error;
            }
        },
        async signup(authData: SignUpRequestArgs) {
            const signupStore = useSignUpStore();
            await signupStore.signup(authData);
            if (!signupStore.error) {
                const userData = signupStore.data;
                if(userData) {
                    const userStore = useUserStore();
                    userStore.setUser(userData);
                }
                this.clear();
            }
            else {
                this.error = signupStore.error;
            }
        },
        clear() {
            this.error = undefined;
        },
    }
});
