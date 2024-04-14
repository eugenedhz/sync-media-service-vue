import { isAxiosError } from 'axios';
import { _GettersTree, defineStore } from 'pinia';

import { ApiError } from '../../../shared/api/types/apiError';

import { api } from '@/shared/api';

export const logoutNamespace = 'logoutAuth';

export interface LogOutSchema {
    error?: string,
    isLoading: boolean
}

export interface _LogOutGetterSchema extends _GettersTree<LogOutSchema>{

}

export interface LogOutActionsSchema {
    logout: () => Promise<void>;
}

export const useLogOutStore = defineStore<string, LogOutSchema, _LogOutGetterSchema, LogOutActionsSchema>(logoutNamespace, {
    state: (): LogOutSchema => ({
        error: undefined,
        isLoading: false
    }),
    actions: {
        async logout() {
            this.isLoading = true;
            try {
                await api.post(
                    '/auth/logout',
                    '',
                    { withCredentials: true }
                );
                this.error = undefined;
            }
            catch(error) {
                if (isAxiosError<ApiError>(error)) {
                    this.error = error.response?.data.message;
                } else {
                    this.error = 'Failed to logout';
                }
            }
            finally {
                this.isLoading = false;
            }
        },
    }
});