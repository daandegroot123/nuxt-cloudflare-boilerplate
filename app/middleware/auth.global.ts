/**
 * Global auth middleware
 *
 * Protects routes under /app for authenticated users only.
 * Unauthenticated users are redirected to /login.
 */
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  // Protect all routes under /app
  if (to.path.startsWith('/app')) {
    if (!loggedIn.value) {
      return navigateTo('/login')
    }
  }

  // Redirect logged-in users away from login page
  if (to.path === '/login' && loggedIn.value) {
    return navigateTo('/app')
  }
})
