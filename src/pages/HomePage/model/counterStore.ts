import { _GettersTree, defineStore  } from 'pinia';

export const counterNamespace = 'counter';

export interface CounterSchema {
    count: number;
}

export interface CounterGetterSchema extends _GettersTree<CounterSchema> {
    doubleCount: (state: CounterSchema) => number;
}

export interface CounterActionSchema {
    increment: () => void 
}

export const useCounterStore = defineStore<string, CounterSchema, CounterGetterSchema, CounterActionSchema>(counterNamespace, {
    state: () => ({ count: 0 }),
    actions: {
        increment() {
            this.count += 1;
        },
    },
    getters: {
        doubleCount: (state) => state.count * 2  
    }
});