<template>
    <slot></slot>
</template>
<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { Module } from 'vuex';

import { StateSchema, StateSchemaKey } from '@/app/providers/store';

export type ModuleList = {
    [name in StateSchemaKey]?: Module<NonNullable<StateSchema[name]>, StateSchema>
}

export default defineComponent({
    props: {
        modules: {
            type: Object as PropType<ModuleList>,
            required: true
        },
        removeAfterUnmount: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
        Object.entries(this.modules).forEach(([path, module]) => {
            if (this.$store.hasModule(path)) {
                return;
            }
    
            this.$store.registerModule(path, module);
        });
    },
    unmounted() {
        if (this.removeAfterUnmount) {
            Object.entries(this.modules).forEach(([path]) => {
                this.$store.unregisterModule(path);
            });
        }
    }
});
</script>