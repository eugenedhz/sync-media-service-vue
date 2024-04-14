import { AuthType } from './types/authContent';

export const authContentAssigment = (authType: AuthType) => authType === 'signup'
    ? {
        welcomeMsg: 'Welcome!',
        buttonText: 'SIGN UP',
        linkText: 'Already have an account?',
        authType: 'signup',
        route: '/login'
    }
    : {
        welcomeMsg: 'Welcome Back!',
        buttonText: 'SIGN IN',
        linkText: 'New here?',
        authType: 'login',
        route: '/signup'
    };