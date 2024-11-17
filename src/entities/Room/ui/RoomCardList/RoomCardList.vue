<script setup lang="ts">
import { PropType } from 'vue';
import { Room } from '../../model/types/room';
import RoomCard from '../RoomCard/RoomCard.vue';
import { Row, Button } from '@/shared/ui';
import Delete from '@/shared/assets/icons/delete.svg?component';
import { useDeleteRoomApi } from '../../api/requests';

defineProps({
    rooms: {
        type: Array as PropType<Room[]>
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
            <div style="max-height: 110px;">
                <RoomCard :room="room" @click="$emit('room-click', room)"/>

                <Button v-if="isUserProfile" @click="deleteRoom(room)" class="left-up">
                    <Delete/>
                </Button>
            </div>
        </template>
    </Row>
</template>

<style lang="css" scoped>
.left-up {
    white-space: nowrap;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(114%, -73%);
}
</style>