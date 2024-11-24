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
                const response = await api.post(
                    '/auth/refresh',
                    {},
                    { withCredentials: true }
                );

                localStorage.setItem(USER_LOCAL_STORAGE_KEY, response.data)

                return api.request(originalRequest);
            } catch (e) {
                localStorage.clear()
                return api.request(originalRequest);
            }
        }
        
        throw error;
    }
);
