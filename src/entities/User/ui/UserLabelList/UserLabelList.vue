<script setup lang="ts">
import { PropType } from 'vue';
import { User } from '../../../model/types/user';
import { Column, Card } from '@/shared/ui';
import { __BASE_URL__ } from '@/shared/config/environment';
import { Skeleton } from 'vue-loading-skeleton';
import UserLabel from '../UserLabel/UserLabel.vue';

defineProps({
    users: {
        type: Array as PropType<User[]>
    },
    showName: {
        type: Boolean,
    },
    isLoading: {
        type: Boolean
    }
})
defineEmits([
    'user-click',
]);
</script>

<template>
    <Card :material="'qwartz-primary'" class="inline">
        <Column :align="'stretch'" :gap="'16'">
            <template v-for="user in users" :key="user.id">
                <UserLabel :show-name="showName" :user="user" @click="$emit('user-click', user)"/>
            </template>
        </Column>
    </Card>
</template>

<style lang="css" scoped>
@import url('./UserLabelList.css');
</style>
