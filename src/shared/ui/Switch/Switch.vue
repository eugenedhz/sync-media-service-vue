<script setup>
import { Switch } from '@headlessui/vue';

defineProps({
    modelValue: {
        type: String,
        required: true
    }
});
defineEmits(['update:modelValue']);
</script>

<template>
    <Switch
        class="switcher"
        :class="modelValue && 'switcher-enabled'"
        :value="modelValue"
        @click="$emit('update:modelValue', !modelValue)"
    >
        <span
            aria-hidden="true"
            class="switch"
            :class="modelValue && 'enabled'"
        />
    </Switch>
</template>

<style lang="css">
@import url('./Switch.css');
</style>