# Nuxt 4 + Cloudflare Boilerplate

A modern, full-stack boilerplate for building applications with **Nuxt 4** and **Cloudflare**. My own projects are usually build using the combination of these two, so I figured it would be smart to create an easy-to-use boilerplate for future projects!

## ✨ Features

- **Nuxt 4** - Latest Vue 3 framework with file-based routing and Nitro 3
- **Cloudflare Workers** - Edge-first deployment
  - **D1 Database** - SQLite at the edge with Drizzle ORM
  - **Workers AI** - Run AI models directly on Cloudflare Workers
  - **Vectorize** - Vector database for semantic search
  - **R2 Storage** - S3-compatible object storage
  - *Or any other Cloudflare Workers bindings...*
- **Nuxt UI v4** - Easy to use UI components powered by Reka UI and Tailwind via [`@nuxt/ui`](https://github.com/nuxt/ui)
- **Authentication** - Email/Password auth via [`nuxt-auth-utils`](https://github.com/atinux/nuxt-auth-utils)
- **TypeScript** - Full type safety across the stack
- **Pinia** - State management for Vue 3 via [Pinia](https://github.com/vuejs/pinia/tree/v2/packages/nuxt)

An AGENTS.md file is also included with detailed project context, architecture, and coding conventions. A Claude Skills folder is also with a frotend-design skill.

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 10+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`pnpm add -g wrangler`)
- A [Cloudflare account](https://dash.cloudflare.com/sign-up)

### 1. Clone & Install

```bash
git clone https://github.com/daandegroot123/nuxt-cloudflare-boilerplate.git
cd nuxt-cloudflare-boilerplate
pnpm install
```

### 2. Configure Cloudflare Resources

Login to Cloudflare and create the required resources:

```bash
# Login to Cloudflare
wrangler login

# Create D1 databases
wrangler d1 create your-db-name-preview
wrangler d1 create your-db-name-production

# Create Vectorize indexes (optional)
wrangler vectorize create your-index-name-preview --dimensions=1536 --metric=cosine
wrangler vectorize create your-index-name-production --dimensions=1536 --metric=cosine

# Create R2 buckets (optional)
wrangler r2 bucket create your-bucket-name-preview
wrangler r2 bucket create your-bucket-name-production
```

### 3. Update Configuration

1. Copy the database IDs from the output above
2. Update `wrangler.jsonc` with your resource names and IDs
3. Copy `.env.example` to `.env` and fill in your secrets

```bash
cp .env.example .env
```

### 4. Run Migrations

```bash
# Apply migrations to local development (local D1)
pnpm migrations:dev

# Apply migrations to preview database
pnpm migrations:preview

# Apply migrations to production database
pnpm migrations:production
```

### 5. Start Development

```bash
pnpm dev
```

The app will start at `http://localhost:3000` with local Cloudflare bindings. Add `--remote` flag to connect to remote resources.

## 📁 Project Structure

```
├── app/
│   ├── components/       # Reusable UI components
│   ├── layouts/          # Layout templates
│   ├── middleware/       # Route middleware (auth)
│   ├── pages/            # File-based routing (Nuxt 4 structure)
│   └── assets/css/       # Tailwind CSS v4 configuration
├── server/
│   ├── api/              # API routes (Nitro)
│   ├── database/
│   │   ├── schema.ts     # Drizzle ORM schema
│   │   └── migrations/   # SQL migrations
│   ├── middleware/       # Server middleware
│   └── utils/            # Server utilities (Drizzle, AI, R2)
├── shared/
│   └── types/            # Shared TypeScript types
├── wrangler.jsonc        # Cloudflare configuration
└── nuxt.config.ts        # Nuxt configuration
```

## 🔐 Authentication

This boilerplate includes email/password authentication out of the box using `nuxt-auth-utils`.

### How It Works

- **Register**: `POST /api/auth/register` with `email`, `password`, and `name`
- **Login**: `POST /api/auth/login` with `email` and `password`
- **Logout**: `POST /api/auth/logout`
- **Session**: Use `useUserSession()` composable in your Vue components

### Configuration

Make sure to set a session secret in your `.env`:

```env
NUXT_SESSION_PASSWORD=your-session-secret-at-least-32-characters
```

### Protected Routes

Routes under `/app/*` are protected by the global auth middleware in `app/middleware/auth.global.ts`. Unauthenticated users are redirected to `/login`.

## 🗄️ Database

### Schema

Define your tables in `server/database/schema.ts` using Drizzle ORM.

### Migrations

1. Create a new SQL file in `server/database/migrations/`
2. Run migrations:

```bash
pnpm migrations:dev        # Local development
pnpm migrations:preview    # Preview environment
pnpm migrations:production # Production environment
```

### Querying

```typescript
// In API routes
export default defineEventHandler(async (event) => {
  const db = useDrizzle(event)
  
  const users = await db.select().from(tables.users).all()
  return users
})
```

## 🤖 Workers AI

Use AI models directly in your API routes via the `useAI(event)` utility:

```typescript
export default defineEventHandler(async (event) => {
  const ai = useAI(event)

  const result = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
    prompt: 'Hello, world!',
  })

  return result
})
```

## 🔍 Vectorize & R2

Utilities for Vectorize and R2 are included in `server/utils/cloudflare.ts`:

```typescript
// Vectorize
const vectorize = useVectorize(event)
const results = await vectorize.query(embedding, { topK: 10 })

// R2
const r2 = useR2(event)
await r2.put('file.txt', 'content')
```

## 📦 Deployment
An example Github Actions workflow is included in `.github/example-workflows/cloudflare.yml` for deploying to Cloudflare Workers.

### Preview

```bash
pnpm deploy:preview
```

### Production

```bash
pnpm deploy:production
```

## 🛠️ Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with remote bindings |
| `pnpm build` | Build for production |
| `pnpm deploy:preview` | Build and deploy to preview environment |
| `pnpm deploy:production` | Build and deploy to production |
| `pnpm migrations:dev` | Run migrations on development D1 |
| `pnpm migrations:preview` | Run migrations on preview D1 |
| `pnpm migrations:production` | Run migrations on production D1 |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript checks |

## 📚 Resources

- [Nuxt Documentation](https://nuxt.com/docs)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [D1 Documentation](https://developers.cloudflare.com/d1/)
- [Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Nuxt UI Documentation](https://ui.nuxt.com/)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
