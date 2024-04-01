export const Routes = {
    HOME: 'home',
    AUTH: 'auth'
} as const;

export type Route = ValueOf<typeof Routes>;

export const getRouteHome = () => '/';
export const getRouteAuth = () => '/auth';
