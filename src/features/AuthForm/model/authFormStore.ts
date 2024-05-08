import { _GettersTree, defineStore } from 'pinia';

import { useLoginApi, useSignupApi } from '../api/requests';
import { validationRequests } from '../lib/validators/validationHandler';

import { useUserStore } from '@/entities/User';


export const authFormNamespace = 'authForm';

export interface AuthFormSchema {
    username: string;
    displayName: string;
    email: string;
    password: string;
    repeatPassword: string;
    error?: string;
}

export interface _AuthFormGetterSchema extends _GettersTree<AuthFormSchema> {
    
}

export interface AuthFormActionsSchema {
    signup: () => Promise<void>;
    login: () => Promise<void>;
}

export const useAuthFormStore = defineStore<string, AuthFormSchema, _AuthFormGetterSchema, AuthFormActionsSchema>(authFormNamespace, {
    state: (): AuthFormSchema => ({
        username: '',
        displayName: '',
        email: '',
        password: '',
        repeatPassword: '',
        error: undefined
    }),
    actions: {
        async signup() {
            this.error = undefined;
            const signupApi = useSignupApi();
            const response = await signupApi.initiate({
                displayName: this.displayName,
                email: this.email,
                password: this.password,
                username: this.username
            });
            if (response) {
                const userStore = useUserStore();
                userStore.setUser(response);
                return;
            }
            this.error = validationRequests(signupApi.error);
        },
        async login() {
            this.error = undefined;
            const loginApi = useLoginApi();
            const response = await loginApi.initiate({
                password: this.password,
                username: this.username
            });
            if (response) {
                const userStore = useUserStore();
                userStore.setUser(response);
                return;
            }
            this.error = validationRequests(loginApi.error);
        },
    },
});