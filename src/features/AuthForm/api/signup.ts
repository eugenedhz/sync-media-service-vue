import { isAxiosError } from 'axios';
import { _GettersTree, defineStore } from 'pinia';

import { ApiError } from '../../../shared/api/types/apiError';

import { SignUpRequestArgs } from './types/signup';

import { User } from '@/entities/User';
import { api } from '@/shared/api';

export const signupNamespace = 'signup';

export interface SignUpSchema {
    data?: User,
    error?: string,
    isLoading: boolean
}

export interface _SignUpGetterSchema extends _GettersTree<SignUpSchema>{

}

export interface SignUpActionsSchema {
    signup: (params: SignUpRequestArgs) => Promise<void>;
}

export const useSignUpStore = defineStore<string, SignUpSchema, _SignUpGetterSchema, SignUpActionsSchema>(signupNamespace, {
    state: (): SignUpSchema => ({
        data: undefined,
        error: undefined,
        isLoading: false
    }),
    actions: {
        async signup(authData: SignUpRequestArgs) {
            this.isLoading = true;
            try {
                const response = await api.post<User>(
                    '/auth/signup',
                    authData,
                    { withCredentials: true }
                );
                this.data = response.data;
                this.error = undefined;
            }
            catch(error) {
                if (isAxiosError<ApiError>(error)) {
                    this.error = error.response?.data.message;
                    this.data = undefined;
                } else {
                    this.error = 'Failed to signup';
                    this.data = undefined;
                }
            }
            finally {
                this.isLoading = false;
            }
        },
    }
});