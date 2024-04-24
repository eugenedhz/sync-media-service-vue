import { _GettersTree, defineStore } from 'pinia';

import { useLogInApi } from '../api/login';
import { useSignUpApi } from '../api/signup';
import {
    validationAuth,
    validationAuthErrorClear
} from '../lib/validators/validationHandler';

import { useUserStore } from '@/entities/User';


export const authFormNamespace = 'authForm';

export interface AuthFormSchema {
    username: string;
    displayName: string;
    email: string;
    password: string;
    repeatPassword: string;
    isFormFilled: boolean;
}

export interface _AuthFormGetterSchema extends _GettersTree<AuthFormSchema> {
    
}

export interface AuthFormActionsSchema {
    setIsFormFilled: (params: string) => void;
    clearForm: () => void;
    serverErrorsClear: (params: string) => void;
    submitForm: (params: string) => Promise<void>;
}

export const useAuthFormStore = defineStore<string, AuthFormSchema, _AuthFormGetterSchema, AuthFormActionsSchema>(authFormNamespace, {
    state: (): AuthFormSchema => ({
        username: '',
        displayName: '',
        email: '',
        password: '',
        repeatPassword: '',
        isFormFilled: false
    }),
    actions: {
        setIsFormFilled(authType: string) {
            if (authType === 'signup') {
                if (
                    this.username !== '' &&
                    this.displayName !== '' &&
                    this.email !== '' &&
                    this.password !== '' &&
                    this.repeatPassword !== '' &&
                    this.password === this.repeatPassword
                ) {
                    this.isFormFilled = true;
                } else {
                    this.isFormFilled = false;
                }
            } else if (this.username !== '' && this.password !== '') {
                this.isFormFilled = true;
            } else {
                this.isFormFilled = false;
            }
        },
        clearForm() {
            this.username = '';
            this.displayName = '';
            this.email = '';
            this.password = '';
            this.repeatPassword = '';
            this.isFormFilled = false;
        },
        serverErrorsClear(field: string) {
            validationAuthErrorClear(field);
        },
        async submitForm(authType: string) {
            if (authType === 'signup') {
                const signupApi = useSignUpApi();
                await signupApi.initiate({
                    displayName: this.displayName,
                    email: this.email,
                    password: this.password,
                    username: this.username
                });
                if (!signupApi.error) {
                    const userData = signupApi.data;
                    if(userData) {
                        const userStore = useUserStore();
                        userStore.setUser(userData);
                    }
                    this.clearForm();
                }
                else {
                    validationAuth(signupApi.error);
                }
            } 
            else {
                const loginApi = useLogInApi();
                await loginApi.initiate({
                    password: this.password,
                    username: this.username
                });
                if (!loginApi.error) {
                    const userData = loginApi.data;
                    if(userData) {
                        const userStore = useUserStore();
                        userStore.setUser(userData);
                    }
                    this.clearForm();
                }
                else {
                    validationAuth(loginApi.error);
                }
            }
        }
    },
});
