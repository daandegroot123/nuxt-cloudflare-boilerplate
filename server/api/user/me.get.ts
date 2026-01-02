/**
 * Get current user profile
 *
 * This is an example of a protected API route.
 * It returns the current user's session data.
 */
export default defineEventHandler(async (event) => {
  // Get session - this will throw if user is not authenticated
  const session = await requireUserSession(event)

  return {
    user: session.user,
    loggedInAt: session.loggedInAt,
  }
})
