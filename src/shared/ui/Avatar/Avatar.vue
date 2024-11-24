<script setup lang="ts">
import { computed } from 'vue';
import DefaultAvatar from '@/shared/assets/img/default_avatar.png';

const props = defineProps({
    width: {
        type: String,
        default: '55px'
    },
    height: {
        type: String,
        default: '55px'
    },
    src: {
        type: String,
        default: ''
    },
    default: {
        type: String,
        default: DefaultAvatar
    }
});

const imageSrc = computed(() => {
    const finalSrc = props.src?.endsWith("null") ? null : props.src;
    return finalSrc || props.default;
});

</script>

<template>
    <img :width="props.width" :height="props.height" :src="imageSrc" />
</template>


<style lang="css" scoped>
@import url('./Avatar.css');
</style>