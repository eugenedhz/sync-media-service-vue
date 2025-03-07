<script setup lang="ts">
import { PropType, computed } from 'vue';

export type FlexJustify = 'start' | 'center' | 'end' | 'between';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch';
export type FlexDirection = 'row' | 'column';
export type FlexGap = '4' | '8' | '16' | '32' | '128';

const props = defineProps({
    justify: {
        type: String as PropType<FlexJustify>,
        default: 'start'
    },
    align: {
        type: String as PropType<FlexAlign>,
        default: 'center'
    },
    direction: {
        type: String as PropType<FlexDirection>,
        default: 'row'
    },
    gap: {
        type: String as PropType<FlexGap>,
        default: '4'
    },
    fullWidth: {
        type: Boolean
    },
    fullHeight: {
        type: Boolean
    }
});

const justifyClasses: Record<FlexJustify, string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
};

const alignClasses: Record<FlexAlign, string> = {
    start: 'align-start',
    center: 'align-center',
    end: 'align-end',
    stretch: 'align-stretch'
};

const directionClasses: Record<FlexDirection, string> = {
    row: 'direction-row',
    column: 'direction-column'
};

const gapClasses: Record<FlexGap, string> = {
    4: 'gap4',
    8: 'gap8',
    16: 'gap16',
    32: 'gap32',
    128: 'gap128'
};

const classes = computed(() => ({
    [justifyClasses[props.justify]]: true,
    [alignClasses[props.align]]: true,
    [directionClasses[props.direction]]: true,
    [gapClasses[props.gap]]: true,
    'full-width': props.fullWidth,
    'full-height': props.fullHeight
}));
</script>

<template>
    <div class="flex ilow-scroll" :class="classes">
        <slot></slot>
    </div>
</template>

<style lang="css" scoped>
@import url('./Flex.css');
@import url('@/app/styles/scrollbar.css');
</style>
