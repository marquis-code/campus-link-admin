<template>
  <div 
    :class="[
      'animate-pulse bg-dark-100 border-2 border-dark-900/5',
      roundedClass,
      customClass
    ]"
    :style="{ width, height }"
  ></div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  customClass?: string;
}>(), {
  width: '100%',
  height: '20px',
  rounded: 'md',
  customClass: ''
});

const roundedClass = computed(() => {
  const maps = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full'
  };
  return maps[props.rounded] || 'rounded-md';
});
</script>
