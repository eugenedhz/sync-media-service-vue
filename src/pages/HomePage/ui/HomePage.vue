<template>
    <DynamicModuleLoader :modules="modules">
        {{ message }}
    </DynamicModuleLoader>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { exampleModule } from '../model/exampleModule';

import { __BASE_URL__, __IS_DEV__ } from '@/shared/config/environment';
import { DynamicModuleLoader, ModuleList } from '@/shared/lib/hooks';

export const modules: ModuleList = {
    example: exampleModule
};

export default defineComponent({
    components: {
        DynamicModuleLoader
    },
    data() {
        return {
            message: __BASE_URL__,
            isDev: __IS_DEV__,
            modules
        };
    },
});
</script>

<style>
@import './HomePage';
</style>