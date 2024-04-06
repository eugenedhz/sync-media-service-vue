<script setup lang="ts">
import { PropType } from 'vue';

import Flex, { FlexAlign, FlexGap, FlexJustify } from '../Flex/Flex.vue';

defineProps({
    justify: {
        type: String as PropType<FlexJustify>,
        default: 'start'
    },
    align: {
        type: String as PropType<FlexAlign>,
        default: 'center'
    },
    gap: {
        type: String as PropType<FlexGap>,
        default: '4'
    },
    fullWidth: {
        type: Boolean
    }
});
</script>

<template>
    <Flex
        :direction="'column'"
        :align="align"
        :justify="justify"
        :gap="gap"
        :full-width="fullWidth"
    >
        <slot></slot>
    </Flex>
</template>
