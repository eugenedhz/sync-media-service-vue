<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    fullWidth: {
        type: Boolean
    }
});

const classes = computed(() => ({
    'full-width': props.fullWidth,
    tag: true
}));
</script>

<template>
    <span :class="classes">
        <slot></slot>
    </span>
</template>

<style lang="css" scoped>
@import url('./Tag.css');
</style>
