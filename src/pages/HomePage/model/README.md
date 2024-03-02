# Шаблон store'a модуля

---

Название файла указать в формате `camelCase`, с постфиксом `Store`
Пример:  `counterStore.ts`

---

```typescript
import { _GettersTree, defineStore  } from 'pinia';

// Обязательно указываем namepsace в отдельной константе
// Формат нейминга: `storeName` + Namespace
export const counterNamespace = 'counter';

// Здесь указываем состояние store'a
// Формат нейминга типа: `StoreName` + Schema
export interface CounterSchema {
    count: number;
}

// Здесь указываем тип геттеров store'a
// Формат нейминга типа: `StoreName` + GetterSchema
export interface CounterGetterSchema extends _GettersTree<CounterSchema> {
    doubleCount: (state: CounterSchema) => number;
}

// Здесь указываем тип экшенов store'a
// Формат нейминга типа: `StoreName` + ActionSchema
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
```
