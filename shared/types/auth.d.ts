// Define your types here for nuxt-auth-utils module
declare module '#auth-utils' {
  interface User {
    // Define user properties here
    id: string
    name: string
    email: string
  }

  interface UserSession {
    // Define user session properties here
    user: {
      id: string
      name: string
      email: string
    }
    loggedInAt: string
  }

  interface SecureSessionData {
    // Define secure session data properties here
    [key: string]: unknown
  }
}

export {}
