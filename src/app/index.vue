<script setup lang="ts">
import { useUserStore } from '@/entities/User';

import { socketService } from '@/shared/api';
const userStore = useUserStore();
socketService.setup();

const socket = socketService.socket;

socket.on('connect', () => {
    console.log('connected')
});
</script>

<template>
    <router-view v-if="userStore._inited" />
</template>

<style>
@import './styles';
</style>
