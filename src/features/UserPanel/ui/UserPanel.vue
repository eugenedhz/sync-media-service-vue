<script lang="ts" setup>
import { Column, Row, Button, Typography, Input } from '@/shared/ui';

import { useUserPanelStore } from '../model/userPanelStore';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/entities/User';

const userPanelStore = useUserPanelStore();
const userStore = useUserStore();
onMounted(() => {
    if (userStore.authData?.description) {
        userPanelStore.description = userStore.authData?.description;
    }
});

const fileInput = ref<HTMLInputElement | null>(null);

const handleFileUpload = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

const processFile = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        const file = target.files[0];
        if (file.type !== 'image/jpeg') {
            return;
        }
        userPanelStore.avatar = file;
        userPanelStore.updateAvatar();
    }
};
</script>
<template>
    <Column full-width :gap="'32'">
        <Row full-width :justify="'between'" :align="'end'">
            <Row full-width :gap="'16'" :align="'start'">
                <img
                    class="user-panel-avatar"
                    :src="userStore.authData?.avatar"
                />
                <Column :align="'start'" :gap="'16'" full-width>
                    <Typography :size="'xxl'">{{
                        userStore.authData?.displayName
                    }}</Typography>
                    <Typography :size="'md'">{{
                        userStore.authData?.description
                    }}</Typography>
                </Column>
            </Row>
            <Row full-width :justify="'end'">
                <Button
                    class="user-panel-upload-photo-btn"
                    @click="handleFileUpload"
                    >Upload New Photo</Button
                >
                <input
                    ref="fileInput"
                    type="file"
                    style="display: none"
                    accept="image/jpeg"
                    @change="processFile"
                />
            </Row>
        </Row>
        <Row full-width :align="'start'" :gap="'32'">
            <Column full-width :gap="'32'">
                <Column full-width :align="'start'" :gap="'16'">
                    <Typography :size="'xl'">Display Name</Typography>
                    <Typography :size="'sm'"
                        >Choose name that make you shine!</Typography
                    >
                    <Row full-width :gap="'8'">
                        <Input
                            v-model="userPanelStore.displayName"
                            full-width
                            :placeholder="'Name'"
                        />
                        <!-- вместо иконки -->
                        <Button square @click="userPanelStore.updateDisplayName"
                            >Save</Button
                        >
                    </Row>
                </Column>
                <Column full-width :align="'start'" :gap="'16'">
                    <Typography :size="'xl'">About (optional)</Typography>
                    <Typography :size="'sm'"
                        >You can tell about your self.</Typography
                    >
                    <Row full-width :gap="'8'">
                        <Input
                            v-model="userPanelStore.description"
                            full-width
                        />
                        <!-- вместо иконки -->
                        <Button square @click="userPanelStore.updateDescription"
                            >Save</Button
                        >
                    </Row>
                </Column>
                <Column full-width :align="'start'" :gap="'16'">
                    <Typography :size="'xl'">Password</Typography>
                    <Typography :size="'sm'"
                        >Ensure use use right password for you Ilow
                        account.</Typography
                    >
                    <Row full-width :gap="'8'" :align="'end'">
                        <Column full-width :gap="'16'">
                            <Input
                                v-model="userPanelStore.password"
                                full-width
                                :placeholder="'Password'"
                            />
                            <Input
                                v-model="userPanelStore.repeatPassword"
                                full-width
                                :placeholder="'Check Password'"
                            />
                        </Column>
                        <!-- вместо иконки -->
                        <Button
                            :disabled="
                                userPanelStore.password !==
                                userPanelStore.repeatPassword
                            "
                            square
                            @click="userPanelStore.updatePassword"
                            >Save</Button
                        >
                    </Row>
                </Column>
            </Column>
            <Column full-width>
                <Column full-width :align="'start'" :gap="'16'">
                    <Typography :size="'xl'">Nickname</Typography>
                    <Typography :size="'sm'"
                        >Choose nick to standout.</Typography
                    >
                    <Row full-width :gap="'8'">
                        <Input
                            v-model="userPanelStore.username"
                            full-width
                            :placeholder="'@YouAreTheBest'"
                        />
                        <!-- вместо иконки -->
                        <Button square @click="userPanelStore.updateUsername"
                            >Save</Button
                        >
                    </Row>
                </Column>
            </Column>
        </Row>
        <Row full-width :justify="'end'">
            <Button :variant="'outlined'" @click="userPanelStore.deleteAccount"
                >DELETE ACCOUNT</Button
            >
        </Row>
    </Column>
</template>
<style scoped>
@import 'UserPanel.css';
</style>
