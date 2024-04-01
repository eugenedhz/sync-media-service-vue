<script setup lang="ts">
import { PropType, computed } from 'vue';

export type TypographySize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type TypographyAlign = 'auto' | 'start' | 'center' | 'end' | 'justify';
export type TypographyWeight = 400 | 500 | 600 | 700;
export type TypographyColor = 'primary' | 'pale';

const props = defineProps({
    color: {
        type: String as PropType<TypographyColor>,
        default: 'primary'
    },
    size: {
        type: String as PropType<TypographySize>,
        default: 'md'
    },
    align: {
        type: String as PropType<TypographyAlign>,
        default: 'auto'
    },
    weight: {
        type: Number as PropType<TypographyWeight>,
        default: 400
    },
    as: {
        type: String,
        default: 'p'
    },
    fullWidth: {
        type: Boolean
    },
    uppercase: {
        type: Boolean
    }
});

const textSize: Record<TypographySize, string> = {
    sm: 'size-sm',
    md: 'size-md',
    lg: 'size-lg',
    xl: 'size-xl',
    xxl: 'size-xxl',
};

const textAlign: Record<TypographyAlign, string> = {
    'auto': 'align-auto',
    'start': 'align-start',
    'center': 'align-center',
    'end': 'align-end',
    'justify': 'align-justify'
};

const textWeight: Record<TypographyWeight, string> = {
    400: 'weight-400',
    500: 'weight-500',
    600: 'weight-600',
    700: 'weight-700'
};

const classes = computed(() => ({
    [textWeight[props.weight]]: true,
    [textAlign[props.align]]: true,
    [textSize[props.size]]: true,
    'uppercase': props.uppercase,
    'full-width': props.fullWidth,
}));
</script>

<template>
    <as class="typography" :class="classes">
        <slot></slot>
    </as>
</template>


<style lang="css" scoped>
@import url('./Typography.css');
</style>