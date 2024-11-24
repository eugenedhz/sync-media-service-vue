<script setup lang="ts">
import { PropType } from 'vue';
import { Room } from '../../model/types/room';
import RoomCard from '../RoomCard/RoomCard.vue';
import { Row, Button } from '@/shared/ui';
import Delete from '@/shared/assets/icons/delete.svg?component';
import Edit from '@/shared/assets/icons/edit.svg?component';
import { useDeleteRoomApi, RoomWithParticipants } from '../../api/requests';

defineProps({
    rooms: {
        type: Array as PropType<RoomWithParticipants[]>
    },
    isUserProfile: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits([
    'room-click',
    'deleted-room',
    'update-room'
]);

const roomDeleteApi = useDeleteRoomApi();

const deleteRoom = (room: Room | undefined) => {
    if (room) {
        roomDeleteApi.initiate(undefined, {
            params: {
                id: room.id
            }
        })

        emit('deleted-room', room)
    }
}

const updateRoom = (room: Room | undefined) => {
    emit('update-room', room)
}
</script>

<template>
    <Row :gap="'16'" full-width>
        <template v-for="room in rooms" :key="room.id">
            <div style="max-height: 110px; position: relative;">
                <RoomCard :room="room" @click="$emit('room-click', room)"/>

                <Button full-width :variant="'cleared'" v-if="isUserProfile" @click="deleteRoom(room)" class="left-up">
                    <Delete class="default-button"/>
                </Button>

                <Button full-width :variant="'cleared'" v-if="isUserProfile" @click="updateRoom(room)" class="left-up2">
                    <Edit class="default-button2"/>
                </Button>
            </div>
        </template>
    </Row>
</template>

<style lang="css" scoped>
.left-up {
    position: absolute;
    top: 0;
    right: 0;
    max-width: 54px;
    transform: translate(0, 0);
}

.left-up2 {
    position: absolute;
    top: -1px;
    right: 26px;
    max-width: 54px;
    transform: translate(0, 0);
}

.default-button2 {
    transition: filter 0.2s ease; /* Плавное изменение яркости */
}

.default-button2:hover {
    filter: brightness(0.8); /* Затемняем на 40% при нажатии */
}

.default-button2:active {
    filter: brightness(0.6); /* Затемняем на 40% при нажатии */
}

.default-button {
    fill: white; /* Устанавливаем белый цвет */
    transition: filter 0.2s ease; /* Плавное изменение яркости */
}

.default-button:hover {
    filter: brightness(0.8); /* Затемняем на 40% при нажатии */
}

.default-button:active {
    filter: brightness(0.6); /* Затемняем на 40% при нажатии */
}
</style>