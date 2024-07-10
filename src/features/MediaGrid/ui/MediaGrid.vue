<script setup lang="ts">
import { ref, PropType, Ref } from 'vue';
import { MediaWithGenres } from '@/entities/Media/api/requests';
import { MediaCard, MediaDetailsCard } from '@/entities/Media';
import { Row, Card, Column, Typography } from '@/shared/ui';

const selectedMedia = ref<MediaWithGenres | undefined>(undefined);

const selectMedia = (media: MediaWithGenres) => {
    selectedMedia.value = media;
}

const isMediaIdMatchesToMediaRow = (id: number, medias: MediaWithGenres[]) => {
    return medias.some((media) => media.id === id);
}


defineProps({
    mediaRows: {
        type: Array as PropType<MediaWithGenres[][]>
    },
    material: {
        type: String as PropType<'glass' | 'qwartz-primary'>,
        default: 'qwartz-primary'
    }
});

const emit = defineEmits([
    'addMedia'
])
</script>

<template>
    <template v-if="mediaRows && mediaRows?.[0]?.length > 0">
        <Card :material="material" :with-padding="false">
        <Column class="padding" :gap="'32'" :align="'start'" :justify="'start'">
            <Typography :size="'xl'" :weight="600" class="media-padding">
                <slot></slot>
            </Typography>
            <Column  :gap="'32'">
                <template v-for="medias in mediaRows">
                    <template v-if="medias.length > 0">
                        <div class="row">
                            <Row :gap="'16'" class="media-overflow media-padding">
                                <template v-for="media in medias" :key="media.id">
                                    <MediaCard :media="media" @click="selectMedia(media)" />
                                </template>
                            </Row>
                        </div>
                        <template v-if="selectedMedia && isMediaIdMatchesToMediaRow(selectedMedia.id, medias)">
                            <div class="media-padding">
                                <MediaDetailsCard @icon-click="emit('addMedia', $event)" :media="selectedMedia" :genres="selectedMedia?.genres" />
                            </div>
                        </template>
                    </template>
                </template>
            </Column>
        </Column>
        </Card>
    </template>
</template>

<style scoped>
@import url('./MediaGrid.css');
</style>