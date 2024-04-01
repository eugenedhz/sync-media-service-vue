import { RouteRecordRaw } from 'vue-router';

import { AuthPage } from '@/pages/AuthPage';
import { HomePage } from '@/pages/HomePage';
import { Routes, getRouteHome, getRouteAuth } from '@/shared/consts/router';

export const routes: RouteRecordRaw[] = [
    {
        path: getRouteHome(),
        name: Routes.HOME,
        component: HomePage
    },
    {
        path: getRouteAuth(),
        name: Routes.AUTH,
        component: AuthPage
    }
];
