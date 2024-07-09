<script setup lang="ts">
import { ref, PropType, computed } from 'vue';

import { authValidationMessages } from '../lib/validators/messages';
import { useAuthFormStore } from '../model/authFormStore';
import { loginContent, signupContent } from '../model/constans/authContent';
import { AuthType } from '../model/types/authType';

import { useFormValidation } from '@/shared/lib/hooks/useFormValidation';
import { Input, Row, Column, Button, Typography } from '@/shared/ui';
import { useRouter } from 'vue-router';
import { Routes } from '@/shared/consts/router'

const props = defineProps({
    type: {
        type: String as PropType<AuthType>,
        default: 'signup'
    }
});


const router = useRouter()
const authFormStore = useAuthFormStore();

const authType = props.type;
const isPasswordVisible = ref(false);
const isRepeatPasswordVisible = ref(false);
const authContent = computed(() =>
    authType === 'signup' ? signupContent : loginContent
);

const signupValidation = computed(() => ({
    username: {
        value: authFormStore.username,
        validations: [
            (username: string): boolean | string => {
                if (username.length > 30 || username.length < 5) {
                    return authValidationMessages.INVALID_LENGTH.USERNAME;
                }
                return true;
            },
            (username: string): boolean | string => {
                const regexp = /^[a-zA-Z0-9._-]+$/;
                if (!regexp.test(username)) {
                    return authValidationMessages.REGEXP_MISMATCH.USERNAME;
                }
                return true;
            }
        ]
    },
    displayName: {
        value: authFormStore.displayName,
        validations: [
            (displayName: string): boolean | string => {
                if (displayName.length > 30) {
                    return authValidationMessages.INVALID_LENGTH.DISPLAY_NAME;
                }
                return true;
            }
        ]
    },
    password: {
        value: authFormStore.password,
        validations: [
            (password: string): boolean | string => {
                if (password.length < 8) {
                    return authValidationMessages.INVALID_LENGTH.PASSWORD;
                }
                return true;
            },
            (password: string): boolean | string => {
                const regexp = /^[a-zA-Z0-9.@_-]+$/;
                if (!regexp.test(password)) {
                    return authValidationMessages.REGEXP_MISMATCH.PASSWORD;
                }
                return true;
            }
        ]
    },
    repeatPassword: {
        value: {
            repeatPassword: authFormStore.repeatPassword,
            password: authFormStore.password
        },
        validations: [
            (params: {
                repeatPassword: string;
                password: string;
            }): boolean | string => {
                if (params.repeatPassword !== params.password) {
                    return authValidationMessages.PASSWORDS_NOT_MATCH;
                }
                return true;
            }
        ]
    }
}));

const loginValidation = computed(() => ({
    username: {
        value: authFormStore.username,
        validations: [
            (username: string): boolean | string => {
                if (username.length > 30 || username.length < 5) {
                    return authValidationMessages.INVALID_LENGTH.USERNAME;
                }
                return true;
            },
            (username: string): boolean | string => {
                const regexp = /^[a-zA-Z0-9._-]+$/;
                if (!regexp.test(username)) {
                    return authValidationMessages.REGEXP_MISMATCH.USERNAME;
                }
                return true;
            }
        ]
    },
    password: {
        value: authFormStore.password,
        validations: [
            (password: string): boolean | string => {
                if (password.length < 8) {
                    return authValidationMessages.INVALID_LENGTH.PASSWORD;
                }
                return true;
            },
            (password: string): boolean | string => {
                const regexp = /^[a-zA-Z0-9.@_-]+$/;
                if (!regexp.test(password)) {
                    return authValidationMessages.REGEXP_MISMATCH.PASSWORD;
                }
                return true;
            }
        ]
    }
}));

const authValidation = computed(() =>
    authType === 'signup' ? signupValidation : loginValidation
);

const { errors, onBlur, onFocus, onChange, isFormDirty, isFormValid } =
    useFormValidation(computed(() => authValidation.value.value));

const togglePasswordsVisibility = (passwordField: string) => {
    if (passwordField === 'password') {
        isPasswordVisible.value = !isPasswordVisible.value;
        return;
    }
    isRepeatPasswordVisible.value = !isRepeatPasswordVisible.value;
};

const submitForm = async () => {
    if (authType === 'signup') {
        await authFormStore.signup();
    } else {
        await authFormStore.login();
    }
    router.push({ name: Routes.HOME })
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
                        <Input
                            v-model="authFormStore.username"
                            :placeholder="'Login'"
                            full-width
                            @blur="onBlur('username')"
                            @focus="onFocus('username')"
                            @change="onChange('username')"
                        />
                        <template v-if="authType === 'signup'">
                            <Input
                                v-model="authFormStore.displayName"
                                :placeholder="'Name'"
                                full-width
                                @blur="onBlur('displayName')"
                                @focus="onFocus('displayName')"
                                @change="onChange('displayName')"
                            />
                        </template>
                    </Row>
                    <template v-if="authType === 'signup'">
                        <Input
                            v-model="authFormStore.email"
                            :placeholder="'example@ilow.me'"
                            :type="'email'"
                            full-width
                        />
                    </template>
                    <Input
                        v-model="authFormStore.password"
                        :placeholder="'Password'"
                        :type="isPasswordVisible ? 'text' : 'password'"
                        full-width
                        icon-shown
                        @icon-click="togglePasswordsVisibility('password')"
                        @blur="onBlur('password')"
                        @focus="onFocus('password')"
                        @change="onChange('password')"
                    />
                    <template v-if="authType === 'signup'">
                        <Input
                            v-model="authFormStore.repeatPassword"
                            :placeholder="'Password'"
                            :type="
                                isRepeatPasswordVisible ? 'text' : 'password'
                            "
                            full-width
                            icon-shown
                            @icon-click="
                                togglePasswordsVisibility('repeatPassword')
                            "
                            @blur="onBlur('repeatPassword')"
                            @focus="onFocus('repeatPassword')"
                            @change="onChange('repeatPassword')"
                        />
                    </template>
                    <Column>
                        <template v-for="error in errors" :key="error">
                            <template v-for="er in error.errors" :key="er">
                                <Typography :size="'sm'" :align="'start'">{{
                                    er
                                }}</Typography>
                            </template>
                        </template>
                    </Column>
                </Column>
                <Button
                    type="submit"
                    full-width
                    :disabled="!isFormValid || !isFormDirty"
                >
                    {{ authContent.buttonText }}
                </Button>
                <Typography :size="'sm'" :align="'start'">{{
                    authFormStore.error
                }}</Typography>
            </Column>
        </form>
        <RouterLink :to="authContent.route" @click="authFormStore.resetForm">
            <Typography :weight="500" :align="'center'" class="auth-link">
                {{ authContent.linkText }}
            </Typography>
        </RouterLink>
    </Column>
</template>
<style>
@import 'AuthForm.css';
</style>
