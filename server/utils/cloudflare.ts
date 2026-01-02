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
