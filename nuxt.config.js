export default {
  ssr: true,

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
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css",
      },
    ],
    script: [
      {
        src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js",
      },
      {
        src: "https://cdn.jsdelivr.net/npm/swiper@9/swiper-element-bundle.min.js",
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/css/main.css", "@/assets/css/reset.css"],

  plugins: [
    "@/plugins/main.ts",
    "@/plugins/axios.ts",
    { src: "~/plugins/persistedState.client.js" },
  ],

  components: true,

  buildModules: ["@nuxt/typescript-build", "@nuxtjs/dotenv"],

  // cookie-universal-nuxt
  target: "server",

  modules: ["@nuxtjs/axios", "cookie-universal-nuxt", "bootstrap-vue/nuxt"],
  bootstrapVue: {},

  axios: {
    baseURL: "http://localhost:8080",
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
    middleware: ["auth", "router"],
  },

  env: {
    baseUrl: process.env.BASE_URL || "https://taj.stg.ebsoc.co.kr",
  },
  server: {
    port: 4000,
  },
};
