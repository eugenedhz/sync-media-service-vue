<script setup lang="ts">
import { ref, PropType, computed } from 'vue';

import { useAuthFormStore } from '../model/authFormStore';
import { loginContent, signupContent } from '../model/constans/authContent';
import { AuthType } from '../model/types/authType';

import { Input, Row, Column, Button, Typography } from '@/shared/ui';

const props = defineProps({
    type: {
        type: String as PropType<AuthType>,
        default: 'signup'
    }
});

const authFormStore = useAuthFormStore();

const authType = computed(() => props.type);
const isPasswordVisible = ref(false);
const isRepeatPasswordVisible = ref(false);
const authContent = computed(() => authType.value === 'signup' ? signupContent : loginContent);

const togglePasswordsVisibility = (passwordField: string) => {
    if (passwordField === 'password') {
        isPasswordVisible.value = !isPasswordVisible.value;
    } else {
        isRepeatPasswordVisible.value = !isRepeatPasswordVisible.value;
    }
};

const submitForm = () => {
    if (authType.value === 'signup') {
        authFormStore.signup();
    } else {
        authFormStore.login();
    }
};
</script>
<template>
    <Column :gap="'32'" full-width class="auth-form">
        <!--Вместо иконки для вида-->
        <Typography :weight="600" :align="'center'" :size="'xxl'">
            ICON ilow
        </Typography>
        <Typography :weight="600" :align="'center'" :size="'xl'">
            {{ authContent.welcomeMsg }}
        </Typography>
        <form @submit.prevent="submitForm">
            <Column :gap="'32'">
                <Column :gap="'16'" full-width>
                    <Row :gap="'16'" full-width :justify="'between'">
                        <Input v-model="authFormStore.username" :placeholder="'Login'" full-width />
                        <template v-if="authType === 'signup'">
                            <Input v-model="authFormStore.displayName" :placeholder="'Name'" full-width />
                        </template>
                    </Row>
                    <template v-if="authType === 'signup'">
                        <Input v-model="authFormStore.email" :placeholder="'example@ilow.me'" :type="'email'"
                            full-width />
                    </template>
                    <Input v-model="authFormStore.password" :placeholder="'Password'"
                        :type="isPasswordVisible ? 'text' : 'password'" full-width icon-shown
                        @icon-click="togglePasswordsVisibility('password')" />
                    <template v-if="authType === 'signup'">
                        <Input v-model="authFormStore.repeatPassword" :placeholder="'Password'"
                            :type="isRepeatPasswordVisible ? 'text' : 'password'" full-width icon-shown
                            @icon-click="togglePasswordsVisibility('repeatPassword')" />
                    </template>
                </Column>
                <Button type="submit" full-width>
                    {{ authContent.buttonText }}
                </Button>
            </Column>
        </form>
        <RouterLink :to="authContent.route">
            <Typography :weight="500" :align="'center'" class="auth-link">
                {{ authContent.linkText }}
            </Typography>
        </RouterLink>
    </Column>
</template>
<style>
@import 'AuthForm.css';
</style>
