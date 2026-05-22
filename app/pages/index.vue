<script setup lang="ts">
const { loggedIn } = useUserSession()
</script>

<template>
  <UContainer class="py-16">
    <div class="text-center max-w-2xl mx-auto">
      <h1 class="text-4xl font-bold mb-4">
        Nuxt + Cloudflare Boilerplate
      </h1>
      <p class="text-lg text-gray-500 dark:text-gray-400 mb-8">
        A modern full-stack boilerplate with Nuxt 4, Cloudflare Workers, D1, Workers AI, and Vectorize.
        Ready to deploy in minutes.
      </p>

      <div class="flex gap-4 justify-center">
        <UButton
          v-if="!loggedIn"
          to="/login"
          size="lg"
        >
          Get Started
        </UButton>
        <UButton
          v-else
          to="/app"
          size="lg"
        >
          Go to Dashboard
        </UButton>
        <UButton
          to="https://github.com/daandegroot123/nuxt-cloudflare-boilerplate"
          target="_blank"
          variant="outline"
          size="lg"
          icon="i-simple-icons-github"
        >
          View on GitHub
        </UButton>
      </div>

      <!-- Features -->
      <div class="grid md:grid-cols-3 gap-6 mt-16 text-left">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-database"
                class="w-5 h-5 text-primary"
              />
              <h3 class="font-semibold">
                D1 Database
              </h3>
            </div>
          </template>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            SQLite at the edge with Drizzle ORM. Fast queries, zero cold starts.
          </p>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-brain"
                class="w-5 h-5 text-primary"
              />
              <h3 class="font-semibold">
                Workers AI
              </h3>
            </div>
          </template>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Run AI models at the edge. Text generation, embeddings, and more.
          </p>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-search"
                class="w-5 h-5 text-primary"
              />
              <h3 class="font-semibold">
                Vectorize
              </h3>
            </div>
          </template>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Vector database for semantic search and AI-powered retrieval.
          </p>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>
