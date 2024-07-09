<script setup lang="ts">
import { PropType } from 'vue';

import {
    Column,
    CardContainerWithImage,
    Row,
    Typography,
    Card,
    Tag
} from '@/shared/ui';
import { __BASE_URL__ } from '@/shared/config/environment'
import { Genre, Media } from '../../../api/requests';

const props = defineProps({
    media: {
        type: Object as PropType<Media>,
        required: true
    },
    genres: {
        type: Array as PropType<Genre[]>,
        default: [],
    }
});
</script>
<template>
    <CardContainerWithImage full-width :image="media.preview" class="card-height">
        <Row :align="'start'" :justify="'between'">
            <Column :gap="'16'" :align="'start'" class="half-width">
                <Typography :align="'start'" :size="'xl'" :weight="600">
                    {{ media?.name }}
                </Typography>
                <Row :gap="'8'">
                    <template v-for="genre in genres" :key="genre.id">
                        <Tag :size="'sm'">
                            <Typography
                                :weight="600"
                                :color="'pale'"
                            >
                                {{ genre.name }}
                            </Typography>
                        </Tag>
                    </template>
                </Row>
                    <Typography :weight="500" :color="'pale'" class="text-ellipsis">
                        {{ media?.description }}
                    </Typography>
            </Column>
            <Row>
                <Typography :size="'sm'">ICONS</Typography>
            </Row>
        </Row>
    </CardContainerWithImage>
</template>
<style scoped lang="css">
@import url('./MediaDetailsCard.css');
</style>
