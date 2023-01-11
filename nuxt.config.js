export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "my-project",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css",
        rel: "stylesheet",
      },
    ],
    script: [
      {
        src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js",
      },
      {
        src: "https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js",
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/css/main.css", "@/assets/css/reset.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["@/plugins/axios", { src: "~/plugins/persistedState.client.js" }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
  ],

  // cookie-universal-nuxt
  target: "server",

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/axios", "cookie-universal-nuxt"],

  axios: {
    // baseURL: "https://taj.stg.ebsoc.co.kr",
    // headers: {
    //   common: {
    //     "Content-Type": "application/json;charset=UTF-8",
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "PUT, GET, POST",
    //     "X-AUTH-TOKEN":
    //       "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJPbmxpbmUgQ2xhc3MiLCJtZW1iZXJOYW1lIjoiVUnrnqnqtZDsgqwxIiwibWVtYmVyU2Nob29sQ29kZSI6IkgxMjgyMCIsImV4cCI6MTY1OTkzNjE0NywiaWF0IjoxNjU5Njc2OTQ3LCJtZW1iZXJJZCI6InVpbGFidDAxIn0.ZyH5eXovcuZEJ7pH6qdYxlcP3eto-A6u4YzpOMZ48AA",
    //   },
    // },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    vendor: ["axios"],
  },

  router: {
    middleware: ["auth"],
    // middleware: ["stats", "auth"],
  },

  env: {
    baseUrl: process.env.BASE_URL || "https://taj.stg.ebsoc.co.kr",
  },
  server: {
    port: 4000,
  },
};
