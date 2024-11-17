import { _GettersTree, defineStore } from 'pinia';

import { User, useUpdateUserApi } from '@/entities/User';

import { validationRequests } from '@/features/AuthForm/lib/validators/validationHandler';

export const settingsFormSchemaNamespace = 'settingsFormSchema';

export interface SettingsFormSchema {
    avatar: File | undefined;
    username: string;
    displayName: string;
    description: string;
    password: string;
    error?: string;
}

export interface _SettingsFormGetterSchema extends _GettersTree<SettingsFormSchema> {}

export interface SettingsFormActionsSchema {
    updateProfile: (omit: string[]) => Promise<User | undefined>;
    resetForm: () => void;
}

export const useSettingsFormStore = defineStore<
    string,
    SettingsFormSchema,
    _SettingsFormGetterSchema,
    SettingsFormActionsSchema
>(settingsFormSchemaNamespace, {
    state: (): SettingsFormSchema => ({
        avatar: undefined,
        username: '',
        displayName: '',
        description: '',
        password: '',
        error: undefined
    }),
    actions: {
        async updateProfile(omit: string[]) {
            this.error = undefined;
            const updateApi = useUpdateUserApi();
            const formData = new FormData();
            if (this.avatar !== undefined) {
                formData.append('avatar', this.avatar);
            }
            if (!omit.includes('displayName')) {
                formData.append('displayName', this.displayName);
            }
            if (!omit.includes('username')) {
                formData.append('username', this.username);
            }
            if (!omit.includes('description')) {
                formData.append('description', this.description);
            }
            if (!omit.includes('password')) {
                formData.append('password', this.password);
            }
            const response = await updateApi.initiate(formData);
            if (response) {
                return response;
            }
            this.error = validationRequests(updateApi.error);
        },
        resetForm() {
            this.error = undefined;
        }
    }
});
