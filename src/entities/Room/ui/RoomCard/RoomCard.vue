<script setup lang="ts">
import { PropType } from 'vue';
import { RoomWithParticipants } from '../../api/requests';
import { Image, Typography, Row } from '@/shared/ui';
import { __BASE_URL__ } from '@/shared/config/environment'
import Person from '@/shared/assets/icons/person.svg?component';

defineProps({
    room: {
        type: Object as PropType<RoomWithParticipants>
    }
})
</script>

<template>
    <div class="container">
        <Image :src="room?.cover"/>
        <Typography :size="'lg'" :weight="500" class="centered">
            {{ room?.title }}
        </Typography>

        <div class="right-up">
            <Row :gap="'4'" :align="'center'" style="padding: 8px;">
                <Person/>
                <Typography :size="'md'">
                    {{ room?.participants.length }}
                </Typography>
            </Row>
        </div>
    </div>
</template>

<style lang="css" scoped>
.container {
    cursor: pointer;
    overflow: hidden;
    position: relative;
    width: 313px;
    height: 92px;
    border-radius: 15px;
    box-shadow: var(--shadow);
    transition: filter 0.2s ease;
}

.right-up {
    position: absolute;
    top: 0;
    left: 0;
    max-width: 54px;
    transform: translate(0, 0);
}

.container:hover {
    filter: brightness(0.8);
}

.container:active {
    filter: brightness(0.6);
}

img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    filter: brightness(0.45);
}
.centered {
    cursor: pointer;
    white-space: nowrap;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>