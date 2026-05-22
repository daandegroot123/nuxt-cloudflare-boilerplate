<script setup lang="ts">
const { user, clear } = useUserSession()

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  navigateTo('/')
}
</script>

<template>
  <UContainer class="py-8">
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">
          Dashboard
        </h1>
        <UButton
          variant="ghost"
          color="neutral"
          @click="logout"
        >
          Sign Out
        </UButton>
      </div>

      <!-- User profile card -->
      <UCard class="mb-6">
        <template #header>
          <h2 class="font-semibold">
            Your Profile
          </h2>
        </template>

        <div class="flex items-center gap-4">
          <UAvatar
            :alt="user?.name"
            size="xl"
          />
          <div>
            <p class="font-medium text-lg">
              {{ user?.name || 'No name set' }}
            </p>
            <p class="text-gray-500 dark:text-gray-400">
              {{ user?.email }}
            </p>
          </div>
        </div>
      </UCard>

      <!-- Quick links -->
      <div class="grid md:grid-cols-2 gap-4">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-database"
                class="w-5 h-5"
              />
              <h3 class="font-semibold">
                Database Demo
              </h3>
            </div>
          </template>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            See how to query D1 with Drizzle ORM.
          </p>
          <UButton
            to="/app/demo"
            variant="outline"
            size="sm"
          >
            View Demo
          </UButton>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-brain"
                class="w-5 h-5"
              />
              <h3 class="font-semibold">
                AI Demo
              </h3>
            </div>
          </template>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Try out Workers AI text generation.
          </p>
          <UButton
            to="/app/demo"
            variant="outline"
            size="sm"
          >
            View Demo
          </UButton>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>
