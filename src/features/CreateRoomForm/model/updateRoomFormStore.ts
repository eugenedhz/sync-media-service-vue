import { _GettersTree, defineStore } from 'pinia';

import { Room, useUpdateRoomApi } from '@/entities/Room';

// import { validationRequests } from '../lib/validators/validationHandler';

export const updateRoomFormNamespace = 'updateRoomForm';

export interface UpdateRoomFormSchema {
    cover: File | undefined;
    title: string;
    error?: string;
}

export interface _UpdateRoomFormGetterSchema extends _GettersTree<UpdateRoomFormSchema> {}

export interface UpdateRoomFormActionsSchema {
    updateRoom: (room: Room) => Promise<Room | undefined>;
    resetForm: () => void;
}

export const useUpdateRoomFormStore = defineStore<
    string,
    UpdateRoomFormSchema,
    _UpdateRoomFormGetterSchema,
    UpdateRoomFormActionsSchema
>(updateRoomFormNamespace, {
    state: (): UpdateRoomFormSchema => ({
        cover: undefined,
        title: '',
        error: undefined
    }),
    actions: {
        async updateRoom(room: Room) {
            this.error = undefined;
            const createRoomApi = useUpdateRoomApi();
            const formData = new FormData();

            if (this.title === '') {
                this.error = 'Заполните имя комнаты'
                return
            }
            if (this.cover) {
                formData.append('cover', this.cover);
            } else {
                if (this.title === room.title) {
                    return
                }
            }
            
            formData.append('title', this.title);
            const response = await createRoomApi.initiate(formData, {params: {id: room.id}});
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
