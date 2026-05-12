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
      <div v-if="isOpen" class="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6 overflow-hidden">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-md" @click="$emit('cancel')"></div>

        <!-- Modal Content -->
        <Transition 
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-8"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-8"
        >
          <div v-if="isOpen" class="relative bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] w-full max-w-md overflow-hidden transform transition-all">
            <div class="h-2 w-full bg-primary-500"></div>

            <div class="p-10 space-y-8">
              <div class="text-center space-y-3">
                <h3 class="text-2xl font-bold text-gray-900 ">{{ title }}</h3>
                <p class="text-gray-500 font-medium leading-relaxed">{{ message }}</p>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-black  tracking-widest text-gray-400 ml-1">Admin notes</label>
                <textarea 
                  v-model="input" 
                  class="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none text-sm font-medium transition-all resize-none"
                  :placeholder="placeholder"
                  rows="3"
                ></textarea>
              </div>

              <div class="flex flex-col gap-3">
                <button 
                  @click="$emit('confirm', input)"
                  class="w-full py-3 px-6 rounded-2xl font-bold text-white bg-black transition-all active:scale-[0.98] shadow-lg shadow-primary-200"
                >
                  {{ confirmText }}
                </button>
                <button 
                  @click="$emit('cancel')"
                  class="w-full py-4 px-6 rounded-2xl bg-gray-300 font-bold text-gray-700 transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  isOpen: boolean
  title: string
  message: string
  confirmText: string
  placeholder?: string
}>()

const input = ref('')

defineEmits(['confirm', 'cancel'])
</script>
