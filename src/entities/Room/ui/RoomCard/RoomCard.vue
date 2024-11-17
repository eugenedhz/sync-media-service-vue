<script setup lang="ts">
import { PropType } from 'vue';
import { Room } from '../../model/types/room';
import { Image, Typography } from '@/shared/ui';
import { __BASE_URL__ } from '@/shared/config/environment'

defineProps({
    room: {
        type: Object as PropType<Room>
    }
})
</script>

<template>
    <div class="container">
        <Image :src="room?.cover"/>
        <Typography :size="'lg'" :weight="500" class="centered">
            {{ room?.title }}
        </Typography>
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
    filter: brightness(0.6);
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