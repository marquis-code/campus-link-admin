<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { fetchUser } = useAuth()

onMounted(() => {
  fetchUser()
})
</script>
