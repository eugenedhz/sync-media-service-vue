import { defineStore } from 'pinia';

import { User, UserSchema } from './types/user';

import { USER } from '@/shared/consts/localStorage';

export const userNamespace = 'user';

export const useUserStore = defineStore(userNamespace, {
    state: (): UserSchema => ({
        authData: undefined
    }),
    actions: {
        setUser(user: User): void {
            this.authData = user;
            localStorage.setItem(USER, JSON.stringify(user));
        },
        clearUser(): void {
            this.authData = undefined;
            localStorage.removeItem(USER);
        },  
    },
});
