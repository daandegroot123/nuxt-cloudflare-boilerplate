import { validateTurnstile } from "~~/server/utils/cloudflare"

/**
 * Login with email and password
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

  const db = useDrizzle(event)

  // Find user by email
  const user = await db
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get()

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password',
    })
  }

  // Verify password
  const isValid = await verifyPassword(user.passwordHash, password)

  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password',
    })
  }

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
