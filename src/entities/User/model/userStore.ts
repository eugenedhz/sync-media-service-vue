import { _GettersTree, defineStore } from 'pinia';

import { useCheckAuthStore } from '../api/checkAuth';
import { useLogOutStore } from '../api/logout';

import { User } from './types/user';

import { USER_LOCAL_STORAGE_KEY, LOGGED_IN_LOCAL_STORAGE_KEY } from '@/shared/consts/localStorage';

export const userNamespace = 'user';

export interface UserSchema {
    loggedIn: boolean,
    authData?: User;
}

export interface _UserGetterSchema extends _GettersTree<UserSchema> {
    
}

export interface UserActionsSchema {
    setUser: (params: User) => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useUserStore = defineStore<string, UserSchema, _UserGetterSchema, UserActionsSchema>(userNamespace, {
    state: (): UserSchema => ({
        loggedIn: false,
        authData: undefined
    }),
    actions: {
        setUser(authData: User){
            this.loggedIn = true;
            this.authData = authData;
            localStorage.setItem(LOGGED_IN_LOCAL_STORAGE_KEY, JSON.stringify(this.loggedIn));
            localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(authData));
        },
        async logout(){
            const logoutStore = useLogOutStore();
            await logoutStore.logout();
            if (!logoutStore.error){
                this.loggedIn = false;
                this.authData = undefined;
                localStorage.removeItem(LOGGED_IN_LOCAL_STORAGE_KEY);
                localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
            }
        }, 
        async checkAuth() {
            const checkAuthStore = useCheckAuthStore();
            await checkAuthStore.checkAuth();
            if (!checkAuthStore.error){
                const loggedIn = localStorage.getItem(LOGGED_IN_LOCAL_STORAGE_KEY);
                const authData = localStorage.getItem(USER_LOCAL_STORAGE_KEY);
                if (authData && loggedIn) {
                    this.loggedIn = JSON.parse(loggedIn);
                    this.authData = JSON.parse(authData);
                }
            }
            else {
                this.loggedIn = false;
                this.authData = undefined;
                localStorage.removeItem(LOGGED_IN_LOCAL_STORAGE_KEY);
                localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
            }
        } 
    },
});
