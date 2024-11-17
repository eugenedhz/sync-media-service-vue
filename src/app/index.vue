<script setup lang="ts">
import { useUserStore } from '@/entities/User';

const userStore = useUserStore();

</script>

<template>
    <router-view v-if="userStore._inited" />
</template>

<style>
@import './styles';
</style>
