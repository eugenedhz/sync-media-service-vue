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
    overflow: hidden;
    position: relative;
    width: 313px;
    height: 92px;
    border-radius: 15px;
    box-shadow: var(--shadow);
    cursor: pointer;
}

img {
    height: 100%;
    width: 100%;
    object-fit: cover;
}
.centered {
    white-space: nowrap;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>