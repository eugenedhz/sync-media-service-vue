import { RouteRecordRaw } from 'vue-router';

import { HomePage } from '@/pages/HomePage';
import { LogInPage } from '@/pages/LogInPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { Routes, getRouteHome, getRouteLogIn, getRouteSignUp } from '@/shared/consts/router';

export const routes: RouteRecordRaw[] = [
    {
        path: getRouteHome(),
        name: Routes.HOME,
        component: HomePage
    },
    {
        path: getRouteLogIn(),
        name: Routes.LOGIN,
        component: LogInPage
    },
    {
        path: getRouteSignUp(),
        name: Routes.SIGNUP,
        component: SignUpPage
    }
];
