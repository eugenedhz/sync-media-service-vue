import { Store } from 'vuex';

import { StateSchema } from '../providers/store';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $store: Store<StateSchema>;
    }
}
