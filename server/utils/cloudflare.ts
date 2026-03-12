import type { Ai, R2Bucket, VectorizeIndex } from '@cloudflare/workers-types'
import type { H3Event } from 'h3'

/**
 * Get the Cloudflare AI binding
 *
 * @example
 * ```ts
 * export default defineEventHandler(async (event) => {
 *   const ai = useAI(event)
 *   const result = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
 *     prompt: 'Hello, world!',
 *   })
 *   return result
 * })
 * ```
 */
export function useAI(event: H3Event): Ai {
  const ai = event.context.cloudflare?.env?.AI as unknown as Ai
  if (!ai) {
    throw createError({
      statusCode: 500,
      message: 'Workers AI binding not available. Make sure you are running with Cloudflare bindings (pnpm dev).',
    })
  }
  return ai
}

/**
 * Get the Cloudflare Vectorize binding
 *
 * @example
 * ```ts
 * export default defineEventHandler(async (event) => {
 *   const vectorize = useVectorize(event)
 *   const results = await vectorize.query(embedding, { topK: 10 })
 *   return results
 * })
 * ```
 */
export function useVectorize(event: H3Event): VectorizeIndex {
  const vectorize = event.context.cloudflare?.env?.VECTORIZE as unknown as VectorizeIndex
  if (!vectorize) {
    throw createError({
      statusCode: 500,
      message: 'Vectorize binding not available. Make sure you are running with Cloudflare bindings (pnpm dev).',
    })
  }
  return vectorize
}

/**
 * Get the Cloudflare R2 binding
 *
 * @example
 * ```ts
 * export default defineEventHandler(async (event) => {
 *   const r2 = useR2(event)
 *   const object = await r2.get('my-file.txt')
 *   return object
 * })
 * ```
 */
export function useR2(event: H3Event): R2Bucket {
  const r2 = event.context.cloudflare?.env?.R2 as unknown as R2Bucket
  if (!r2) {
    throw createError({
      statusCode: 500,
      message: 'R2 binding not available. Make sure you are running with Cloudflare bindings (pnpm dev).',
    })
  }
  return r2
}

/**
 * Generate embeddings using Workers AI
 *
 * @example
 * ```ts
 * const embedding = await generateEmbedding(event, 'Hello, world!')
 * // Use embedding with Vectorize
 * ```
 */
export async function generateEmbedding(event: H3Event, text: string): Promise<number[]> {
  const ai = useAI(event)
  const result: any = await ai.run('@cf/baai/bge-base-en-v1.5', { text: [text] })
  return result.data[0]
}

/**
 * Generate embeddings for multiple texts
 *
 * @example
 * ```ts
 * const embeddings = await generateEmbeddings(event, ['Hello', 'World'])
 * ```
 */
export async function generateEmbeddings(event: H3Event, texts: string[]): Promise<number[][]> {
  const ai = useAI(event)
  const result: any = await ai.run('@cf/baai/bge-base-en-v1.5', { text: texts })
  return result.data
}

/**
 * Validate Cloudflare Turnstile token
 *
 * @example
 * ```ts
 * await validateTurnstile(event, body.turnstile)
 * ```
 */
export async function validateTurnstile(event: H3Event, token?: string) {
  if (!token) {
    throw createError({
      statusCode: 400,
      message: 'Security verification is required',
    })
  }

  const isLocalhost = process.env.NODE_ENV === 'development'
  let secret = event.context.cloudflare?.env?.CLOUDFLARE_TURNSTILE_PRIVATE_KEY

  // On localhost, we MUST use the dummy secret key because the frontend
  // is hardcoded to use the dummy sitekey for development.
  if (isLocalhost) {
    secret = '1x0000000000000000000000000000000AA'
  }

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Missing CLOUDFLARE_TURNSTILE_PRIVATE_KEY')
      throw createError({
        statusCode: 500,
        message: 'Security validation is currently unavailable',
      })
    }
    console.warn('Missing CLOUDFLARE_TURNSTILE_PRIVATE_KEY, skipping verification')
    return true
  }

  // Use URLSearchParams for application/x-www-form-urlencoded (Cloudflare's preference)
  const params = new URLSearchParams()
  params.append('secret', secret)
  params.append('response', token)

  const remoteIp = getRequestHeader(event, 'cf-connecting-ip')
  if (remoteIp) {
    params.append('remoteip', Array.isArray(remoteIp) ? remoteIp[0] : remoteIp)
  }

  try {
    const turnstileResponse = await $fetch<{ 'success': boolean, 'error-codes'?: string[] }>('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: params,
    })

    if (!turnstileResponse.success) {
      console.error('Turnstile validation failed:', turnstileResponse['error-codes'], {
        hasSecret: !!secret,
        tokenLength: token?.length,
      })
      throw createError({
        statusCode: 400,
        message: 'Security verification failed. Please try again.',
      })
    }

    return true
  }
  catch (error: any) {
    if (error.statusCode === 400) throw error

    console.error('Turnstile verification error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to verify security token',
    })
  }
}
