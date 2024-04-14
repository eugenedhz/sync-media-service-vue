<script setup lang="ts">
import { ref, PropType, onMounted } from 'vue';

import { authContentAssigment } from '../lib/authContent/authContent';
import { AuthType } from '../lib/authContent/types/authContent';
import { errorsServer } from '../lib/validators/validationHandler';
import { useAuthFormStore } from '../model/authFormStore';

import { Input, Row, Column, Button, Typography } from '@/shared/ui';

const props = defineProps({
    type: {
        type: String as PropType<AuthType>,
        default: 'signup'
    }
});

const authFormStore = useAuthFormStore();

const authType = props.type;
const typeInputPassword = ref('password');
const typeInputRepeatPassword = ref('password');
const authContent = authContentAssigment(authType);

onMounted(() => {
    authFormStore.setIsFormFilled(authType);
});

const togglePasswordsVisibility = (passwordField: string) => {
    if (passwordField === 'password') {
        typeInputPassword.value =
            typeInputPassword.value === 'password' ? 'text' : 'password';
    } else {
        typeInputRepeatPassword.value =
            typeInputRepeatPassword.value === 'password' ? 'text' : 'password';
    }
};
</script>
<template>
    <Column :gap="'32'" full-width class="auth-form">
        <!--Вместо иконки для вида-->
        <Typography :weight="600" :as="'p'" :align="'center'" :size="'xxl'">
            ICON ilow
        </Typography>
        <Typography :weight="600" :as="'p'" :align="'center'" :size="'xl'">
            {{ authContent.welcomeMsg }}
        </Typography>
        <form @submit.prevent="authFormStore.submitForm(authType)">
            <Column :gap="'32'">
                <Column :gap="'16'" full-width>
                    <template v-if="errorsServer.size">
                        <Column>
                            <template v-for="error in errorsServer" :key="error">
                                <Typography :weight="400" :as="'p'" :size="'sm'">
                                    {{ error }}
                                </Typography>
                            </template>
                        </Column>
                    </template>
                    <Row :gap="'16'" full-width :justify="'between'">
                        <Input v-model="authFormStore.username" :placeholder="'Login'" full-width
                            @input="authFormStore.setIsFormFilled(authType)"
                            @click="authFormStore.serverErrorsClear('username')" />
                        <template v-if="authType === 'signup'">
                            <Input v-model="authFormStore.displayName" :placeholder="'Name'" full-width
                                @input="authFormStore.setIsFormFilled(authType)" />
                        </template>
                    </Row>
                    <template v-if="authType === 'signup'">
                        <Input v-model="authFormStore.email" :placeholder="'example@ilow.me'" :type="'email'" full-width
                            @click="authFormStore.serverErrorsClear('email')"
                            @input="authFormStore.setIsFormFilled(authType)" />
                    </template>
                    <Input v-model="authFormStore.password" :placeholder="'Password'" :type="typeInputPassword"
                        full-width icon-shown @icon-click="togglePasswordsVisibility('password')"
                        @click="authFormStore.serverErrorsClear('password')"
                        @input="authFormStore.setIsFormFilled(authType)" />
                    <template v-if="authType === 'signup'">
                        <Input v-model="authFormStore.repeatPassword" :placeholder="'Password'"
                            :type="typeInputRepeatPassword" full-width icon-shown
                            @icon-click="togglePasswordsVisibility('repeatPassword')"
                            @input="authFormStore.setIsFormFilled(authType)" />
                    </template>
                </Column>
                <Button :disabled="!authFormStore.isFormFilled || errorsServer.size != 0" type="submit" full-width>
                    {{ authContent.buttonText }}
                </Button>
            </Column>
        </form>
        <RouterLink :to="authContent.route" @click="authFormStore.serverErrorsClear('all')">
            <Typography :weight="500" :as="'p'" :align="'center'" :size="'md'" class="auth-link">
                {{ authContent.linkText }}
            </Typography>
        </RouterLink>
    </Column>
</template>
<style>
@import 'AuthForm.css';
</style>
