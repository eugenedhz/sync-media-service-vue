export const Routes = {
    HOME: 'home',
    LOGIN: 'login',
    SIGNUP: 'signup',
} as const;

export type Route = ValueOf<typeof Routes>;

export const getRouteHome = () => '/';
export const getRouteLogIn = () => '/login';
export const getRouteSignUp = () => '/signup';
