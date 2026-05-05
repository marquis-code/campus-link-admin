<template>
  <div class="flex flex-col items-center justify-center p-12 text-center bg-white rounded-[40px] border-4 border-dark-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
    <div class="w-24 h-24 bg-primary-100 text-primary-600 rounded-3xl flex items-center justify-center mb-6 border-4 border-dark-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <Icon :name="icon" class="text-5xl" />
    </div>
    <h3 class="text-2xl font-black text-dark-900 tracking-tight">{{ title }}</h3>
    <p class="text-dark-500 mt-2 max-w-xs font-medium leading-relaxed">{{ description }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  description: string;
}>();
</script>
