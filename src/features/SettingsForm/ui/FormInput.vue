<!-- CustomElement.vue -->

<template>
<ElementLayout>
    <template #element>
    <Input
        v-model="model"
    />
    </template>

    <template v-for="(component, slot) in elementSlots" #[slot]><slot :name="slot" :el$="el$"><component :is="component" :el$="el$"/></slot></template>
</ElementLayout>
</template>
  
<script>
import { Input } from '@/shared/ui';

import { ref } from 'vue'
import { defineElement } from '@vueform/vueform'

export default defineElement({
    name: 'FormInput',
})
</script>