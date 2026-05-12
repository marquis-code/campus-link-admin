<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
      <TransitionGroup name="toast">
        <div 
          v-for="toast in toasts" 
          :key="toast.id"
          class="pointer-events-auto overflow-hidden bg-white border-2 border-dark-100 rounded-3xl shadow-xl p-4 flex items-center gap-4 transition-all duration-300"
          :class="[
            toast.toastType === 'success' ? 'border-emerald-500' : 
            toast.toastType === 'error' ? 'border-red-500' : 
            toast.toastType === 'warning' ? 'border-amber-500' : 'border-primary-500'
          ]"
        >
          <div 
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            :class="[
              toast.toastType === 'success' ? 'bg-emerald-50 text-emerald-600' : 
              toast.toastType === 'error' ? 'bg-red-50 text-red-600' : 
              toast.toastType === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-primary-50 text-primary-600'
            ]"
          >
            <Icon 
              :name="
                toast.toastType === 'success' ? 'ph:check-circle-bold' : 
                toast.toastType === 'error' ? 'ph:warning-circle-bold' : 
                toast.toastType === 'warning' ? 'ph:warning-bold' : 'ph:info-bold'
              " 
              class="text-2xl"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-black text-dark-900 text-sm tracking-tight">{{ toast.title }}</h4>
            <p class="text-dark-500 text-xs font-medium leading-tight mt-0.5 line-clamp-2">{{ toast.message }}</p>
          </div>
          <button @click="removeToast(toast.id)" class="text-dark-300 hover:text-dark-900 transition-colors">
            <Icon name="ph:x-bold" class="text-lg" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
const { toasts, removeToast } = useCustomToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}
</style>
