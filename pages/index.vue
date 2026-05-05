<script setup lang="ts">
onMounted(() => {
  navigateTo('/dashboard')
})
</script>

<template>
  <div class="min-h-screen bg-dark-950 flex items-center justify-center">
    <div class="animate-pulse flex flex-col items-center">
      <div class="w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
      <p class="text-dark-400 font-bold uppercase tracking-widest text-xs">Initializing Admin Core...</p>
    </div>
  </div>
</template>
