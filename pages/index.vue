<script setup lang="ts">
const { token } = useUser()

onMounted(() => {
  if (token.value) {
    navigateTo('/dashboard')
  } else {
    navigateTo('/login')
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center font-['Onest',sans-serif]">
    <div class="animate-pulse flex flex-col items-center">
      <div class="w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg shadow-primary-600/30"></div>
      <p class="text-dark-500 font-bold uppercase  text-xs">Initializing Admin Core...</p>
    </div>
  </div>
</template>
