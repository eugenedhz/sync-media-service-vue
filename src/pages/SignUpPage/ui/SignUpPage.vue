<script setup lang="ts">
import { AuthForm } from '@/features/AuthForm';
import { Page } from '@/widgets/Page';
import { Column } from '@/shared/ui'
</script>
<template>
    <Page>
        <Column full-height :justify="'center'">
            <AuthForm :type="'signup'" />
        </Column>
    </Page>
</template>
<style>
</style>
