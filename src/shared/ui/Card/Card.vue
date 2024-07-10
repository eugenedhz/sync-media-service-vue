<script setup lang="ts">
import { PropType, computed } from 'vue';

export type CardMaterial = 'glass' | 'qwartz-primary' | 'qwartz-secondary' | 'qwartz-inverted';
export type CardPadding = 'sm' | 'md' | 'none';

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
    padding: {
        type: String as PropType<CardPadding>,
        default: 'md'
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

const cardPadding: Record<CardPadding, string> = {
    sm: 'padding-sm',
    md: 'padding-md',
    none: 'padding-none'
}

const classes = computed(() => ({
    [props.material]: true,
    'full-width': props.fullWidth,
    'framed': props.framed
}));

const headerClasses = computed(() => ({
    'top-shadow': true,
    'with-padding': props.withPadding,
    [cardPadding[props.padding]]: true
}));

const contentClasses = computed(() => ({
    'with-padding': props.withPadding,
    [cardPadding[props.padding]]: true
}))

const footerClasses = computed(() => ({
    'with-padding': props.withPadding,
    [cardPadding[props.padding]]: true
}));

</script>

<template>
    <div class="card" :width="width" :height="height" :class="classes">
        <div v-if="$slots.header" :class="headerClasses">
            <slot name="header" ></slot>
        </div>
        <div v-if="$slots.default" :class="contentClasses">
            <slot ></slot>
        </div>
        <div v-if="$slots.footer" :class="footerClasses">
            <slot name="footer" ></slot>
        </div>
    </div>
</template>

<style class="css" scoped>
@import url('./Card.css');
</style>