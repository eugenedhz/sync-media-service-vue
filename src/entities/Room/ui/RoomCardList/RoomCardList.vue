<script setup lang="ts">
import { PropType } from 'vue';
import { Room } from '../../model/types/room';
import RoomCard from '../RoomCard/RoomCard.vue';
import { Row, Button } from '@/shared/ui';
import Delete from '@/shared/assets/icons/delete.svg?component';
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
    'deleted-room'
]);

const roomDeleteApi = useDeleteRoomApi();

const deleteRoom = (room: Room | undefined) => {
    if (room) {
        roomDeleteApi.initiate(undefined, {
            params: {
                id: room.id
            }
        })

        emit('deleted-room')
    }
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