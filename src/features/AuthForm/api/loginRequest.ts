import { isAxiosError } from 'axios';
import { _GettersTree, defineStore } from 'pinia';

import { ApiError } from '../model/types/apiError';
import { LogInRequestArgs } from '../model/types/login';

import { User } from '@/entities/User';
import { api } from '@/shared/api';


export const loginNamespace = 'login';

export interface LogInSchema {
    data?: User,
    error?: string,
    isLoading: boolean
}

export interface LogInGetterSchema extends _GettersTree<LogInSchema>{

}

export interface LogInActionsSchema {
    login: (params: LogInRequestArgs) => Promise<void>;
    clear: () => void
}

export const useLogInStore = defineStore<string, LogInSchema, LogInGetterSchema, LogInActionsSchema>(loginNamespace, {
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
            }
            catch(error) {
                if (isAxiosError<ApiError>(error)) {
                    this.error = error.response?.data.message;
                } else {
                    this.error = 'Failed to login';
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