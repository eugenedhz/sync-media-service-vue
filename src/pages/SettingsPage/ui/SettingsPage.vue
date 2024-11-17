<script setup lang="ts">
import { SettingsForm } from '@/features/SettingsForm';
import { Page } from '@/widgets/Page';
import { Column } from '@/shared/ui'
import { SearchBar } from '@/widgets/SearchBar'
</script>

<template>
    <div class="background">
        <Page>
            <Column :align="'start'" :gap="'32'" class="padding">
                <SearchBar/>
            </Column>
        </Page>
        <div class="dark">
            <Page>
                <SettingsForm/>
            </Page>
        </div>
    </div> 
</template>

<style scoped lang="css">
.background {
    background:  linear-gradient(135deg, #000000, #441f84);
    min-height: 100vh;
}

.dark {
    background: var(--qwarz-dark-primary);
    border-radius: 20px;
    min-height: 100vh;
}

html {
    background: var(--qwarz-dark-secondary);
}

.padding {
    padding: 16px 32px;
    padding-top: 0;
}
</style>