<script setup lang="ts">
import { AuthForm } from '@/features/AuthForm';
import { Page } from '@/widgets/Page';
</script>
<template>
    <Page>
        <AuthForm :auth-type="'signup'"/>
    </Page>
</template>
<style></style>
