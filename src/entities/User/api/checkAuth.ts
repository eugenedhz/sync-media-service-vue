import { isAxiosError } from 'axios';
import { _GettersTree, defineStore } from 'pinia';

import { ApiError } from '../../../shared/api/types/apiError';

import { api } from '@/shared/api';

export const checkAuthNamespace = 'checkAuth';

export interface CheckAuthSchema {
    error?: string,
    isLoading: boolean
}

export interface _CheckAuthGetterSchema extends _GettersTree<CheckAuthSchema>{

}

export interface CheckAuthActionsSchema {
    checkAuth: () => Promise<void>;
}

export const useCheckAuthStore = defineStore<string, CheckAuthSchema, _CheckAuthGetterSchema, CheckAuthActionsSchema>(checkAuthNamespace, {
    state: (): CheckAuthSchema => ({
        error: undefined,
        isLoading: false
    }),
    actions: {
        async checkAuth() {
            this.isLoading = true;
            try {
                await api.post(
                    '/auth/refresh',
                    '',
                    { withCredentials: true }
                );
                this.error = undefined;
            }
            catch(error) {
                if (isAxiosError<ApiError>(error)) {
                    this.error = error.response?.data.message;
                } else {
                    this.error = 'Failed to refresh';
                }
            }
            finally {
                this.isLoading = false;
            }
        },
    }
});