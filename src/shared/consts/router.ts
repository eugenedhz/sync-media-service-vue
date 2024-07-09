export const Routes = {
    HOME: 'home',
    LOGIN: 'login',
    SIGNUP: 'signup',
    ROOM: 'room',
    PROFILE: 'profile'
} as const;

export type Route = ValueOf<typeof Routes>;

export const getRouteHome = () => '/';
export const getRouteLogIn = () => '/login';
export const getRouteSignUp = () => '/signup';
export const getRouteRoom = () => '/room';
export const getRouteProfile = () => '/profile';
