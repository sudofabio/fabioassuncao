// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  nitro: {
    preset: "cloudflare-pages",

    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    },

    prerender: {
      // Rotas de apresentação são 100% estáticas (routeRules não expande
      // wildcards sozinho — cada apresentação é listada aqui).
      routes: [
        "/presentations",
        "/presentations/alem-do-codigo-inteligencia-artificial-e-o-novo-desenvolvedor",
      ],
    },
  },

  modules: ["nitro-cloudflare-dev", "@nuxtjs/tailwindcss", "@nuxtjs/sitemap"],

  routeRules: {
    // Apresentações: 100% estáticas (prerender) — zero fetch em runtime.
    "/presentations/**": { prerender: true },
  },

  css: ["~/assets/css/main.css"],

  site: {
    url: "https://fabioassuncao.com",
    name: "Fábio Assunção",
  },
})