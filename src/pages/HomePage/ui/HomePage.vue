<template>
    <h1>Media</h1>
    {{ message }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { __BASE_URL__, __IS_DEV__ } from '@/shared/config/environment';

export default defineComponent({
    components: {},
    data() {
        return {
            message: __BASE_URL__,
            isDev: __IS_DEV__
        };
    }
});
</script>

<style>
@import './HomePage';
</style>