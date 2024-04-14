export type AuthType = 'signup' | 'login';

export interface AuthContent {
    welcomeMsg: string;
    buttonText: string;
    linkText: string;
    authType: AuthType;
    route: string;
}