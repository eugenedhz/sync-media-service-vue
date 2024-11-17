<script setup lang="ts">
import { ref, onUnmounted, onMounted, reactive, computed } from 'vue';

import { Card, Input, FileInput, Row, Column, Button, Typography, Avatar } from '@/shared/ui';
import { __BASE_URL__ } from '@/shared/config/environment';
import { useSettingsFormStore } from '../model/settingsFormStore';
import { useUserStore } from '@/entities/User';
import Save from '@/shared/assets/icons/save.svg?component';

import { validation } from '@/features/AuthForm/lib/validators/validationHandler';

const settingsFormStore = useSettingsFormStore();
const userStore = useUserStore()

const errors = reactive({
  username: '',
  password: '',
  description: '',
  displayName: '',
});

const isFormValid = computed(() => {
    return Object.values(errors).every((error) => error === '');
});

const buttonClass = ref('default-button')
const disabled = ref(false)

const validateField = (field: keyof typeof errors, value: string) => {
  let result: boolean | string;

  switch (field) {
    case 'username':
      result = validation.validationUsernameLenght(value as string);
      if (result === true) {
        result = validation.validationUsernameRegexp(value as string);
      }
      break;
    case 'password':
      result = validation.validationPasswordLenght(value as string);
      if (result === true) {
        result = validation.validationPasswordRegexp(value as string);
      }
      break;
    default:
      result = true;
  }

  errors[field] = typeof result === 'string' ? result : '';

  if (!isFormValid.value) {
    buttonClass.value = 'invalid-button'
    disabled.value = true
  } else {
    buttonClass.value = 'default-button'
    disabled.value = false
  }
};


const submitForm = async () => {
    let omit = []

    if (settingsFormStore.displayName === userStore.authData?.displayName || settingsFormStore.displayName === '') {
        omit.push('displayName')
    }
    if (settingsFormStore.username === userStore.authData?.username || settingsFormStore.username === '') {
        omit.push('username')
    }
    if (settingsFormStore.description === userStore.authData?.description || settingsFormStore.description === '') {
        omit.push('description')
    }
    if (settingsFormStore.password === '') {
        omit.push('password')
    }

    if (omit.length !== 4 || temporaryAvatar.value !== null) {
        let user = await settingsFormStore.updateProfile(omit);
        if (user !== undefined) {
            userStore.setUser(user);
            settingsFormStore.resetForm()
        };

        if (settingsFormStore.error !== undefined) {
            buttonClass.value = 'invalid-button'
            disabled.value = true
        } else {
            buttonClass.value = 'valid-button'
            disabled.value = true
        }
    }
};

const temporaryAvatar = ref<string | null>(null);
const handleFileInputChange = (file: File | null) => {
    if (file) {
        if (file.type !== 'image/jpeg') {
            settingsFormStore.avatar = undefined;
            alert('Пожалуйста, загрузите файл в формате JPG.');
            return; // Прерываем выполнение функции, если формат не соответствует
        }
        // Создаём временный URL для предварительного просмотра
        if (isFormValid.value) {
            buttonClass.value = 'default-button'
            disabled.value = false
        }
        temporaryAvatar.value = URL.createObjectURL(file);
        settingsFormStore.avatar = file; // Обновляем хранилище
    } else {
        temporaryAvatar.value = null;
    }
};

onMounted(() => {
    settingsFormStore.displayName = userStore.authData?.displayName || '';
    settingsFormStore.username = userStore.authData?.username || '';
    settingsFormStore.description = userStore.authData?.description || '';
});

onUnmounted(() => {
    if (temporaryAvatar.value) {
        URL.revokeObjectURL(temporaryAvatar.value);
    }
});

</script>
<template>
    <Card
        :material="'qwartz-primary'"
        full-width
    >
        <template #header>
            <Row full-width>
                <Typography
                    :weight="600"
                    :size="'xl'"
                >
                    Настройки профиля
                </Typography>
            </Row>
        </template>
        <form @submit.prevent="submitForm">
            <Column full-width :align="'center'" :justify="'center'">
                    <Card
                        :padding="'none'"
                        style="width: 80vw;"
                    >
                        <Row
                            :align="'start'"
                            :justify="'between'"
                            :gap="'16'"
                        >
                            <Column full-width style="max-width: 300px;">
                                <div class="avatar-container">
                                    <Avatar
                                        :width="'300'"
                                        :height="'300'"
                                        :src="temporaryAvatar || (__BASE_URL__ + userStore.authData?.avatar)"
                                    />
                                    <!-- Затемнение и иконка -->
                                    <div class="overlay">
                                        <Typography
                                            :size="'md'"
                                            :color="'pale'"
                                            :weight="500"
                                            :align="'center'"
                                            class="search-icon"
                                        >
                                            Обновить фото
                                        </Typography>
                                        </div>
                                    <!-- Невидимый FileInput -->
                                    <FileInput
                                        fullWidth
                                        v-model="settingsFormStore.avatar"
                                        accept=".jpg"
                                        class="hidden-input"
                                        @change="handleFileInputChange"
                                    />
                                </div>
                            </Column>
                            <Column
                                :align="'center'"
                                :justify="'center'"
                                full-width
                                full-height
                                style="max-height: 300px;"
                            >
                                <Row
                                    :align="'center'"
                                    :justify="'start'"
                                    :gap="'8'"
                                    class="input-row"
                                >
                                    <Typography
                                        :size="'md'"
                                        :weight="500"
                                        :align="'start'"
                                        class="label"
                                        :color="'pale'"
                                    >
                                        имя:
                                    </Typography>
                                    <Input
                                        :placeholder="'Крутое имя'"
                                        v-model="settingsFormStore.displayName"
                                        class="input-field"
                                        :max="'30'"
                                        @change="validateField('displayName', $event)"
                                    />
                                </Row>
                                <Row
                                    :align="'center'"
                                    :justify="'start'"
                                    :gap="'8'"
                                    class="input-row"
                                >
                                    <Typography
                                        :size="'md'"
                                        :weight="500"
                                        :align="'start'"
                                        :color="'pale'"
                                        class="label"
                                    >
                                        статус:
                                    </Typography>
                                    <Input
                                        :placeholder="'грустный статус'"
                                        v-model="settingsFormStore.description"
                                        class="input-field"
                                        :max="'19'"
                                        @change="validateField('description', $event)"
                                    />
                                </Row>
                                <Column>
                                    <Row
                                        :align="'center'"
                                        :justify="'start'"
                                        :gap="'8'"
                                        class="input-row"
                                    >
                                        <Typography
                                            :size="'md'"
                                            :weight="500"
                                            :align="'start'"
                                            class="label"
                                            :color="'pale'"
                                        >
                                            логин:
                                        </Typography>
                                        <Input
                                            :placeholder="'my_username'"
                                            v-model="settingsFormStore.username"
                                            class="input-field"
                                            :max="'30'"
                                            @change="validateField('username', $event)"
                                        />
                                    </Row>
                                    <Typography :size="'sm'" :weight="400"  :color="'red'" v-if="errors.username">
                                        {{ errors.username }}
                                    </Typography>
                                </Column>
                                <Column>
                                    <Row
                                        :align="'center'"
                                        :justify="'start'"
                                        :gap="'8'"
                                        class="input-row"
                                    >
                                        <Typography
                                            :size="'md'"
                                            :weight="500"
                                            :align="'start'"
                                            :color="'pale'"
                                            class="label"
                                        >
                                            новый пароль:
                                        </Typography>
                                        <Input
                                            :placeholder="'password'"
                                            v-model="settingsFormStore.password"
                                            class="input-field"
                                            :max="'19'"
                                            :type="'password'"
                                            @change="validateField('password', $event)"
                                        />
                                    </Row>
                                    <Typography :size="'sm'" :weight="400"  :color="'red'" v-if="errors.password">
                                        {{ errors.password }}
                                    </Typography>
                                </Column>
                            </Column>
                            <Button
                                type="submit"
                                :align="'end'"
                                square
                                :disabled="disabled"
                                :variant="'cleared'"
                                style="align-self: flex-start; margin-top: 4px; margin-right: 4px; padding: 4px;"
                            >
                                <Save :class="buttonClass"/>
                            </Button>
                        </Row>
                    </Card>
                <Typography :color="'red'">
                    {{ settingsFormStore.error }}
                </Typography>
            </Column>
        </form>
    </Card>
</template>
<style lang="css">
.default-button {
    fill: white; /* Устанавливаем белый цвет */
    transition: filter 0.2s ease; /* Плавное изменение яркости */
}

.default-button:hover {
    filter: brightness(0.8); /* Затемняем на 40% при нажатии */
}

.default-button:active {
    filter: brightness(0.6); /* Затемняем на 40% при нажатии */
}

.valid-button {
    fill: rgb(10, 133, 32); /* Устанавливаем белый цвет */
    transition: filter 0.2s ease; /* Плавное изменение яркости */
}

.invalid-button {
    fill: rgb(133, 10, 10); /* Устанавливаем белый цвет */
    transition: filter 0.2s ease; /* Плавное изменение яркости */
}

.avatar-container {
    position: relative;
    display: inline-block;
    width: 300px;
    height: 300px;
    overflow: hidden;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0); /* Прозрачность в обычном состоянии */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
    z-index: 5; /* Поверх аватарки */
}

.avatar-container:hover .overlay {
    background-color: rgba(0, 0, 0, 0.6); /* Затемнение при наведении */
}

.search-icon {
    opacity: 0; /* Скрыто в обычном состоянии */
    transition: opacity 0.3s ease;
}

.avatar-container:hover .search-icon {
    opacity: 1; /* Показывается при наведении */
}

.hidden-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0; /* Скрытие ввода */
    z-index: 10; /* Доступ для клика */
    padding: 0;
}

.input-row {
    display: flex;
    width: 40vw;
    align-items: center; /* Выравнивание по вертикали */
    gap: 4px; /* Пространство между элементами */
    margin-bottom: 8px; /* Отступ снизу для каждого поля */
}

.label {
    width: 146px; /* Фиксированная ширина для текста (имя, логин, статус) */
}

.input-field {
    flex-grow: 1; /* Инпут растягивается, чтобы занять оставшееся пространство */
}
</style>