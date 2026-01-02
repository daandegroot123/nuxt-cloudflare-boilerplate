import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

/**
 * Users table - basic user schema for authentication
 *
 * Extend this table with additional fields as needed for your application.
 * After modifying, create a migration file in server/database/migrations/
 */
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name'),
  passwordHash: text('password_hash').notNull(),
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// Add more tables below as your application grows
// Example:
// export const posts = sqliteTable('posts', {
//   id: integer('id').primaryKey({ autoIncrement: true }),
//   title: text('title').notNull(),
//   content: text('content'),
//   authorId: integer('author_id').references(() => users.id),
//   createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
// })