<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/50 backdrop-blur-sm">
    <div class="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-dark-100 animate-fade-in-up">
      <div class="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
        <Icon name="ph:warning-circle-bold" class="text-3xl" />
      </div>
      <h3 class="text-2xl font-black text-dark-900 mb-2">{{ title }}</h3>
      <p class="text-dark-500 font-medium mb-8 leading-relaxed">{{ message }}</p>
      
      <div class="flex gap-4">
        <button @click="cancel" class="flex-1 py-4 bg-slate-100 text-dark-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
        <button @click="confirm" class="flex-1 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  title: { type: String, default: 'Confirm Action' },
  message: { type: String, default: 'Are you sure you want to proceed?' },
  confirmText: { type: String, default: 'Confirm' }
})

const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => emit('confirm')
const cancel = () => emit('cancel')
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
