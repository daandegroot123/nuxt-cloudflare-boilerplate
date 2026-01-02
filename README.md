# Nuxt + Cloudflare Boilerplate

A modern, full-stack boilerplate for building applications with **Nuxt 4** and **Cloudflare**. Deploy to the edge in minutes with D1 (database), Workers AI, Vectorize (vector search), and R2 (storage).

## ✨ Features

- **Nuxt 4** - Latest Vue 3 framework with file-based routing
- **Cloudflare Workers** - Edge-first deployment
- **D1 Database** - SQLite at the edge with Drizzle ORM
- **Workers AI** - Run AI models directly on Cloudflare
- **Vectorize** - Vector database for semantic search
- **R2 Storage** - S3-compatible object storage (optional)
- **Nuxt UI v4** - Beautiful, accessible components
- **Tailwind CSS v4** - Utility-first styling
- **Authentication** - OAuth via nuxt-auth-utils (GitHub included)
- **TypeScript** - Full type safety

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) (recommended)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`pnpm add -g wrangler`)
- A [Cloudflare account](https://dash.cloudflare.com/sign-up)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/nuxt-cloudflare-boilerplate.git
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
# Apply migrations to preview database
pnpm migrations:preview

# Apply migrations to production database
pnpm migrations:production
```

### 5. Start Development

```bash
pnpm dev
```

The app will start at `http://localhost:3000` with remote Cloudflare bindings.

## 📁 Project Structure

```
├── app/
│   ├── components/       # Vue components
│   ├── layouts/          # Layout templates
│   ├── middleware/       # Route middleware (auth)
│   ├── pages/            # File-based routing
│   └── assets/css/       # Tailwind CSS
├── server/
│   ├── api/              # API routes
│   ├── database/
│   │   ├── schema.ts     # Drizzle ORM schema
│   │   └── migrations/   # SQL migrations
│   ├── middleware/       # Server middleware
│   └── utils/            # Server utilities (Drizzle, AI)
├── shared/
│   └── types/            # Shared TypeScript types
├── wrangler.jsonc        # Cloudflare configuration
└── nuxt.config.ts        # Nuxt configuration
```

## 🔐 Authentication

This boilerplate includes email/password authentication out of the box using `nuxt-auth-utils`.

### How It Works

- **Register**: `POST /api/auth/register` with `email`, `password`, and optional `name`
- **Login**: `POST /api/auth/login` with `email` and `password`
- **Logout**: `POST /api/auth/logout`
- **Session**: Use `useUserSession()` composable in your Vue components

### Configuration

Make sure to set a session secret in your `.env`:

```env
NUXT_SESSION_PASSWORD=your-session-secret-at-least-32-characters
```

Generate a secure secret with:
```bash
openssl rand -base64 32
```

### Protected Routes

Routes under `/app/*` are protected by the global auth middleware. Unauthenticated users are redirected to `/login`.

### Adding OAuth Providers (Optional)

See [nuxt-auth-utils documentation](https://github.com/atinux/nuxt-auth-utils) for adding GitHub, Google, and other OAuth providers.

## 🗄️ Database

### Schema

Define your tables in `server/database/schema.ts` using Drizzle ORM:

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})
```

### Migrations

1. Create a new SQL file in `server/database/migrations/`
2. Run migrations:

```bash
pnpm migrations:preview   # Preview environment
pnpm migrations:production # Production environment
```

### Querying

```typescript
// In API routes
export default defineEventHandler(async (event) => {
  const db = useDrizzle(event)
  
  const posts = await db.select().from(tables.posts).all()
  return posts
})
```

## 🤖 Workers AI

Use AI models directly in your API routes:

```typescript
export default defineEventHandler(async (event) => {
  const ai = event.context.cloudflare.env.AI

  const result = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
    prompt: 'Hello, world!',
  })

  return result
})
```

See [Workers AI documentation](https://developers.cloudflare.com/workers-ai/) for available models.

## 🔍 Vectorize

For semantic search and RAG applications:

```typescript
export default defineEventHandler(async (event) => {
  const { AI, VECTORIZE } = event.context.cloudflare.env

  // Generate embeddings
  const embeddings = await AI.run('@cf/baai/bge-base-en-v1.5', {
    text: 'Your search query',
  })

  // Query Vectorize
  const results = await VECTORIZE.query(embeddings.data[0], {
    topK: 10,
  })

  return results
})
```

## 📦 Deployment

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
| `pnpm deploy:preview` | Deploy to preview environment |
| `pnpm deploy:production` | Deploy to production |
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
