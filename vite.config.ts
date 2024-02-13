import path from 'path';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        vue(), 
        vueJsx(), 
        tsconfigPaths(),
        svgLoader({ 
            defaultImport: 'url',
            svgoConfig: {
                multipass: true
            }
        })
    ],
    resolve: {
        alias: {
            '@/': `${path.resolve(__dirname, 'src')}/`
        }
    },
    build: {
        minify: true
    }
});
