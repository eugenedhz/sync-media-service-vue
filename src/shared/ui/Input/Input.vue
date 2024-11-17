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
    modelValue: {
        type: String,
        default: ''
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
        default: 'text'
    },
    max: {
        type: String,
        default: ''
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
            :value="modelValue"
            :placeholder="placeholder"
            :type="type"
            :maxlength="max"
            @blur="$emit('blur')"
            @focus="$emit('focus')"

            @input="
                $emit(
                    'update:modelValue',
                    ($event.target as HTMLInputElement).value
                );
                $emit(
                    'change',
                    ($event.target as HTMLInputElement).value
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
@import url('./Input.css');
</style>
