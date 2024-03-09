<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue';


defineEmits(['update:modelValue']);
const props = defineProps({
    name: {
        type: String,
        default: 'checkbox',
        required: true
    },
    modelValue: {
        type: Boolean,
        default: false
    }
});


</script>

<template>
    <label :for="name" :title="name">
        <input
            :id="name"
            class="checkbox"
            type="checkbox"
            :value="modelValue"
            @change="$emit('update:modelValue', !modelValue)"
        />
        <span class="dot"></span>
    </label>
</template>

<style style="css" scoped>
@import url('./Checkbox.css');
</style>
