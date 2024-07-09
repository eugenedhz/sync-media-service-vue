<script setup lang="ts">
import { __BASE_URL__ } from '@/shared/config/environment';

defineProps({
    src: {
        type: String
    },
    width: {
        type: Number,
    },
    height: {
        type: Number,
    }
})
</script>

<template>
    <img :width="width" :height="height" :src="__BASE_URL__ + src"/>
</template>