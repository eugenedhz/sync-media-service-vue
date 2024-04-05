import axios from 'axios';

import { __BASE_URL__ } from '../config/environment';

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

        if (isStatusUnauthorized && isSameRequest && !isRetry) {
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
