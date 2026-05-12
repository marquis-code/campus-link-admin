<template>
  <Teleport to="body">
    <Transition 
      enter-active-class="transition duration-300 ease-out" 
      enter-from-class="opacity-0" 
      enter-to-class="opacity-100" 
      leave-active-class="transition duration-200 ease-in" 
      leave-from-class="opacity-100" 
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="$emit('close')"></div>
        
        <!-- Modal Content -->
        <Transition 
          enter-active-class="transition duration-300 ease-out" 
          enter-from-class="opacity-0 scale-95 translate-y-4" 
          enter-to-class="opacity-100 scale-100 translate-y-0" 
          leave-active-class="transition duration-200 ease-in" 
          leave-from-class="opacity-100 scale-100 translate-y-0" 
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div 
            v-if="isOpen"
            :class="[
              'relative bg-white shadow-2xl rounded-[32px] w-full transform transition-all overflow-hidden',
              maxWidthClass
            ]"
          >
            <div class="p-8">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-900 leading-none">{{ title }}</h3>
                <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                  <X class="w-4 h-4" />
                </button>
              </div>
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  isOpen: boolean
  title: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}>(), {
  maxWidth: 'md'
})

defineEmits(['close'])

const maxWidthClass = computed(() => {
  return {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  }[props.maxWidth]
})
</script>
