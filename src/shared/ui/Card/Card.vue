<script setup lang="ts">
import { PropType, computed } from 'vue';

export type CardMaterial = 'glass' | 'qwartz';

const props = defineProps({
    material: {
        type: String as PropType<CardMaterial>,
        default: 'glass'
    },
    framed: {
        type: Boolean
    },
    fullWidth: {
        type: Boolean,
        default: false
    },
    withPadding: {
        type: Boolean,
        default: true
    },
    width: {
        type: String,
        default: 'auto'
    },
    height: {
        type: String,
        default: 'auto'
    }
});

const classes = computed(() => ({
    [props.material]: true,
    'full-width': props.fullWidth,
    'with-padding': props.withPadding,
    'framed': props.framed
}));

</script>

<template>
    <div class="card" :width="width" :height="height" :class="classes">
        <slot></slot>
    </div>
</template>

<style class="css" scoped>
@import url('./Card.css');
</style>