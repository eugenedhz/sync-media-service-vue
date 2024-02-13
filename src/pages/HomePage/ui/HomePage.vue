<template>
    <h1>Media</h1>
    {{ message }}
    <h2>Service</h2>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { __BASE_URL__ } from '@/shared/config/environment';

export default defineComponent({
    data() {
        return {
            message: __BASE_URL__
        };
    }
});
</script>

<style>
@import './HomePage';
</style>