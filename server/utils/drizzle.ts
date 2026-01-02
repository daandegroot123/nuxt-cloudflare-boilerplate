import type { H3Event } from 'h3'
import { drizzle } from 'drizzle-orm/d1'

import * as schema from '../database/schema'

// Re-export common Drizzle operators for convenience
export { sql, eq, and, or, ne, gt, gte, lt, lte, like, isNull, isNotNull, inArray, notInArray, desc, asc } from 'drizzle-orm'

// Export schema as tables for easy access
export const tables = schema

/**
 * Get a Drizzle ORM instance connected to D1
 *
 * @example
 * ```ts
 * export default defineEventHandler(async (event) => {
 *   const db = useDrizzle(event)
 *   const users = await db.select().from(tables.users).all()
 *   return users
 * })
 * ```
 */
export function useDrizzle(event: H3Event) {
  const db = event.context.cloudflare?.env?.DB
  if (!db) {
    throw createError({
      statusCode: 500,
      message: 'D1 database binding not available. Make sure you are running with Cloudflare bindings (pnpm dev).',
    })
  }
  return drizzle(db, { schema })
}

// Infer types from schema for use throughout the app
export type User = typeof schema.users.$inferSelect
export type NewUser = typeof schema.users.$inferInsert
