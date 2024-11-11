import { RouteRecordRaw } from 'vue-router';

import { HomePage } from '@/pages/HomePage';
import { LogInPage } from '@/pages/LogInPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { Routes, getRouteHome, getRouteLogIn, getRouteProfile, getRouteRoom, getRouteSignUp } from '@/shared/consts/router';
import { RoomPage } from '@/pages/RoomPage';
import { ProfilePage } from '@/pages/ProfilePage';

export const routes: RouteRecordRaw[] = [
    {
        path: getRouteHome(),
        name: Routes.HOME,
        component: HomePage,
        meta: { requiresAuth: true }
    },
    {
        path: getRouteLogIn(),
        name: Routes.LOGIN,
        component: LogInPage,
        meta: { requiresAuth: false }
    },
    {
        path: getRouteSignUp(),
        name: Routes.SIGNUP,
        component: SignUpPage,
        meta: { requiresAuth: false }
    },
    {
        path: `${getRouteRoom()}/:id`,
        name: Routes.ROOM,
        component: RoomPage,
        meta: { requiresAuth: true }
    },
    {
        path: `${getRouteProfile()}/:username`,
        name: Routes.PROFILE,
        component: ProfilePage,
        meta: { requiresAuth: true }
    }
];
