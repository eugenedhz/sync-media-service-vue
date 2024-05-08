import { authValidationMessages } from './messages';

const validationUsernameLenght = (
    username: string
): boolean | string => {
    if (username.length > 30 || username.length < 5) {
        return authValidationMessages.INVALID_LENGTH.USERNAME;
    }
    return true;
};

const validationUsernameRegexp = (
    username: string
): boolean | string => {
    const regexp = /^[a-zA-Z0-9._-]+$/;
    if (!regexp.test(username)) {
        return authValidationMessages.REGEXP_MISMATCH.USERNAME;
    }
    return true;
};

const validationDisplayName = (
    displayName: string
): boolean | string => {
    if (displayName.length > 30) {
        return authValidationMessages.INVALID_LENGTH.DISPLAY_NAME;
    }
    return true;
};

const validationPasswordLenght = (
    password: string
): boolean | string => {
    if (password.length < 8) {
        return authValidationMessages.INVALID_LENGTH.PASSWORD;
    }
    return true;
};

const validationPasswordRegexp = (
    password: string
): boolean | string => {
    const regexp = /^[a-zA-Z0-9.@_-]+$/;
    if (!regexp.test(password)) {
        return authValidationMessages.REGEXP_MISMATCH.PASSWORD;
    }
    return true;
};

const validationRepeatPassword = (
    params: {repeatPassword: string, password: string}
): boolean | string => {
    if (params.repeatPassword !== params.password) {
        return authValidationMessages.PASSWORDS_NOT_MATCH;
    }
    return true;
};



export const validation = {
    validationUsernameLenght,
    validationUsernameRegexp,
    validationDisplayName,
    validationPasswordLenght,
    validationPasswordRegexp,
    validationRepeatPassword
};

export const validationRequests = (error: string | undefined) => {
    switch (error) {
    case 'USERNAME_ALREADY_EXISTS':
        return authValidationMessages.USERNAME_ALREADY_EXISTS;
    case 'EMAIL_ALREADY_EXISTS':
        return authValidationMessages.EMAIL_ALREADY_EXISTS;
    case 'USERNAME_NOT_FOUND':
        return authValidationMessages.USERNAME_NOT_FOUND;
    case 'INCORRECT_PASSWORD':
        return authValidationMessages.INCORRECT_PASSWORD;
    case 'USER_IS_BANNED':
        return authValidationMessages.USER_IS_BANNED;
    default:
        return error;
    }
};
