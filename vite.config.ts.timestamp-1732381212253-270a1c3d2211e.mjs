// vite.config.ts
import path from "path";
import vue from "file:///home/manager/ilow/sync-media-service-vue/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///home/manager/ilow/sync-media-service-vue/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { defineConfig } from "file:///home/manager/ilow/sync-media-service-vue/node_modules/vite/dist/node/index.js";
import svgLoader from "file:///home/manager/ilow/sync-media-service-vue/node_modules/vite-svg-loader/index.js";
import tsconfigPaths from "file:///home/manager/ilow/sync-media-service-vue/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "/home/manager/ilow/sync-media-service-vue";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    tsconfigPaths(),
    svgLoader({
      defaultImport: "url",
      svgoConfig: {
        multipass: true
      }
    })
  ],
  resolve: {
    alias: {
      "@/": `${path.resolve(__vite_injected_original_dirname, "src")}/`
    }
  },
  build: {
    minify: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9tYW5hZ2VyL2lsb3cvc3luYy1tZWRpYS1zZXJ2aWNlLXZ1ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvbWFuYWdlci9pbG93L3N5bmMtbWVkaWEtc2VydmljZS12dWUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvbWFuYWdlci9pbG93L3N5bmMtbWVkaWEtc2VydmljZS12dWUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4JztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHN2Z0xvYWRlciBmcm9tICd2aXRlLXN2Zy1sb2FkZXInO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgcGx1Z2luczogW1xuICAgICAgICB2dWUoKSwgXG4gICAgICAgIHZ1ZUpzeCgpLCBcbiAgICAgICAgdHNjb25maWdQYXRocygpLFxuICAgICAgICBzdmdMb2FkZXIoeyBcbiAgICAgICAgICAgIGRlZmF1bHRJbXBvcnQ6ICd1cmwnLFxuICAgICAgICAgICAgc3Znb0NvbmZpZzoge1xuICAgICAgICAgICAgICAgIG11bHRpcGFzczogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIF0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgICBhbGlhczoge1xuICAgICAgICAgICAgJ0AvJzogYCR7cGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpfS9gXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICAgIG1pbmlmeTogdHJ1ZVxuICAgIH1cbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2UyxPQUFPLFVBQVU7QUFFOVQsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLGVBQWU7QUFDdEIsT0FBTyxtQkFBbUI7QUFOMUIsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsY0FBYztBQUFBLElBQ2QsVUFBVTtBQUFBLE1BQ04sZUFBZTtBQUFBLE1BQ2YsWUFBWTtBQUFBLFFBQ1IsV0FBVztBQUFBLE1BQ2Y7QUFBQSxJQUNKLENBQUM7QUFBQSxFQUNMO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxNQUFNLEdBQUcsS0FBSyxRQUFRLGtDQUFXLEtBQUssQ0FBQztBQUFBLElBQzNDO0FBQUEsRUFDSjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0gsUUFBUTtBQUFBLEVBQ1o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
