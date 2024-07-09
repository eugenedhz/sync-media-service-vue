import { _GettersTree, defineStore } from 'pinia';

import { useCheckAuthApi, useLogoutApi } from '../api/requests';

import { User } from './types/user';

import { USER_LOCAL_STORAGE_KEY } from '@/shared/consts/localStorage';

export const userNamespace = 'user';

export interface UserSchema {
    authData?: User;
    _inited: boolean;
}

export interface _UserGetterSchema extends _GettersTree<UserSchema> {
    
}

export interface UserActionsSchema {
    setUser: (params: User) => void;
    setInited: (inited: boolean) => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useUserStore = defineStore<string, UserSchema, _UserGetterSchema, UserActionsSchema>(userNamespace, {
    state: (): UserSchema => ({
        authData: undefined,
        _inited: false
    }),
    actions: {
        setUser(user: User){
            this.authData = user;
            localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
        },
        setInited(inited: boolean) {
            this._inited = inited;
        },
        async logout(){
            const logoutApi = useLogoutApi();
            const response = await logoutApi.initiate();

            if (response){
                this.authData = undefined;
                localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
            }
        }, 
        async checkAuth() {
            const checkAuthApi = useCheckAuthApi();
            const response = await checkAuthApi.initiate();

            if (response) {
                this.authData = response;
            } else { 
                this.authData = undefined;
                localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
            }

            this.setInited(true);
        } 
    },
});