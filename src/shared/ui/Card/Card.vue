<script setup lang="ts">
import { PropType } from 'vue';

export type CardMaterial = 'glass' | 'qwartz';

const props = defineProps({
    material: {
        type: String as PropType<CardMaterial>,
        default: 'glass'
    },
    framed: {
        type: Boolean
    }
});

const classes = {
    [props.material]: true,
    'framed': props.framed
};

</script>

<template>
    <div class="card" :class="classes">
        <slot></slot>
    </div>
</template>

<style class="css" scoped>
@import url('./Card.css');
</style>