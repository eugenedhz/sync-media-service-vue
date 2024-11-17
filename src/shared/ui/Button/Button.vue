<script setup lang="ts">
import { PropType, computed } from 'vue';

const buttonVariants = {
    FILLED: 'filled',
    CLEARED: 'cleared',
    OUTLINED: 'outlined',
    BLURED: 'blured'
} as const;

export type ButtonVariant = ValueOf<typeof buttonVariants>;
export type TypographySize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const props = defineProps({
    disabled: {
        type: Boolean,
        default: undefined,
    },
    variant: {
        type: String as PropType<ButtonVariant>,
        default: 'filled'
    },
    fullWidth: {
        type: Boolean,
    },
    square: {
        type: Boolean
    },
    size: {
        type: String as PropType<TypographySize>,
        default: 'md'
    },
});

const textSize: Record<TypographySize, string> = {
    sm: 'size-sm',
    md: 'size-md',
    lg: 'size-lg',
    xl: 'size-xl',
    xxl: 'size-xxl',
};

const classes = computed(() => ({
    'full-width': props.fullWidth,
    'disabled': props.disabled,
    'square': props.square,
    [props.variant]: true,
}));

const slotClasses = computed(() => ({
    [textSize[props.size]]: true,
}));
</script>

<template>
    <button :disabled="disabled" type="button" :class="classes">
        <div :class="slotClasses">
            <slot></slot>
        </div> 
    </button>
</template>

<style lang="css" scoped>
@import url('./Button.css');
</style>