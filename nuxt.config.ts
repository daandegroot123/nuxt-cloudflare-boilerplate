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

  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 24 * 14, // 2 weeks
    },
    public: {
      cloudflareTurnstileSiteKey: '', // populated at runtime from NUXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY
    },
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
