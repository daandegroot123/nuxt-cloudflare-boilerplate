<script setup lang="ts">
/**
 * Cloudflare Turnstile Wrapper Component
 * Handles script loading and widget lifecycle
 */

const props = defineProps<{
  modelValue?: string
  sitekey?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'error', error: any): void
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
  if (!container.value || !(window as any).turnstile) return

  // Clean up existing widget if any
  if (widgetId.value !== null) {
    (window as any).turnstile.remove(widgetId.value)
    widgetId.value = null
  }

  try {
    widgetId.value = (window as any).turnstile.render(container.value, {
      'sitekey': sitekey.value,
      'callback': (token: string) => {
        emit('update:modelValue', token)
      },
      'expired-callback': () => {
        emit('update:modelValue', '')
        emit('expired')
      },
      'error-callback': (err: any) => {
        emit('error', err)
      },
    })
  }
  catch (e) {
    console.error('Failed to render Turnstile:', e)
  }
}

// Polling for turnstile availability since window is not reactive
let checkInterval: any = null

onMounted(() => {
  if (typeof window !== 'undefined' && (window as any).turnstile) {
    isLoaded.value = true
  }
  else if (typeof window !== 'undefined') {
    checkInterval = setInterval(() => {
      if ((window as any).turnstile) {
        isLoaded.value = true
        clearInterval(checkInterval)
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
  if (widgetId.value !== null && (window as any).turnstile) {
    (window as any).turnstile.remove(widgetId.value)
  }
})

// Define public methods
defineExpose({
  reset: () => {
    if (widgetId.value !== null && (window as any).turnstile) {
      (window as any).turnstile.reset(widgetId.value)
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
