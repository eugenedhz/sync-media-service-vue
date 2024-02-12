import path from 'path';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [vue(), vueJsx(), tsconfigPaths()],
    resolve: {
        alias: {
            '@/': `${path.resolve(__dirname, 'src')}/`
        }
    },
    build: {
        minify: true
    }
});
