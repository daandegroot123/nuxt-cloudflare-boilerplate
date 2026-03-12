import { validateTurnstile } from "~~/server/utils/cloudflare"

/**
 * Register a new user with email and password
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate input
  if (!body?.email || !body?.password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required',
    })
  }

  await validateTurnstile(event, body.turnstile)

  const email = body.email.toLowerCase().trim()
  const password = body.password
  const name = body.name?.trim() || null

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email format',
    })
  }

  // Validate password strength
  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      message: 'Password must be at least 8 characters',
    })
  }

  const db = useDrizzle(event)

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get()

  if (existingUser) {
    throw createError({
      statusCode: 409,
      message: 'User with this email already exists',
    })
  }

  // Hash password
  const passwordHash = await hashPassword(password)

  // Create user
  const result = await db
    .insert(tables.users)
    .values({
      email,
      name,
      passwordHash,
    })
    .returning()

  const user = result[0] as User

  // Set user session
  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    loggedInAt: new Date().toISOString(),
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  }
})
