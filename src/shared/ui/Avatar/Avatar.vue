<script setup lang="ts">
defineProps({
    width: {
        type: Number,
        default: 55
    },
    height: {
        type: Number,
        default: 55
    }
});
</script>

<template>
    <img :width="width" :height="height"/>
</template>


<style lang="css" scoped>
@import url('./Avatar.css');
</style>