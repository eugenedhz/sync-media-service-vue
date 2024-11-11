<script setup lang="ts">
import { PropType } from 'vue';
import { Room } from '../../model/types/room';
import RoomCard from '../RoomCard/RoomCard.vue';
import { Row } from '@/shared/ui';

defineProps({
    rooms: {
        type: Array as PropType<Room[]>
    }
})
defineEmits([
    'room-click',
]);
</script>

<template>
    <Row :gap="'16'" full-width>
        <template v-for="room in rooms" :key="room.id">
            <div @click="$emit('room-click', room)">
                <RoomCard :room="room"/>
            </div>
        </template>
    </Row>
</template>