<script setup lang="ts">
import { onMounted } from 'vue';

import { useUserStore } from '@/entities/User';

const userStore = useUserStore();

onMounted(() => {
    userStore.checkAuth();
});
</script>

<template>
    <router-view />
</template>

<style>
@import './styles';
</style>
