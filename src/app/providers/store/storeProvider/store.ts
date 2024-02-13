import { createStore } from 'vuex';

import { StateSchema } from './types/state';

import { __IS_DEV__ } from '@/shared/config/environment';

export const store = createStore<StateSchema>({
    modules: {},
    strict: !!__IS_DEV__,
    devtools: !!__IS_DEV__
});
