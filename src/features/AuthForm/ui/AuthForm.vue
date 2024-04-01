<template>
    <div class="auth-form">
        <!--Вместо иконки для вида-->
        <Typography
            class="icon"
            :weight="600"
            :as="'p'"
            :align="'center'"
            :size="'xxl'"
            >ICON ilow
        </Typography>
        <Typography
            class="welcome-msg"
            :weight="600"
            :as="'p'"
            :align="'center'"
            :size="'xl'"
            >{{ authTypeContent.welcomeMsg }}
        </Typography>
        <form @submit.prevent="authTypeContent.authFunc">
            <Column :gap="'16'" full-width>
                <Row :gap="'16'" full-width :justify="'between'">
                    <Input
                        v-model="username"
                        :placeholder="'Login'"
                        full-width
                    />
                    <Input
                        v-if="authTypeContent.authType === 'signup'"
                        v-model="displayName"
                        :placeholder="'Name'"
                        full-width
                    />
                </Row>
                <Input
                    v-if="authTypeContent.authType === 'signup'"
                    v-model="email"
                    :placeholder="'example@ilow.me'"
                    :type-input="'email'"
                    full-width
                />
                <Input
                    v-model="password"
                    :placeholder="'Password'"
                    :type-input="typeInputPassword"
                    full-width
                    icon-shown
                    @icon-click="
                        () =>
                            (typeInputPassword =
                                typeInputPassword === 'password'
                                    ? 'text'
                                    : 'password')
                    "
                />
                <Input
                    v-if="authTypeContent.authType === 'signup'"
                    v-model="repeatPassword"
                    :placeholder="'Password'"
                    :type-input="typeInputRepeatPassword"
                    full-width
                    icon-shown
                    @icon-click="
                        () =>
                            (typeInputRepeatPassword =
                                typeInputRepeatPassword === 'password'
                                    ? 'text'
                                    : 'password')
                    "
                />
                <Typography
                    v-if="
                        password !== repeatPassword &&
                        authTypeContent.authType === 'signup'
                    "
                    :weight="400"
                    :as="'p'"
                    :align="'center'"
                    :size="'sm'"
                    >Error! Passwords do not match!</Typography
                >
            </Column>
            <Button
                :disabled="!authFilled.value"
                class="auth-btn"
                type="submit"
                full-width
                >{{ authTypeContent.buttonText }}</Button
            >
        </form>

        <Typography
            :weight="500"
            :as="'p'"
            :align="'center'"
            :size="'md'"
            class="auth-link"
            @click="authTypeForLink"
            >{{ authTypeContent.linkText }}
        </Typography>

        <!-- <Button @click="logout">LOG OUT</Button>
        потом убрать -->
    </div>
</template>
<script setup lang="ts">
import { ref, computed, PropType } from 'vue';

import { useAuthStore } from '../model/authStore';

import { Input, Row, Column, Button, Typography } from '@/shared/ui';

const authStore = useAuthStore();
export type AuthType = 'signup' | 'login';

const props = defineProps({
    authType: {
        type: String as PropType<AuthType>,
        default: 'signup'
    }
});

const username = ref('');
const displayName = ref('');
const email = ref('');
const password = ref('');
const repeatPassword = ref('');

const typeInputPassword = ref('password');
const typeInputRepeatPassword = ref('password');

async function authSignup() {
    try {
        await authStore.signup(
            displayName.value,
            email.value,
            password.value,
            username.value
        );
    } catch (error) {
        console.error('Signup failed: ', error);
    }
}

async function authLogin() {
    try {
        await authStore.login(password.value, username.value);
    } catch (error) {
        console.error('Login failed: ', error);
    }
}

const isFormFilledSignUp = computed(
    () =>
        username.value !== '' &&
        displayName.value !== '' &&
        email.value !== '' &&
        password.value !== '' &&
        repeatPassword.value !== '' &&
        password.value === repeatPassword.value
);

const isFormFilledLogin = computed(
    () => username.value !== '' && password.value !== ''
);

const signupContent = {
    welcomeMsg: 'Welcome!',
    buttonText: 'SIGN UP',
    linkText: 'Already have an account?',
    authType: 'signup',
    authFunc: authSignup
};

const loginContent = {
    welcomeMsg: 'Welcome Back!',
    buttonText: 'SIGN IN',
    linkText: 'New here?',
    authType: 'login',
    authFunc: authLogin
};

const authTypeContent = ref(
    props.authType === 'signup' ? signupContent : loginContent
);

const authFilled = computed(() =>
    authTypeContent.value.authType === 'signup'
        ? isFormFilledSignUp
        : isFormFilledLogin
);

function authTypeForLink() {
    authTypeContent.value =
        authTypeContent.value.authType === 'signup'
            ? loginContent
            : signupContent;
}

// async function logout() {
//     try {
//         await authStore.logout();
//     } catch (error) {
//         console.error('Logout failed: ', error);
//     }
// }
</script>
<style>
@import 'AuthForm.css';
</style>
