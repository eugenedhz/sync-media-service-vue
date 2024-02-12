export const Routes = {
    HOME: 'home'
} as const;

export type Route = ValueOf<typeof Routes>;

export const getRouteHome = () => '/';
