import { _GettersTree, defineStore } from 'pinia';

import { useUserStore } from '@/entities/User';
import {
    useDeleteAccountApi,
    useUpdateAvatarApi,
    useUpdateDescriptionApi,
    useUpdateDisplayNameApi,
    useUpdatePasswordApi,
    useUpdateUsernameApi
} from '../api/requests';

export const userPanelNamespace = 'userPanel';

export interface UserPanelSchema {
    avatar: File | null;
    username: string;
    displayName: string;
    description: string;
    password: string;
    repeatPassword: string;
    error?: string;
}

export interface _UserPanelGetterSchema extends _GettersTree<UserPanelSchema> {}

export interface UserPanelActionsSchema {
    updateAvatar: () => Promise<void>;
    updateUsername: () => Promise<void>;
    updateDisplayName: () => Promise<void>;
    updateDescription: () => Promise<void>;
    updatePassword: () => Promise<void>;
    deleteAccount: () => Promise<void>;
}

export const useUserPanelStore = defineStore<
    string,
    UserPanelSchema,
    _UserPanelGetterSchema,
    UserPanelActionsSchema
>(userPanelNamespace, {
    state: (): UserPanelSchema => ({
        avatar: null,
        username: '',
        displayName: '',
        description: '',
        password: '',
        repeatPassword: '',
        error: undefined
    }),
    actions: {
        async updateAvatar() {
            if (!this.avatar) {
                return;
            }

            this.error = undefined;
            const updateAvatarApi = useUpdateAvatarApi();
            const response = await updateAvatarApi.initiate({
                avatar: this.avatar
            });
            if (response) {
                const userStore = useUserStore();
                userStore.setUser(response);
                console.log(response);
                return;
            }
            this.error = updateAvatarApi.error;
        },
        async updateUsername() {
            this.error = undefined;
            const updateUsernameApi = useUpdateUsernameApi();
            const response = await updateUsernameApi.initiate({
                username: this.username
            });
            if (response) {
                const userStore = useUserStore();
                userStore.setUser(response);
                return;
            }
            this.error = updateUsernameApi.error;
        },
        async updateDisplayName() {
            this.error = undefined;
            const updateDisplayNameApi = useUpdateDisplayNameApi();
            const response = await updateDisplayNameApi.initiate({
                displayName: this.displayName
            });
            if (response) {
                const userStore = useUserStore();
                userStore.setUser(response);
                return;
            }
            this.error = updateDisplayNameApi.error;
        },
        async updateDescription() {
            this.error = undefined;
            const updateDescriptionApi = useUpdateDescriptionApi();
            const response = await updateDescriptionApi.initiate({
                description: this.description
            });
            if (response) {
                const userStore = useUserStore();
                userStore.setUser(response);
                return;
            }
            this.error = updateDescriptionApi.error;
        },
        async updatePassword() {
            this.error = undefined;
            const updatePasswordApi = useUpdatePasswordApi();
            const response = await updatePasswordApi.initiate({
                password: this.password
            });
            if (response) {
                const userStore = useUserStore();
                userStore.setUser(response);
                return;
            }
            this.error = updatePasswordApi.error;
        },
        async deleteAccount() {
            this.error = undefined;
            const deleteAccountApi = useDeleteAccountApi();
            const response = await deleteAccountApi.initiate();
            if (response) {
                const userStore = useUserStore();
                userStore.logout();
            }
            this.error = deleteAccountApi.error;
        }
    }
});
