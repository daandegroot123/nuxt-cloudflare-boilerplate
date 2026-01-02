<script setup>
const route = useRoute()
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage :page-key="route => route.fullPath" />
    </NuxtLayout>
  </UApp>
</template>
