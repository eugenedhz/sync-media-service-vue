import { _GettersTree, defineStore } from 'pinia';

import { Room, useCreateRoomApi } from '@/entities/Room';

// import { validationRequests } from '../lib/validators/validationHandler';

export const createRoomFormNamespace = 'createRoomForm';

export interface CreateRoomFormSchema {
    title: string;
    error?: string;
}

export interface _CreateRoomFormGetterSchema extends _GettersTree<CreateRoomFormSchema> {}

export interface CreateRoomFormActionsSchema {
    createRoom: () => Promise<Room | undefined>;
    resetForm: () => void;
}

export const useCreateRoomFormStore = defineStore<
    string,
    CreateRoomFormSchema,
    _CreateRoomFormGetterSchema,
    CreateRoomFormActionsSchema
>(createRoomFormNamespace, {
    state: (): CreateRoomFormSchema => ({
        title: '',
        error: undefined
    }),
    actions: {
        async createRoom() {
            this.error = undefined;
            const createRoomApi = useCreateRoomApi();
            const response = await createRoomApi.initiate({
                title: this.title
            });
            if (response) {
                return response;
            }
            this.error = createRoomApi.error;
        },
        resetForm() {
            this.title = '';
            this.error = undefined;
        }
    }
});
