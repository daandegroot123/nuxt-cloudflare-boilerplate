<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
/**
 * Cloudflare Turnstile Wrapper Component
 * Handles script loading and widget lifecycle
 */

interface TurnstileInstance {
  remove: (id: string) => void
  render: (container: HTMLElement, options: Record<string, unknown>) => string
  reset: (id: string) => void
}

const getTurnstile = () => {
  if (typeof window !== 'undefined') {
    return (window as unknown as { turnstile?: TurnstileInstance }).turnstile
  }
  return undefined
}

const props = defineProps<{
  modelValue?: string
  sitekey?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'error', error: unknown): void
  (e: 'expired'): void
}>()

const config = useRuntimeConfig()
const isLocalhost = process.env.NODE_ENV === 'development'

// Use developer sitekey on localhost if none provided
const sitekey = computed(() => {
  if (props.sitekey) return props.sitekey
  if (isLocalhost) return '1x00000000000000000000AA'
  return config.public.cloudflareTurnstileSiteKey as string
})

const container = ref<HTMLElement | null>(null)
const widgetId = ref<string | null>(null)
const isLoaded = ref(false)

// Load Turnstile script conditionally
useHead({
  script: [
    {
      src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
      async: true,
      defer: true,
      onload: () => {
        isLoaded.value = true
      },
    },
  ],
})

function renderWidget() {
  const ts = getTurnstile()
  if (!container.value || !ts) return

  // Clean up existing widget if any
  if (widgetId.value !== null) {
    ts.remove(widgetId.value)
    widgetId.value = null
  }

  try {
    widgetId.value = ts.render(container.value, {
      'sitekey': sitekey.value,
      'callback': (token: string) => {
        emit('update:modelValue', token)
      },
      'expired-callback': () => {
        emit('update:modelValue', '')
        emit('expired')
      },
      'error-callback': (err: unknown) => {
        emit('error', err)
      },
    })
  }
  catch (e) {
    console.error('Failed to render Turnstile:', e)
  }
}

// Polling for turnstile availability since window is not reactive
let checkInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (getTurnstile()) {
    isLoaded.value = true
  }
  else if (typeof window !== 'undefined') {
    checkInterval = setInterval(() => {
      if (getTurnstile()) {
        isLoaded.value = true
        if (checkInterval) clearInterval(checkInterval)
      }
    }, 100)
  }
})

// Watch for readiness
watch([container, isLoaded, sitekey], ([newContainer, loaded, currentSitekey]) => {
  if (newContainer && loaded && currentSitekey) {
    // Small delay to ensure Turnstile is fully initialized
    setTimeout(renderWidget, 100)
  }
}, { immediate: true })

onUnmounted(() => {
  if (checkInterval) clearInterval(checkInterval)
  const ts = getTurnstile()
  if (widgetId.value !== null && ts) {
    ts.remove(widgetId.value)
  }
})

// Define public methods
defineExpose({
  reset: () => {
    const ts = getTurnstile()
    if (widgetId.value !== null && ts) {
      ts.reset(widgetId.value)
      emit('update:modelValue', '')
    }
  },
})
</script>

<template>
  <div
    ref="container"
    class="flex justify-center"
  />
</template>
