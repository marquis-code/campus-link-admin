<template>
  <div class="flex flex-col items-center justify-center p-12 text-center bg-white rounded-[32px] border border-gray-100 shadow-sm">
    <div class="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
      <component :is="icon" class="w-10 h-10 text-gray-300" />
    </div>
    <h3 class="text-xl font-bold text-gray-900 tracking-tight">{{ title }}</h3>
    <p class="text-gray-500 mt-2 max-w-xs font-medium text-sm leading-relaxed">{{ description }}</p>
    <div class="mt-8">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: any;
  title: string;
  description: string;
}>();
</script>
