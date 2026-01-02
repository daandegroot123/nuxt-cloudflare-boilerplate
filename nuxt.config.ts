// https://nuxt.com/docs/api/configuration/nuxt-config
import Tailwind from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    'nuxt-auth-utils',
    'nitro-cloudflare-dev',
  ],

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'system',
  },

  routeRules: {
    '/': { prerender: true },
  },

  sourcemap: {
    client: 'hidden',
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    preset: 'cloudflare-module',
    experimental: {
      tasks: true,
    },
    rollupConfig: {
      output: {
        sourcemapExcludeSources: false,
      },
    },
  },

  vite: {
    plugins: [
      Tailwind(),
    ],
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
