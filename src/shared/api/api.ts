import axios from 'axios';

import { __BASE_URL__ } from '../config/environment';
import { USER_LOCAL_STORAGE_KEY } from '../consts/localStorage';

export const api = axios.create({
    baseURL: __BASE_URL__,
    headers: {
        'Content-type': 'application/json'
    }
});

api.interceptors.response.use(
    (config) => config,

    async (error) => {
        const originalRequest = error.config;

        const isStatusUnauthorized = error.response.status === 401;
        const isSameRequest = originalRequest;
        const isRetry = error.config._isRetry;

        const loggedIn = localStorage.getItem(USER_LOCAL_STORAGE_KEY);

        if (isStatusUnauthorized && isSameRequest && !isRetry && loggedIn) {
            originalRequest._isRetry = true;
            try {
                await api.post(
                    '/auth/refresh',
                    {},
                    { withCredentials: true }
                );
                return api.request(originalRequest);
            } catch (e) {
                console.error('Refresh token error: ', e);
            }
        }
        else {
            localStorage.removeItem(USER_LOCAL_STORAGE_KEY); // если все токены истекли, чтобы не оставались данные пользователя в сторадже, мб это надо как-то где-то по-другому делать, но я сделала временное решение, чтобы не возникало жесткого бага при входе на сайт спустя некоторое время
        }
        throw error;
    }
);
