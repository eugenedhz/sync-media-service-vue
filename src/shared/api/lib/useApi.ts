import { AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios';
import { _GettersTree, defineStore } from 'pinia';

import { api } from '..';
import { ApiError } from '../types/apiError';


export interface ApiSchema<Entity> {
    data?: Entity;
    error?: string;
    isLoading: boolean;
}

export interface _ApiGetterSchema<Entity> extends _GettersTree<ApiSchema<Entity>>{
}

export interface ApiActionsSchema<Entity, Body> {
    _setData(data?: Entity): void;
    _setError(error?: string): void; 
    _setIsLoading(isLoading: boolean): void;
    initiate(body: Body extends Record<string, any> ? Body : void, options?: AxiosRequestConfig<Body>): Promise<Entity | undefined>; 
}

export const buildApi = <Entity, Body = void>(
    namespace: string,
    config: AxiosRequestConfig<Body>
) => defineStore<string, ApiSchema<Entity>, _ApiGetterSchema<Entity>, ApiActionsSchema<Entity, Body>>(
    namespace,
    {
        state: (): ApiSchema<Entity> => ({
            data: undefined,
            error: undefined,
            isLoading: false
        }),
        actions: {
            _setData(data) {
                this.$patch({
                    data
                });
            },
            _setError(error) {
                this.$patch({
                    error
                });
            },
            _setIsLoading(isLoading) {
                this.$patch({
                    isLoading
                });
            },
            async initiate(body: Body extends Record<string, any> ? Body : undefined, options? : AxiosRequestConfig<Body>): Promise<Entity | undefined> {
                this._setIsLoading(true);

                try {
                    const response = await api.request<Entity, AxiosResponse<Entity, Body>, Body>({
                        ...config,
                        ...options,
                        data: body
                    });

                    if (response.data) {
                        this._setData(response.data);
                    }
                    this._setError();

                    return response.data;
                } catch(error) {
                    this._setData();
                    if (isAxiosError<ApiError>(error)) {
                        this._setError(error.response?.data.message);
                    } 

                    if (typeof error === 'string') {
                        this._setError(error);
                    }

                    return undefined;
                } finally {
                    this._setIsLoading(false);
                }
            },
        }
    });
