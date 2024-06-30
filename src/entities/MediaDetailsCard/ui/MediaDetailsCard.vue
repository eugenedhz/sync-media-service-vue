<script setup lang="ts">
import { PropType } from 'vue';

import {
    Column,
    CardContainerWithImage,
    Row,
    Typography,
    Card
} from '@/shared/ui';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    tags: {
        type: Array as PropType<string[]>,
        required: true
    },
    subtitile: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});
</script>
<template>
    <CardContainerWithImage full-width :image="props.image">
        <Row :align="'start'" :justify="'between'">
            <Column :gap="'16'" class="media-details-card__content">
                <Typography :size="'xl'" :weight="600">{{
                    props.title
                }}</Typography>
                <Row :gap="'8'">
                    <template v-for="tag in props.tags" :key="tag">
                        <Card :material="'qwartz-primary'"
                            ><Typography
                                :size="'md'"
                                :weight="600"
                                :color="'pale'"
                            >
                                {{ tag }}</Typography
                            ></Card
                        >
                    </template>
                </Row>
                <Typography :size="'lg'" :weight="500" :color="'pale'"
                    >{{ props.subtitile }}
                </Typography>
            </Column>
            <Row>
                <!-- Тут будут иконки -->
                <Typography :size="'sm'">ICONS</Typography>
            </Row>
        </Row>
    </CardContainerWithImage>
</template>
<style scoped lang="css">
@import url('./MediaDetailsCard.css');
</style>
