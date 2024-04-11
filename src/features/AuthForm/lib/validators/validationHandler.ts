import { ref } from 'vue';

import { authValidationMessages } from './messages';

export const errorsFields = ref<Set<string>>(new Set());
export const errorsServer = ref<Set<string>>(new Set()); 

function validationUsername(username: string): void {
    const regexp = /^[a-zA-Z0-9._-]+$/;
    if (username.length > 30 || username.length < 5) {
        errorsFields.value.add(authValidationMessages.INVALID_LENGTH.USERNAME);
    } else {
        errorsFields.value.delete(authValidationMessages.INVALID_LENGTH.USERNAME);
    }
    if (!regexp.test(username)) {
        errorsFields.value.add(authValidationMessages.REGEXP_MISMATCH.USERNAME);
    } else {
        errorsFields.value.delete(authValidationMessages.REGEXP_MISMATCH.USERNAME);
    }
}

function validationDisplayName(displayName: string): void {
    if (displayName.length > 30) {
        errorsFields.value.add(authValidationMessages.INVALID_LENGTH.DISPLAY_NAME);
    } else {
        errorsFields.value.delete(authValidationMessages.INVALID_LENGTH.DISPLAY_NAME);
    }
}

function validationPassword(password: string): void {
    const regexp = /^[a-zA-Z0-9.@_-]+$/;
    if (password.length < 8) {
        errorsFields.value.add(authValidationMessages.INVALID_LENGTH.PASSWORD);
    } else {
        errorsFields.value.delete(authValidationMessages.INVALID_LENGTH.PASSWORD);
    }
    if (!regexp.test(password)) {
        errorsFields.value.add(authValidationMessages.REGEXP_MISMATCH.PASSWORD);
    } else {
        errorsFields.value.delete(authValidationMessages.REGEXP_MISMATCH.PASSWORD);
    }
}

function validationRepeatPassword(
    repeatPassword: string,
    password: string
): void {
    if (repeatPassword !== password) {
        errorsFields.value.add(authValidationMessages.PASSWORDS_NOT_MATCH);
    } else {
        errorsFields.value.delete(authValidationMessages.PASSWORDS_NOT_MATCH);
    }
}

export function validationAuthFields(
    fieldName: string,
    value: string,
    repeatPassword?: string
): void {
    switch (fieldName) {
    case 'username':
        validationUsername(value);
        break;
    case 'displayName':
        validationDisplayName(value);
        break;
    case 'password':
        validationPassword(value);
        break;
    case 'repeatPassword':
        if (repeatPassword !== undefined) {
            validationRepeatPassword(repeatPassword, value);
        }
        break;
    default:
        errorsFields.value.add(`Validation error in the field ${fieldName}`);
    }
}

export function validationAuth(error: string) {
    switch (error) {
    case 'USERNAME_ALREADY_EXISTS':
        errorsServer.value.add(authValidationMessages.USERNAME_ALREADY_EXISTS);
        break;
    case 'EMAIL_ALREADY_EXISTS':
        errorsServer.value.add(authValidationMessages.EMAIL_ALREADY_EXISTS);
        break;
    case 'USERNAME_NOT_FOUND':
        errorsServer.value.add(authValidationMessages.USERNAME_NOT_FOUND);
        break;
    case 'INCORRECT_PASSWORD':
        errorsServer.value.add(authValidationMessages.INCORRECT_PASSWORD);
        break;
    case 'USER_IS_BANNED':
        errorsServer.value.add(authValidationMessages.USER_IS_BANNED);
        break;
    default:
        errorsServer.value.add(error);
    }
}

export function validationAuthErrorClear(field: string) {
    switch(field){
    case 'username':
        errorsServer.value.delete(authValidationMessages.USERNAME_ALREADY_EXISTS);
        errorsServer.value.delete(authValidationMessages.USERNAME_NOT_FOUND);
        errorsServer.value.delete(authValidationMessages.USER_IS_BANNED);
        break;
    case 'email':
        errorsServer.value.delete(authValidationMessages.EMAIL_ALREADY_EXISTS);
        break;
    case 'password':
        errorsServer.value.delete(authValidationMessages.INCORRECT_PASSWORD);
        break;
    case 'all':
        errorsServer.value.delete(authValidationMessages.USERNAME_ALREADY_EXISTS);
        errorsServer.value.delete(authValidationMessages.USERNAME_NOT_FOUND);
        errorsServer.value.delete(authValidationMessages.USER_IS_BANNED);
        errorsServer.value.delete(authValidationMessages.EMAIL_ALREADY_EXISTS);
        errorsServer.value.delete(authValidationMessages.INCORRECT_PASSWORD);
        break;
    default:
        break;
    }
}