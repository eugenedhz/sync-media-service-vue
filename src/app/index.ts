import { createApp } from 'vue';

import App from './index.vue';
import { router } from './providers/router';

export const app = createApp(App).use(router);
