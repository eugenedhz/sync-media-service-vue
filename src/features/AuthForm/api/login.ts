import { isAxiosError } from 'axios';
import { _GettersTree, defineStore } from 'pinia';

import { ApiError } from '../../../shared/api/types/apiError';

import { LogInRequestArgs } from './types/login';

import { User } from '@/entities/User';
import { api } from '@/shared/api';

export const loginNamespace = 'login';

export interface LogInSchema {
    data?: User,
    error?: string,
    isLoading: boolean
}

export interface _LogInGetterSchema extends _GettersTree<LogInSchema>{

}

export interface LogInActionsSchema {
    login: (params: LogInRequestArgs) => Promise<void>;
}

export const useLogInStore = defineStore<string, LogInSchema, _LogInGetterSchema, LogInActionsSchema>(loginNamespace, {
    state: (): LogInSchema => ({
        data: undefined,
        error: undefined,
        isLoading: false
    }),
    actions: {
        async login(authData: LogInRequestArgs) {
            this.isLoading = true;
            try {
                const response = await api.post<User>(
                    '/auth/login',
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
                    this.error = 'Failed to login';
                    this.data = undefined;
                }
            }
            finally {
                this.isLoading = false;
            }
        },
    }
});