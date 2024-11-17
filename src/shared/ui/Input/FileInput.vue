<script lang="ts" setup>
import { computed, defineProps } from 'vue';

defineEmits([
    'update:modelValue', 
    'iconClick', 
    'blur',
    'focus',
    'change'
]);
const props = defineProps({
    disabled: {
        type: Boolean,
        default: undefined
    },
    fullWidth: {
        type: Boolean
    },
    placeholder: {
        type: String,
        default: ''
    },
    iconShown: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'file'
    }
});

const classes = computed(() => ({
    'full-width': props.fullWidth,
}));
</script>

<template>
    <div class="input-container" :disabled="disabled" :class="{ disabled: props.disabled, ...classes }">
        <input
            :disabled="disabled"
            :class="classes"
            :placeholder="placeholder"
            :type="type"
            @blur="$emit('blur')"
            @focus="$emit('focus')"
            
            @input="
                $emit(
                    'update:modelValue',
                    ($event.target as HTMLInputElement).files?.[0] || undefined
                );
                $emit(
                    'change',
                    ($event.target as HTMLInputElement).files?.[0] || undefined
                )
            "
        />
        <template v-if="iconShown">
            <button type="button" @click="$emit('iconClick')">
                <slot></slot>
            </button>
        </template>
    </div>
</template>

<style lang="css" scoped>
input {
    background: none;
    border: none;
    font: var(--font-s);
    font-weight: 600;
    text-shadow: var(--text-shadow);
    outline: none;
    color: var(--qwarz-light-primary);
}

input::placeholder {
    color: rgb(var(--qwarz-light-primary-value) / 80%);
}

.input-container {
    display: inline-flex;
    gap: 16px;
    backdrop-filter: var(--blur);
    box-shadow: var(--shadow);
    background: rgb(var(--qwarz-dark-primary-value) / 25%);
    border: var(--border-sm) solid rgb(var(--qwarz-light-tertiary-value) / 30%);
    border-radius: 15px;
    padding: 0;
    transition: var(--transition-speed-fast);
}

.input-container:hover {
    background-color: rgba(var(--qwarz-dark-secondary-value) 0.3);
    color: var(--qwarz-light-secondary);
    backdrop-filter: var(--blur-hover);
}

.input-container:active {
    background-color: rgba(var(--qwarz-dark-tertiary-value) 0.3);
    color: var(--qwarz-light-tertiary);
    backdrop-filter: var(--blur-press);
}

.full-width {
    width: 100%;
}

.disabled {
    cursor: not-allowed;
    background: rgb(var(--qwarz-dark-secondary-value) / 80%);
    color: rgb(var(--qwarz-light-primary-value) / 60%);
}

button {
    border: none;
    outline: none;
    background: none;
    height: 16px;
    aspect-ratio: 1;
}


</style>
