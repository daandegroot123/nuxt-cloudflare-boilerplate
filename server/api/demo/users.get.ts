/**
 * Demo API: List users from D1 database
 *
 * This demonstrates how to query the D1 database using Drizzle ORM.
 */
export default defineEventHandler(async (event) => {
  const db = useDrizzle(event)

  // Fetch all users (limit to 10 for demo)
  const users = await db
    .select({
      id: tables.users.id,
      email: tables.users.email,
      name: tables.users.name,
      createdAt: tables.users.createdAt,
    })
    .from(tables.users)
    .limit(10)

  return {
    message: 'Users fetched from D1 database',
    count: users.length,
    users,
  }
})
