<script setup lang="ts">
import { PropType } from 'vue';

const buttonVariants = {
    FILLED: 'filled',
    CLEARED: 'cleared',
    OUTLINED: 'outlined',
    BLURED: 'blured'
} as const;

export type ButtonVariant = ValueOf<typeof buttonVariants>;

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
    }
});

const classes = {
    'full-width': props.fullWidth,
    'disabled': props.disabled,
    'square': props.square,
    [props.variant]: true,
};
</script>

<template>
    <button :disabled="disabled" type="button" :class="classes"> 
        <slot></slot>
    </button>
</template>

<style lang="css" scoped>
@import url('./Button.css');

</style>