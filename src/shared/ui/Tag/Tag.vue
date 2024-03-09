<script setup lang="ts">
const props = defineProps({
    fullWidth: {
        type: Boolean,
    }
});

const classes = {
    'full-width': props.fullWidth,
};
</script>

<template>
    <span :class="classes"> 
        <slot></slot>
    </span>
</template>

<style lang="css" scoped>
@import url('./Tag.css');

</style>