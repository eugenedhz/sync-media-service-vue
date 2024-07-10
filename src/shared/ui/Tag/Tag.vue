<script setup lang="ts">
import { computed, PropType } from 'vue';

type TagSize = 'md' | 'sm' | 'md-inverted';

const props = defineProps({
    fullWidth: {
        type: Boolean
    },
    size: {
        type: String as PropType<TagSize>,
        default: 'md'
    }
});

const tagSize: Record<TagSize, TagSize> = {
    md: 'md',
    sm: 'sm',
    'md-inverted': 'md-inverted'
}

const classes = computed(() => ({
    tag: true,
    [tagSize[props.size]]: props.size,
    'full-width': props.fullWidth,
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
