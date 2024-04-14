import axios from 'axios';

import { __BASE_URL__ } from '../config/environment';
import { LOGGED_IN_LOCAL_STORAGE_KEY } from '../consts/localStorage';

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

        const loggedIn = localStorage.getItem(LOGGED_IN_LOCAL_STORAGE_KEY); // очань сомнительно, надеюсь не critical

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
        throw error;
    }
);
