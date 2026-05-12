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
      <div v-if="state.visible" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 overflow-hidden">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-md" @click="handleCancel"></div>

        <!-- Modal Content -->
        <Transition 
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-8"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-8"
        >
          <div v-if="state.visible" class="relative bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] w-full max-w-md overflow-hidden transform transition-all">
            <!-- Decorative Header -->
            <div 
              class="h-2 w-full" 
              :class="[
                state.variant === 'danger' ? 'bg-red-500' : 
                state.variant === 'warning' ? 'bg-amber-500' : 'bg-primary-500'
              ]"
            ></div>

            <div class="p-10 text-center">
              <!-- Icon Container -->
              <div 
                class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner relative"
                :class="[
                  state.variant === 'danger' ? 'bg-red-50 text-red-600' : 
                  state.variant === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-primary-50 text-primary-600'
                ]"
              >
                <!-- Outer Pulse Ring -->
                <div class="absolute inset-0 rounded-2xl animate-ping opacity-20" :class="state.variant === 'danger' ? 'bg-red-400' : state.variant === 'warning' ? 'bg-amber-400' : 'bg-primary-400'"></div>
                
                <component 
                  :is="getIcon" 
                  class="w-7 h-7 relative z-10"
                />
              </div>
              
              <div class="space-y-3 mb-10">
                <h3 class="text-2xl font-bold text-gray-900 tracking-tight">{{ state.title }}</h3>
                <p class="text-gray-500 font-medium leading-relaxed px-2">{{ state.message }}</p>
              </div>

              <!-- Actions -->
              <div class="flex flex-col gap-3">
                <button 
                  @click="handleConfirm"
                  class="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all active:scale-[0.98] shadow-lg"
                  :class="[
                    state.variant === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 
                    state.variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-primary-600 hover:bg-primary-700 shadow-primary-200'
                  ]"
                >
                  {{ state.confirmText }}
                </button>
                <button 
                  @click="handleCancel"
                  class="w-full py-4 px-6 rounded-2xl font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all active:scale-[0.98]"
                >
                  {{ state.cancelText }}
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
import { computed } from 'vue'
import { Trash2, AlertTriangle, HelpCircle, LogOut } from 'lucide-vue-next'

const { state, handleConfirm, handleCancel } = useConfirmDialog()

const getIcon = computed(() => {
  if (state.title.toLowerCase().includes('sign out') || state.title.toLowerCase().includes('logout')) return LogOut
  if (state.variant === 'danger') return Trash2
  if (state.variant === 'warning') return AlertTriangle
  return HelpCircle
})
</script>
