<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const route = useRoute()
const error = computed(() => route.query.error as string | undefined)

const isLogin = ref(true)
const loading = ref(false)
const formError = ref<string | null>(null)

const form = reactive({
  email: '',
  password: '',
  name: '',
})

const turnstileToken = ref('')
const turnstileRef = ref()

async function handleSubmit() {
  loading.value = true
  formError.value = null

  try {
    const endpoint = isLogin.value ? '/api/auth/login' : '/api/auth/register'
    await $fetch(endpoint, {
      method: 'POST',
      body: {
        email: form.email,
        password: form.password,
        turnstile: turnstileToken.value,
        ...(isLogin.value ? {} : { name: form.name }),
      },
    })

    // Refresh session and redirect
    await refreshNuxtData()
    navigateTo('/app')
  }
  catch (e) {
    formError.value = (e as { data?: { message?: string } }).data?.message || 'An error occurred. Please try again.'
  }
  finally {
    loading.value = false
  }
}

function toggleMode() {
  isLogin.value = !isLogin.value
  formError.value = null
  turnstileRef.value?.reset()
}
</script>

<template>
  <UContainer class="py-16">
    <div class="max-w-md mx-auto">
      <UCard>
        <template #header>
          <h1 class="text-2xl font-bold text-center">
            {{ isLogin ? 'Sign In' : 'Create Account' }}
          </h1>
          <p class="text-center text-gray-500 dark:text-gray-400 mt-2">
            {{ isLogin ? 'Sign in to access your dashboard' : 'Create an account to get started' }}
          </p>
        </template>

        <!-- Error message -->
        <UAlert
          v-if="error || formError"
          color="error"
          icon="i-lucide-alert-circle"
          :title="formError || 'Authentication failed'"
          class="mb-4"
        />

        <form
          class="space-y-4"
          @submit.prevent="handleSubmit"
        >
          <!-- Name field (register only) -->
          <UFormField
            v-if="!isLogin"
            label="Name"
          >
            <UInput
              v-model="form.name"
              placeholder="Your name"
              icon="i-lucide-user"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <!-- Email field -->
          <UFormField
            label="Email"
            required
          >
            <UInput
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              icon="i-lucide-mail"
              size="lg"
              required
              class="w-full"
            />
          </UFormField>

          <!-- Password field -->
          <UFormField
            label="Password"
            required
          >
            <UInput
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              icon="i-lucide-lock"
              size="lg"
              required
              :minlength="8"
              class="w-full"
            />
            <template
              v-if="!isLogin"
              #hint
            >
              <span class="text-xs">At least 8 characters</span>
            </template>
          </UFormField>

          <Turnstile
            ref="turnstileRef"
            v-model="turnstileToken"
          />

          <UButton
            type="submit"
            block
            size="lg"
            :loading="loading"
          >
            {{ isLogin ? 'Sign In' : 'Create Account' }}
          </UButton>
        </form>

        <UButton
          to="/auth/google"
          external
          icon="i-simple-icons-google"
          color="neutral"
          variant="subtle"
          block
          size="xl"
          class="rounded-2xl mt-5"
        >
          Google
        </UButton>

        <template #footer>
          <p class="text-center text-sm text-gray-500 dark:text-gray-400">
            {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
            <button
              type="button"
              class="text-primary font-medium hover:underline"
              @click="toggleMode"
            >
              {{ isLogin ? 'Sign up' : 'Sign in' }}
            </button>
          </p>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>
