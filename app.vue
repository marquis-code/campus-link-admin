<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UiToastContainer />
    <UiConfirmModal />
  </div>
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