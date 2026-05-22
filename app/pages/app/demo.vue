<script setup lang="ts">
import { useCounterStore } from '~/stores/counter'

// Pinia store demo
const counter = useCounterStore()

// Database demo
const { data: usersData, status: usersStatus, refresh: refreshUsers } = await useFetch('/api/demo/users')

// AI demo
const aiPrompt = ref('Write a haiku about coding')
const aiResponse = ref<{ model: string, prompt: string, response: string } | null>(null)
const aiLoading = ref(false)
const aiError = ref<string | null>(null)

async function generateAI() {
  aiLoading.value = true
  aiError.value = null
  aiResponse.value = null

  try {
    const result = await $fetch<{ model: string, prompt: string, response: string }>('/api/demo/ai', {
      method: 'POST',
      body: { prompt: aiPrompt.value },
    })
    aiResponse.value = result
  }
  catch (e) {
    aiError.value = (e as { data?: { message?: string } }).data?.message || 'Failed to generate AI response'
  }
  finally {
    aiLoading.value = false
  }
}
</script>

<template>
  <UContainer class="py-8">
    <div class="max-w-3xl mx-auto">
      <div class="mb-8">
        <UButton
          to="/app"
          variant="ghost"
          icon="i-lucide-arrow-left"
        >
          Back to Dashboard
        </UButton>
      </div>

      <h1 class="text-2xl font-bold mb-8">
        Cloudflare Stack Demo
      </h1>

      <!-- D1 Database Demo -->
      <UCard class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-database"
                class="w-5 h-5 text-primary"
              />
              <h2 class="font-semibold">
                D1 Database
              </h2>
            </div>
            <UButton
              size="xs"
              variant="ghost"
              icon="i-lucide-refresh-cw"
              :loading="usersStatus === 'pending'"
              @click="() => refreshUsers()"
            >
              Refresh
            </UButton>
          </div>
        </template>

        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          This fetches users from your D1 database using Drizzle ORM.
        </p>

        <div
          v-if="usersStatus === 'pending'"
          class="flex items-center gap-2 text-gray-500"
        >
          <UIcon
            name="i-lucide-loader-2"
            class="w-4 h-4 animate-spin"
          />
          Loading...
        </div>

        <div v-else-if="usersData">
          <p class="text-sm mb-2">
            Found <strong>{{ usersData.count }}</strong> user(s):
          </p>
          <div
            v-if="usersData.users.length > 0"
            class="space-y-2"
          >
            <div
              v-for="user in usersData.users"
              :key="user.id"
              class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
            >
              <p class="font-medium">
                {{ user.name || 'No name' }}
              </p>
              <p class="text-gray-500 dark:text-gray-400">
                {{ user.email }}
              </p>
            </div>
          </div>
          <p
            v-else
            class="text-gray-500 dark:text-gray-400 text-sm"
          >
            No users yet. Sign up to create your first user!
          </p>
        </div>
      </UCard>

      <!-- Pinia Store Demo -->
      <UCard class="mb-6">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-layers"
              class="w-5 h-5 text-primary"
            />
            <h2 class="font-semibold">
              Pinia Store
            </h2>
          </div>
        </template>

        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          This demonstrates state management using Pinia. The state persists across page navigations.
        </p>

        <div class="flex items-center gap-4">
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-w-25">
            <p class="text-xs text-gray-500 uppercase font-bold">
              Count
            </p>
            <p class="text-2xl font-mono">
              {{ counter.count }}
            </p>
          </div>
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-w-25">
            <p class="text-xs text-gray-500 uppercase font-bold">
              Double
            </p>
            <p class="text-2xl font-mono">
              {{ counter.doubleCount }}
            </p>
          </div>
          <UButton
            icon="i-lucide-plus"
            size="xl"
            @click="counter.increment"
          >
            Increment
          </UButton>
        </div>
      </UCard>

      <!-- Workers AI Demo -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-brain"
              class="w-5 h-5 text-primary"
            />
            <h2 class="font-semibold">
              Workers AI
            </h2>
          </div>
        </template>

        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Generate text using Llama 3.1 running on Cloudflare's edge network.
        </p>

        <div class="space-y-4">
          <UTextarea
            v-model="aiPrompt"
            placeholder="Enter your prompt..."
            :rows="3"
            class="w-full"
          />

          <UButton
            :loading="aiLoading"
            :disabled="!aiPrompt.trim()"
            @click="generateAI"
          >
            Generate
          </UButton>

          <UAlert
            v-if="aiError"
            color="error"
            icon="i-lucide-alert-circle"
            :title="aiError"
          />

          <div
            v-if="aiResponse"
            class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Model: {{ aiResponse.model }}
            </p>
            <p class="whitespace-pre-wrap">
              {{ aiResponse.response }}
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
