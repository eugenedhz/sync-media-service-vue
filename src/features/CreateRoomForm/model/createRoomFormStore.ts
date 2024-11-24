import { _GettersTree, defineStore } from 'pinia';

import { Room, useCreateRoomApi } from '@/entities/Room';

// import { validationRequests } from '../lib/validators/validationHandler';

export const createRoomFormNamespace = 'createRoomForm';

export interface CreateRoomFormSchema {
    cover: File | undefined;
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
        cover: undefined,
        title: '',
        error: undefined
    }),
    actions: {
        async createRoom() {
            this.error = undefined;
            const createRoomApi = useCreateRoomApi();
            const formData = new FormData();

            if (this.title === '') {
                this.error = 'Заполните имя комнаты'
                return
            }
            if (!this.cover) {
                this.error = 'Добавьте обложку комнаты'
                return
            }

            formData.append('cover', this.cover);
            formData.append('title', this.title);
            const response = await createRoomApi.initiate(formData);
            if (response) {
                return response;
            }
        },
        resetForm() {
            this.title = '';
            this.cover = undefined;
            this.error = undefined;
        }
    }
});
