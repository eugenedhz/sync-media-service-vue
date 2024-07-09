import { createRouter, createWebHistory } from 'vue-router';

import { routes } from '../config/routes';
import { Routes } from '@/shared/consts/router';
import { useUserStore } from '@/entities/User';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach(async (to) => {
    const userStore = useUserStore();
    
    await userStore.checkAuth();
    if (to.meta.requiresAuth && userStore.authData?.id) {
        return true
    }

    if (to.meta.requiresAuth && !userStore.authData?.id) {
        return { name: Routes.LOGIN }
    }

    if (!to.meta.requiresAuth && userStore.authData?.id) {
        return { name: Routes.HOME }
    }
})