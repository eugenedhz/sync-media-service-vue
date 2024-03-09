<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps({
    disabled: {
        type: Boolean,
        default: undefined,
    },
    fullWidth: {
        type: Boolean,
    }
});

const classes = {
    'full-width': props.fullWidth,
    'disabled': props.disabled,
};
</script>

<template>
    <input :disabled="disabled" :class="classes"/>
</template>

<style lang="css" scoped>
@import url('./Input.css');
</style>