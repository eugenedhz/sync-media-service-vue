<script setup lang="ts">
import { PropType } from 'vue';
import { Media } from '../../api/requests';
import { __BASE_URL__ } from '@/shared/config/environment'
import { Image } from '@/shared/ui'

defineProps({
    media: {
        type: Object as PropType<Media>,
        required: true
    }
})
</script>

<template>
    <Image 
        :width="255"
        :height="333"
        :src="media.thumbnail"
        style="cursor: pointer;"
    />
</template>

<style scoped>
@import url('./MediaCard.css');
</style>