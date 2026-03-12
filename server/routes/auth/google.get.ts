import { eq, or } from 'drizzle-orm'
import { tables, useDrizzle } from '~~/server/utils/drizzle'

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user: oauthUser }) {
    const db = useDrizzle(event)

    // Check if user exists by Google ID or Email
    let user = await db
      .select()
      .from(tables.users)
      .where(
        or(
          eq(tables.users.googleId, oauthUser.sub),
          eq(tables.users.email, oauthUser.email),
        ),
      )
      .get()

    if (user) {
      // Update googleId and avatar if missing or changed
      if (user.googleId !== oauthUser.sub || user.avatarUrl !== oauthUser.picture) {
        await db
          .update(tables.users)
          .set({
            googleId: oauthUser.sub,
            avatarUrl: oauthUser.picture,
            updatedAt: new Date(),
          })
          .where(eq(tables.users.id, user.id))
      }
    }
    else {
      // Create new user
      // Generate a random password hash since it's required by schema but won't be used
      const randomPassword = crypto.randomUUID()

      user = await db
        .insert(tables.users)
        .values({
          email: oauthUser.email,
          name: oauthUser.name,
          googleId: oauthUser.sub,
          avatarUrl: oauthUser.picture,
          // Prefixed to distinguish from real hashes
          passwordHash: `oauth_user_${randomPassword}`,
        })
        .returning()
        .get()
    }

    if (!user) {
      throw createError({
        statusCode: 500,
        message: 'Failed to create or retrieve user',
      })
    }

    // Set user session
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '',
      },
    })

    return sendRedirect(event, '/app')
  },

  onError(event, error) {
    console.error('Google OAuth Error:', error)
    return sendRedirect(event, '/login?error=oauth_failed')
  },
})
