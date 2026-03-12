import type { D1Database, Ai, R2Bucket, VectorizeIndex, CfProperties, ExecutionContext } from '@cloudflare/workers-types'
/**
 * Type declarations for Cloudflare Workers bindings
 * These types extend the H3 event context to include Cloudflare-specific bindings
 *
 * Update this file when you add new bindings in wrangler.jsonc
 */

declare module 'h3' {
  interface H3EventContext {
    cf?: CfProperties
    cloudflare?: {
      request?: Request
      env: {
        // Environment variable
        ENVIRONMENT: 'preview' | 'production'

        // D1 Database
        DB: D1Database

        // Workers AI
        AI: Ai

        // Vectorize Index
        VECTORIZE: VectorizeIndex

        // R2 Bucket (optional)
        R2: R2Bucket

        // Cloudflare bindings
        NUXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY?: string
        CLOUDFLARE_TURNSTILE_PRIVATE_KEY?: string

        // Google bindings
        NUXT_OAUTH_GOOGLE_CLIENT_ID?: string
        NUXT_OAUTH_GOOGLE_CLIENT_SECRET?: string
      }
      context?: ExecutionContext
    }
  }
}

export {}
