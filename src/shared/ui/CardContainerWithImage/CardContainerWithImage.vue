<script setup lang="ts">
import { PropType, computed } from 'vue';

export type CardContainerMaterial = 'qwartz-primary' | 'qwartz-secondary';

const props = defineProps({
    material: {
        type: String as PropType<CardContainerMaterial>,
        default: 'qwartz-secondary'
    },
    fullWidth: {
        type: Boolean,
        default: false
    },
    withPadding: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        required: true
    }
});

const classes = computed(() => ({
    [props.material]: true,
    'full-width': props.fullWidth,
    'with-padding': props.withPadding
}));
</script>

<template>
    <div class="card-container" :class="classes">
        <div class="card-container__content">
            <slot></slot>
        </div>
        <div class="card-container__background">
            <img class="card-container__image" :src="image" />
        </div>
    </div>
</template>

<style scoped lang="css">
@import url('./CardContainerWithImage.css');
</style>
