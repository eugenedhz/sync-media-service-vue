<script setup lang="ts">
import {
    errorsFields,
    errorsServer
} from '../lib/validators/validationHandler';
import { useAuthFormStore } from '../model/authForm';
import { useAuthStore } from '../model/authStore';
import { AuthType } from '../model/types/auth';

import { Input, Row, Column, Button, Typography } from '@/shared/ui';

const props = defineProps({
    authType: {
        type: String as () => AuthType,
        default: 'signup'
    }
});

const authStore = useAuthStore();
const authFormStore = useAuthFormStore();

authFormStore.setAuthType(props.authType);
const { authContent } = authFormStore;




</script>
<template>
    <Column :gap="'32'" full-width class="auth-form">
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
            >{{ authContent.welcomeMsg }}
        </Typography>
        <form @submit.prevent="authFormStore.submitForm(authStore)">
            <Column :gap="'32'">
                <Column :gap="'16'" full-width>
                    <template v-if="errorsServer.size">
                        <Column>
                            <template
                                v-for="error in errorsServer"
                                :key="error"
                            >
                                <Typography
                                    :weight="400"
                                    :as="'p'"
                                    :size="'sm'"
                                >
                                    {{ error }}
                                </Typography>
                            </template>
                        </Column>
                    </template>
                    <Row :gap="'16'" full-width :justify="'between'">
                        <Input
                            v-model="authFormStore.username"
                            :placeholder="'Login'"
                            full-width
                            @input="
                                authFormStore.setUsername($event.target.value)
                            "
                            @click="authFormStore.serverErrorsClear('username')"
                        />
                        <template v-if="authFormStore.authType === 'signup'"
                            ><Input
                                v-model="authFormStore.displayName"
                                :placeholder="'Name'"
                                full-width
                                @input="
                                    authFormStore.setDisplayName(
                                        $event.target.value
                                    )
                                "
                        /></template>
                    </Row>
                    <template v-if="authFormStore.authType === 'signup'"
                        ><Input
                            v-model="authFormStore.email"
                            :placeholder="'example@ilow.me'"
                            :type="'email'"
                            full-width
                            @click="authFormStore.serverErrorsClear('email')"
                            @input="
                                authFormStore.setEmail($event.target.value)
                            "
                    /></template>
                    <Input
                        v-model="authFormStore.password"
                        :placeholder="'Password'"
                        :type="authFormStore.typeInputPassword"
                        full-width
                        icon-shown
                        @icon-click="authFormStore.togglePasswordVisibility"
                        @click="authFormStore.serverErrorsClear('password')"
                        @input="authFormStore.setPassword($event.target.value)"
                    />
                    <template v-if="authFormStore.authType === 'signup'">
                        <Input
                            v-model="authFormStore.repeatPassword"
                            :placeholder="'Password'"
                            :type="authFormStore.typeInputRepeatPassword"
                            full-width
                            icon-shown
                            @icon-click="
                                authFormStore.toggleRepeatPasswordVisibility
                            "
                            @input="
                                authFormStore.setRepeatPassword(
                                    $event.target.value
                                )
                            "
                        />
                    </template>
                    <template v-if="errorsFields.size">
                        <Column>
                            <Typography
                                v-for="error in errorsFields"
                                :key="error"
                                :weight="400"
                                :as="'p'"
                                :size="'sm'"
                            >
                                {{ error }}
                            </Typography>
                        </Column>
                    </template>
                </Column>
                <Button
                    :disabled="!authFormStore.isFormFilled || errorsFields.size != 0"
                    class="auth-btn"
                    type="submit"
                    full-width
                    >{{ authContent.buttonText }}</Button
                >
            </Column>
        </form>
        <RouterLink :to="authContent.route" @click="authFormStore.serverErrorsClear('all')"
            ><Typography
                :weight="500"
                :as="'p'"
                :align="'center'"
                :size="'md'"
                class="auth-link"
                >{{ authContent.linkText }}
            </Typography></RouterLink
        >
    </Column>
</template>
<style>
@import 'AuthForm.css';
</style>
