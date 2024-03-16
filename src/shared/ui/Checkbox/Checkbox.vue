<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue';

defineEmits(['check']);
defineProps({
    name: {
        type: String,
        default: 'checkbox',
        required: true
    },
    checked: {
        type: Boolean
    }
});
</script>

<template>
    <label :for="name" :title="name" >
        <input
            :id="name"
            class="checkbox"
            type="checkbox"
            @change="$emit('check', { name, checked })"
        />
        <span class="dot"></span>
    </label>
</template>

<style style="css" scoped>
@import url('./Checkbox.css');
</style>
