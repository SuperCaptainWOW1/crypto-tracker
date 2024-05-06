import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  devtools: { enabled: false },

  build: {
    transpile: ["vuetify"],
  },
  modules: [
    "@pinia/nuxt",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  css: ["~/assets/global.css"],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
