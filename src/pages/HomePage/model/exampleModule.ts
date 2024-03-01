import { Module } from 'vuex';

import { StateSchema } from '@/app/providers/store';

export const exampleNamespace = 'example';

const IS_NAMESPACED = true;

export interface ExampleModuleStateSchema {
    count: number;
}

export const exampleModule: Module<ExampleModuleStateSchema, StateSchema> = {
    namespaced: IS_NAMESPACED,
    state: {
        count: 0
    },
    mutations: {
        increment: (state) => {
            state.count += 1;
        },
        decrement: (state) => {
            state.count -= 1;
        }
    },
    actions: {
        increment: (context) => {
            context.commit('increment');
        },
        decrement: (context) => {
            context.commit('decrement');
        }
    },
    getters: {
        getCount: (state) => state.count,
    }
};