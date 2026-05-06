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

<style>
body {
    font-family: 'Onest', sans-serif;
}
</style>