<script setup lang="ts">
import { ref, onUnmounted, onMounted, defineProps, PropType, defineEmits} from 'vue';

import { useUpdateRoomFormStore } from '../model/updateRoomFormStore';

import { Room } from '@/entities/Room';

import { Card, Input, FileInput, Row, Column, Button, Typography, Avatar } from '@/shared/ui';
import { __BASE_URL__ } from '@/shared/config/environment';

const props = defineProps({
    room: {
        type: Object as PropType<Room>
    }
})

const emit = defineEmits([
    'updater', 
]);

const updateRoomFormStore = useUpdateRoomFormStore();

const submitForm = async () => {
    if (props.room) {
        let updatedroom = await updateRoomFormStore.updateRoom(props.room);
        if (updatedroom) {
            emit('updater', props.room)
            updateRoomFormStore.resetForm();
        };
    }
};

const temporaryAvatar = ref<string | undefined>(undefined);
const handleFileInputChange = (file: File | null) => {
    if (file) {
        if (file.type !== 'image/jpeg') {
            updateRoomFormStore.cover = undefined;
            alert('Пожалуйста, загрузите файл в формате JPG.');
            return; // Прерываем выполнение функции, если формат не соответствует
        }
        temporaryAvatar.value = URL.createObjectURL(file);
        updateRoomFormStore.cover = file; // Обновляем хранилище
    } else {
        temporaryAvatar.value = undefined;
    }
};

const handleError = () => {
    if (updateRoomFormStore.error === 'Заполните имя комнаты') {
        updateRoomFormStore.error = ''
    }
}

onMounted(() => {
    if (props.room) {
        updateRoomFormStore.title = props.room.title
    }
})

onUnmounted(() => {
    if (temporaryAvatar.value) {
        URL.revokeObjectURL(temporaryAvatar.value);
    }
    updateRoomFormStore.error = ''
    updateRoomFormStore.title = ''
});
</script>
<template>
    <Card
        :material="'qwartz-secondary'"
        style="height: 100%; max-height: 380px;"
    >
        <template #header>
            <Row full-width>
                <Typography
                    :weight="600"
                    :size="'lg'"
                >
                    Редактировать комнату
                </Typography>
            </Row>
        </template>
        <Column :width="'300'">
            <form @submit.prevent="submitForm">
                <Column :gap="'16'" :justify="'between'">
                    <Column :gap="'4'" :justify="'between'">
                        <div class="cover-container">
                            <Avatar
                                class="darked"
                                :width="'258'"
                                :height="'80'"
                                :src="temporaryAvatar || (__BASE_URL__ + room?.cover)"
                            />
                            <Input
                                v-model="updateRoomFormStore.title"
                                :placeholder="'Имя комнаты'"
                                :max="'20'"
                                class="name-overlay"
                                @change="handleError"
                            />
                        </div>
                        <!-- Видимый FileInput -->
                        <FileInput
                            v-model="updateRoomFormStore.cover"
                            accept=".jpg"
                            full-width
                            @change="handleFileInputChange"
                        />
                    </Column>
                    <Button
                        type="submit"
                        full-width
                    >
                        сохранить
                    </Button>
                </Column>
            </form>
            <Typography :color="'red'" :size="'sm'">
                {{ updateRoomFormStore.error }}
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
    width: 258px;
    height: 80px;
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