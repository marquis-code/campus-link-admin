<template>
  <div class="relative">
    <button 
      @click="toggleDropdown" 
      class="relative p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-gray-900 transition-all active:scale-95"
    >
      <Bell class="w-5 h-5" />
      <span v-if="unreadCount > 0" class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary-600 border-2 border-white rounded-full animate-pulse"></span>
    </button>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-2"
    >
      <div v-if="isOpen" class="absolute right-0 mt-3 w-80 md:w-96 bg-white border border-gray-100 rounded-[32px] shadow-2xl z-[100] overflow-hidden">
        <div class="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 class="font-bold text-gray-900">Notifications</h3>
          <button @click="markAllRead" class="text-sm font-bold text-primary-600  tracking-wider hover:underline">Mark all as read</button>
        </div>

        <div class="max-h-[400px] overflow-y-auto">
          <div v-if="notifications.length === 0" class="py-16 text-center">
            <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BellOff class="w-8 h-8 text-gray-200" />
            </div>
            <p class="text-xs font-bold text-gray-400  tracking-widest">No notifications yet</p>
          </div>

          <div v-else class="divide-y divide-gray-50">
            <div 
              v-for="n in notifications" 
              :key="n._id" 
              class="p-5 hover:bg-gray-50/50 transition-colors flex gap-4 group cursor-pointer"
              @click="handleNotificationClick(n)"
            >
              <div class="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <component :is="getIcon(n.type)" class="w-5 h-5" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start mb-1">
                  <h4 class="text-[13px] font-bold text-gray-900 truncate pr-4">{{ n.title }}</h4>
                  <div v-if="!n.isRead" class="w-1.5 h-1.5 bg-primary-600 rounded-full shrink-0"></div>
                </div>
                <p class="text-[12px] text-gray-500 font-medium leading-relaxed mb-2">{{ n.message }}</p>
                <span class="text-[9px] font-bold text-gray-400  tracking-widest">{{ formatTime(n.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50/50 text-center">
           <NuxtLink to="/dashboard/notifications" @click="isOpen = false" class="text-[11px] font-bold text-gray-500  tracking-widest hover:text-gray-900 block w-full">View all history</NuxtLink>
        </div>
      </div>
    </Transition>

    <!-- Sound Element -->
    <audio ref="audioRef" preload="auto">
      <source src="https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Bell, BellOff, MessageSquare, Wallet, Users, Info, HelpCircle } from 'lucide-vue-next'

const isOpen = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)

const { 
  notifications, 
  unreadCount, 
  initSocket 
} = useNotificationState()

const { fetchNotifications, markAsRead, markAllAsRead } = useFetchNotifications()

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const getIcon = (type: string) => {
  switch (type) {
    case 'chat': return MessageSquare
    case 'withdrawal': return Wallet
    case 'user': return Users
    case 'info': return Info
    default: return HelpCircle
  }
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const handleNotificationClick = async (n: any) => {
  if (!n.isRead) {
    await markAsRead(n._id)
  }
  // Redirect based on type if needed
}

const markAllRead = async () => {
  await markAllAsRead()
}

// Watch for new notifications to play sound
watch(unreadCount, (newVal, oldVal) => {
  if (newVal > oldVal) {
    audioRef.value?.play().catch(() => {})
  }
})

onMounted(() => {
  initSocket()
  fetchNotifications()
  
  // Close dropdown on click outside
  window.addEventListener('click', (e) => {
    if (isOpen.value && !(e.target as Element).closest('.relative')) {
      isOpen.value = false
    }
  })
})
</script>
