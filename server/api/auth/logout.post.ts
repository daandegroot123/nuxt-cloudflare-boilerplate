/**
 * Logout handler
 *
 * Clears the user session and redirects to the home page.
 */
export default defineEventHandler(async (event) => {
  await clearUserSession(event)
  return { success: true }
})
