export const authValidationMessages = {
    USERNAME_ALREADY_EXISTS:
        'Username already exists, please choose another username.',
    EMAIL_ALREADY_EXISTS: 'Email already exists, please login.',
    USERNAME_NOT_FOUND: 'User not found, please register.',
    INCORRECT_PASSWORD: 'Incorrect password.',
    USER_IS_BANNED: 'User is banned.',
    PASSWORDS_NOT_MATCH: 'Passwords don`t match.',
    INVALID_LENGTH: {
        USERNAME:
            'Login length is invalid. Length of login is from 5 to 30 symbols.',
        DISPLAY_NAME:
            'Name length is invalid. Length of name is from 1 to 30 symbols.',
        PASSWORD:
            'Password length is invalid. Length of password is minimum 8 symbols.'
    },
    REGEXP_MISMATCH: {
        USERNAME:
            "Login format is invalid. Login can only consist of Latin letters, numbers and symbols: '.', '_', '-'",
        PASSWORD:
            "Password format is invalid. Password can only consist of Latin letters, numbers and symbols: '.', '@', '_', '-'"
    }
};
