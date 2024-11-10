<script setup lang="ts">
import { ref, PropType, computed } from 'vue';

import { useCreateRoomFormStore } from '../model/createRoomFormStore';

import { Room } from '@/entities/Room';

import { Card, Input, Row, Column, Button, Typography } from '@/shared/ui';
import { useRouter } from 'vue-router';
import { Routes } from '@/shared/consts/router';

const router = useRouter()
const createRoomFormStore = useCreateRoomFormStore();

const submitForm = async () => {
    let room = await createRoomFormStore.createRoom();
    if (room) {
        router.push({
            name: Routes.ROOM,
            params: {
                id: room.id
            }
        });
    };
    createRoomFormStore.resetForm();
};

</script>
<template>
    <Card
        :material="'qwartz-secondary'"
    >
        <template #header>
            <Row full-width>
                <Typography
                    :weight="600"
                    :size="'lg'"
                >
                    Новая комната
                </Typography>
            </Row>
        </template>
        <Column :width="'300'">
            <form @submit.prevent="submitForm">
                <Column :gap="'32'" :justify="'between'">
                    <Input
                        v-model="createRoomFormStore.title"
                        :placeholder="'Имя комнаты'"
                        full-width
                    />
                    <Button
                        type="submit"
                        full-width
                    >
                        создать
                    </Button>
                </Column>
            </form>
        </Column>
    </Card>
</template>
