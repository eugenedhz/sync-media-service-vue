import { _GettersTree, defineStore  } from 'pinia';

export const counterNamespace = 'checkboxes';

export interface CounterSchema {
    checkboxes: Array<{ name: string, checked: boolean }>;
    input: string;
}

export interface CounterGetterSchema extends _GettersTree<CounterSchema> {
    checkbox: (state: CounterSchema) => Array<{ name: string, checked: boolean }>;
    inp: (state: CounterSchema) => string
}

export interface CounterActionSchema {
    check: (value: { name: string, checked: boolean}) => void,
    inputSmth: (value: string) => void;
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
        ],
        input: ''
    }),
    actions: {
        check(value) {
            this.checkboxes = this.checkboxes.map((checkbox) => {
                if (value.name === checkbox.name) {
                    console.log({ name: checkbox.name, checked: !value.checked });
                    return { name: checkbox.name, checked: !value.checked };
                } 

                return checkbox;
            });
        },
        inputSmth(value) {
            this.input = value;
            console.log(this.input);
        }
    },
    getters: {
        checkbox: (state) => state.checkboxes,
        inp: (state) => state.input
    }
});