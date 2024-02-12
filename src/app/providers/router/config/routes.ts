import { RouteRecordRaw } from 'vue-router';

import { HomePage } from '@/pages/HomePage';
import { Routes, getRouteHome } from '@/shared/consts/router';

export const routes: RouteRecordRaw[] = [
    {
        path: getRouteHome(),
        name: Routes.HOME,
        component: HomePage
    },
];