import { _GettersTree, defineStore  } from 'pinia';

export const counterNamespace = 'checkboxes';

export interface CounterSchema {
    checkboxes: Array<{ name: string, checked: boolean }>;
}

export interface CounterGetterSchema extends _GettersTree<CounterSchema> {
    checkbox: (state: CounterSchema) => Array<{ name: string, checked: boolean }>;
}

export interface CounterActionSchema {
    check: (value: { id: string, checked: boolean}) => void 
}

export const useCheckboxStore = defineStore<string, CounterSchema, CounterGetterSchema, CounterActionSchema>(counterNamespace, {
    state: () => ({
        checkboxes: [
            {
                name: 'checkbox1',
                checked: false
            },
            {
                name: 'checkbox2',
                checked: false
            },
            {
                name: 'checkbox3',
                checked: false
            },
        ]
    }),
    actions: {
        check(value) {
            this.checkboxes = this.checkboxes.map((checkbox) => {
                if (value.id === checkbox.name) {
                    return { name: checkbox.name, checked: !value.checked };
                } 

                return checkbox;
            });
        },
    },
    getters: {
        checkbox: (state) => state.checkboxes
    }
});