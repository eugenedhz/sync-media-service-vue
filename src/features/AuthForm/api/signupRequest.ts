import { isAxiosError } from 'axios';
import { _GettersTree, defineStore } from 'pinia';

import { ApiError } from '../model/types/apiError';
import { SignUpRequestArgs } from '../model/types/signup';

import { User } from '@/entities/User';
import { api } from '@/shared/api';


export const signupNamespace = 'signup';

export interface SignUpSchema {
    data?: User,
    error?: string,
    isLoading: boolean
}

export interface SignUpGetterSchema extends _GettersTree<SignUpSchema>{

}

export interface SignUpActionsSchema {
    signup: (params: SignUpRequestArgs) => Promise<void>;
    clear: () => void
}

export const useSignUpStore = defineStore<string, SignUpSchema, SignUpGetterSchema, SignUpActionsSchema>(signupNamespace, {
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
            }
            catch(error) {
                if (isAxiosError<ApiError>(error)) {
                    this.error = error.response?.data.message;
                } else {
                    this.error = 'Failed to signup';
                }
            }
            finally {
                this.isLoading = false;
            }
        },
        clear() {
            this.data = undefined;
            this.error = undefined;
            this.isLoading = false;
        },
    }
});