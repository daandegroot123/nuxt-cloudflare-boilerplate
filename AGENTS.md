# GitHub Copilot Instructions

## Project Context
This is a **Nuxt 4** application deployed on **Cloudflare Workers**. It uses a full Cloudflare stack including **D1 (Database)**, **Workers AI**, **Vectorize**, and **R2**.

## Tech Stack
- **Framework**: Nuxt 4 (Vue 3)
- **UI Library**: Nuxt UI v4 (`@nuxt/ui`) - MCP server available
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`)
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **AI/ML**: Cloudflare Workers AI & Vectorize - MCP server available
- **State Management**: Pinia
- **Auth**: `nuxt-auth-utils`

## Architecture & Structure
- **Source Code**: Located in `app/` (Pages, Components, Composables) and `server/` (API, Database).
- **Database Schema**: Defined in `server/database/schema.ts`.
- **Migrations**: NOT managed via Drizzle Kit, instead manually handled and applied to the database (`server/database/migrations`).
- **Cloudflare Bindings**: Configured in `wrangler.jsonc`.

## Critical Workflows
- **Development**: Run `pnpm dev`. This executes `nuxt dev --remote` to connect to remote Cloudflare resources (D1, AI, etc.). **Do not run local dev without remote bindings unless mocked.**
- **Database Changes**:
  1. Modify `server/database/schema.ts`.
  2. Create a migration file in `server/database/migrations/`
  3. Apply migrations via Wrangler (usually handled in CI/CD or manually via `pnpm run migrations:preview` and `pnpm run migrations:production`).
- **Deployment**: `pnpm deploy:preview` or `pnpm deploy:production`.

## Coding Conventions
You have skills saved in `.claude/skills/` that guide how to write frontend code, backend code, styling, and more. Follow these skills closely to ensure consistency and quality.

### Vue / Nuxt
- Use **Vue 3 Composition API** with `<script setup lang="ts">`.
- Use **Nuxt UI v4** components (e.g., `<UButton>`, `<UInput>`).
- Place page-specific logic in `app/pages/` and reusable UI in `app/components/`.

### Backend (Nitro / Server Routes)
- API routes are in `server/api/`.
- Access Cloudflare bindings (D1, AI) via `event.context.cloudflare.env`.
- Use **Drizzle ORM** for all database interactions.
  ```typescript
  // Example: Fetching users
  import { users } from '~~/server/database/schema'
  // ... inside event handler
  const db = useDrizzle(event) // or equivalent utility
  const result = await db.select().from(users).all()
  ```

### Styling
- Use **Tailwind CSS v4** utility classes.
- Configuration is in `assets/css/main.css` (CSS-first configuration).

### Authentication
- Use `nuxt-auth-utils` for session management.
- Use `getUserSession()` composable to get the current user session.
- Protect API routes by checking `event.context.session`.

## Common Patterns
- **Vector Search**: When implementing search, ensure embeddings are generated via `env.AI` and queried against `env.VECTORIZE`.
- **Type Safety**: Share types between frontend and backend using `shared/types/`. Make sure to update it when needed.
- **User type**: There's 3 types of users, 0 = admin, 1 = client, 2 = expert. Admin can do everything, but certain API calls should be restricted based on user type.
