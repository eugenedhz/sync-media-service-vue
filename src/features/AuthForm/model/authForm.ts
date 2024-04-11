import { _GettersTree, defineStore } from 'pinia';

import {
    validationAuthFields,
    validationAuth,
    validationAuthErrorClear
} from '../lib/validators/validationHandler';

import { AuthStoreType, AuthType, AuthContent } from './types/auth';

export const authFormNamespace = 'authForm';

export interface AuthFormSchema {
    username: string;
    displayName: string;
    email: string;
    password: string;
    repeatPassword: string;
    typeInputPassword: string;
    typeInputRepeatPassword: string;
    authType: AuthType;
    isFormFilled: boolean;
}

export interface AuthFormGetterSchema extends _GettersTree<AuthFormSchema> {
    authContent: (state: AuthFormSchema) => AuthContent;
}

export interface AuthFormActionsSchema {
    setUsername: (params: string) => void;
    setDisplayName: (params: string) => void;
    setEmail: (params: string) => void;
    setPassword: (params: string) => void;
    setRepeatPassword: (params: string) => void;
    setTypeInputPassword: (params: string) => void;
    setTypeInputRepeatPassword: (params: string) => void;
    setAuthType: (params: AuthType) => void;
    togglePasswordVisibility: () => void;
    toggleRepeatPasswordVisibility: () => void;
    setIsFormFilled: () => void;
    clearForm: () => void;
    serverErrorsClear: (params: string) => void;
    submitForm: (params: AuthStoreType) => Promise<void>;
}

export const useAuthFormStore = defineStore<
    string,
    AuthFormSchema,
    AuthFormGetterSchema,
    AuthFormActionsSchema
>(authFormNamespace, {
    state: (): AuthFormSchema => ({
        username: '',
        displayName: '',
        email: '',
        password: '',
        repeatPassword: '',
        typeInputPassword: 'password',
        typeInputRepeatPassword: 'password',
        authType: 'signup',
        isFormFilled: false
    }),
    actions: {
        setUsername(username: string) {
            this.username = username;
            validationAuthFields('username', username);
            this.setIsFormFilled();
        },
        setDisplayName(displayName: string) {
            this.displayName = displayName;
            validationAuthFields('displayName', displayName);
            this.setIsFormFilled();
        },
        setEmail(email: string) {
            this.email = email;
            this.setIsFormFilled();
        },
        setPassword(password: string) {
            this.password = password;
            validationAuthFields('password', password);
            if (this.authType === 'signup') {
                validationAuthFields(
                    'repeatPassword',
                    password,
                    this.repeatPassword
                );
            }
            this.setIsFormFilled();
        },
        setRepeatPassword(repeatPassword: string) {
            this.repeatPassword = repeatPassword;
            validationAuthFields(
                'repeatPassword',
                this.password,
                repeatPassword
            );
            this.setIsFormFilled();
        },
        setTypeInputPassword(typeInputPassword: string) {
            this.typeInputPassword = typeInputPassword;
        },
        setTypeInputRepeatPassword(typeInputRepeatPassword: string) {
            this.typeInputRepeatPassword = typeInputRepeatPassword;
        },
        setAuthType(authType: AuthType) {
            this.authType = authType;
            this.setIsFormFilled();
        },
        togglePasswordVisibility() {
            this.typeInputPassword =
                this.typeInputPassword === 'password' ? 'text' : 'password';
        },
        toggleRepeatPasswordVisibility() {
            this.typeInputRepeatPassword =
                this.typeInputRepeatPassword === 'password'
                    ? 'text'
                    : 'password';
        },
        setIsFormFilled() {
            if (this.authType === 'signup') {
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
            this.typeInputPassword = 'password';
            this.typeInputRepeatPassword = 'password';
        },
        serverErrorsClear(field: string) {
            validationAuthErrorClear(field);
        },
        async submitForm(authStore: AuthStoreType) {
            if (this.authType === 'signup') {
                await authStore.signup({
                    displayName: this.displayName,
                    email: this.email,
                    password: this.password,
                    username: this.username
                });
                if (authStore.error !== undefined) {
                    validationAuth(authStore.error);
                }
            } else {
                await authStore.login({
                    password: this.password,
                    username: this.username
                });
                if (authStore.error !== undefined) {
                    validationAuth(authStore.error);
                }
            }
        }
    },
    getters: {
        authContent(): AuthContent {
            return this.authType === 'signup'
                ? {
                    welcomeMsg: 'Welcome!',
                    buttonText: 'SIGN UP',
                    linkText: 'Already have an account?',
                    authType: 'signup',
                    route: '/login'
                }
                : {
                    welcomeMsg: 'Welcome Back!',
                    buttonText: 'SIGN IN',
                    linkText: 'New here?',
                    authType: 'login',
                    route: '/signup'
                };
        }
    }
});
