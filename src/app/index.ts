import App from './index.vue';
import { router } from './providers/router';
import { store } from './providers/store';

import { createApp } from 'vue';

export const app = createApp(App).use(store).use(router);