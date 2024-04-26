import { _GettersTree, defineStore } from 'pinia';

import { useLoginApi, useSignupApi } from '../api/requests';

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
    resetForm: () => void;
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
        resetForm() {
            this.username = '';
            this.displayName = '';
            this.email = '';
            this.password = '';
            this.repeatPassword = '';
        },
        async signup() {
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
                this.resetForm();
                this.error = undefined;
            } else {
                this.error = signupApi.error; // пока не юзаю authValidationMessages потому что он орет по разным причинам надо сделать кучу проверок, я лучше подожду хук по валидациям, а потом уже буду накидывать
            }
        },
        async login() {
            const loginApi = useLoginApi();
            const response = await loginApi.initiate({
                password: this.password,
                username: this.username
            });
            if (response) {
                const userStore = useUserStore();
                userStore.setUser(response);
                this.resetForm();
                this.error = undefined;
            } else {
                this.error = loginApi.error;
            }
        },
    },
});
