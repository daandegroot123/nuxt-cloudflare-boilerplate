/**
 * Demo API: Generate text with Workers AI
 *
 * This demonstrates how to use Cloudflare Workers AI for text generation.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const prompt = body?.prompt || 'Say hello in 3 different languages'

  const ai = useAI(event)

  // Run the AI model
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = await ai.run('@cf/meta/llama-3.1-8b-instruct' as any, {
    prompt,
    max_tokens: 256,
  })

  return {
    model: '@cf/meta/llama-3.1-8b-instruct',
    prompt,
    response: result.response,
  }
})
