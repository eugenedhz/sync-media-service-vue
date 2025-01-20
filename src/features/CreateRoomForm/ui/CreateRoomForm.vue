<script setup lang="ts">
import { ref, onUnmounted} from 'vue';

import { useCreateRoomFormStore } from '../model/createRoomFormStore';

import DefaultRoom from '@/shared/assets/img/default_room.jpg';

import { Card, Input, FileInput, Row, Column, Button, Typography, Avatar } from '@/shared/ui';
import { useRouter } from 'vue-router';
import { Routes } from '@/shared/consts/router';

const router = useRouter()
const createRoomFormStore = useCreateRoomFormStore();

const submitForm = async () => {
    let room = await createRoomFormStore.createRoom();
    if (room) {
        createRoomFormStore.resetForm();
        router.push({
            name: Routes.ROOM,
            params: {
                id: room.id
            }
        });
    };
};

const temporaryAvatar = ref<string | undefined>(undefined);
const handleFileInputChange = (file: File | null) => {
    if (file) {
        if (file.type !== 'image/jpeg') {
            createRoomFormStore.cover = undefined;
            alert('Пожалуйста, загрузите файл в формате JPG.');
            return; // Прерываем выполнение функции, если формат не соответствует
        }
        temporaryAvatar.value = URL.createObjectURL(file);
        createRoomFormStore.cover = file; // Обновляем хранилище
        if (createRoomFormStore.error === 'Добавьте обложку комнаты') {
            createRoomFormStore.error = ''
        }
    } else {
        temporaryAvatar.value = undefined;
    }
};

const handleError = () => {
    if (createRoomFormStore.error === 'Заполните имя комнаты') {
        createRoomFormStore.error = ''
    }
}

onUnmounted(() => {
    if (temporaryAvatar.value) {
        URL.revokeObjectURL(temporaryAvatar.value);
    }
    createRoomFormStore.error = ''
    createRoomFormStore.title = ''
});
</script>
<template>
    <Card
        :material="'qwartz-secondary'"
        full-width
        style="height: 100%; min-width: 500px"
    >
        <template #header>
            <Row full-width>
                <Typography
                    :weight="600"
                    :size="'lg'"
                >
                    Новая комната
                </Typography>
            </Row>
        </template>
        <Column>
            <form @submit.prevent="submitForm">
                <Column :gap="'32'" :justify="'between'">
                    <Column :gap="'4'" :justify="'between'">
                        <div class="cover-container">
                            <Avatar
                                class="darked"
                                :width="'400'"
                                :height="'100'"
                                :src="temporaryAvatar"
                                :default="DefaultRoom"
                            />
                            <Input
                                v-model="createRoomFormStore.title"
                                :placeholder="'Имя комнаты'"
                                :max="'20'"
                                class="name-overlay"
                                @change="handleError"
                            />
                        </div>
                        <!-- Видимый FileInput -->
                        <FileInput
                            v-model="createRoomFormStore.cover"
                            full-width
                            @change="handleFileInputChange"
                        />
                    </Column>
                    <Button
                        type="submit"
                        full-width
                        style="max-width: 400px;"
                        :variant="'outlined'"
                    >
                        создать
                    </Button>
                </Column>
            </form>
            <Typography :color="'red'" :size="'sm'">
                {{ createRoomFormStore.error }}
            </Typography>
        </Column>
    </Card>
</template>
<style lang="css">
.darked {
    filter: brightness(0.4);
}

.cover-container {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;
    max-width: 400px;
    min-width: 400px;
    min-height: 100px;
    max-height: 100px;
    overflow: hidden;
    border-radius: 10px;
    background-color: #000000; /* Фон на случай отсутствия изображения */
}

/* Поле ввода поверх картинки */
.name-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    width: 84%;
}
</style>