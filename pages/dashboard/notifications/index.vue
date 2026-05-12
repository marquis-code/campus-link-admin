<template>
  <div class="space-y-8 relative">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">System Notifications</h1>
        <p class="text-gray-500 font-medium text-sm">Monitor platform activities and support inquiries.</p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="markAllAsRead" 
          :disabled="unreadCount === 0"
          class="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
        >
          <CheckCheck class="w-4 h-4" />
          Mark all as read
        </button>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <UiSkeleton v-for="i in 8" :key="i" height="80px" rounded="2xl" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!notifications?.length" class="py-12">
      <UiEmptyState 
        :icon="Bell"
        title="No notifications yet"
        description="All clear! We'll notify you here when there are new activities on the platform."
      />
    </div>  

    <!-- Notifications Table -->
    <div v-else class="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100">
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide uppercase">Event</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide uppercase">Message</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide uppercase">Category</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide uppercase">Date & Time</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr 
              v-for="n in notifications" 
              :key="n._id" 
              class="hover:bg-gray-50/30 transition-colors group"
            >
              <td class="px-8 py-5" @click="handleNotificationClick(n)">
                <div class="flex items-center gap-4">
                  <div 
                    class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    :class="[
                      n.isRead ? 'bg-gray-50 text-gray-400' : 'bg-primary-50 text-primary-600'
                    ]"
                  >
                    <component :is="getIcon(n.type)" class="w-5 h-5" />
                  </div>
                  <span class="font-bold text-gray-900 text-sm" :class="{'opacity-60': n.isRead}">{{ n.title }}</span>
                </div>
              </td>
              <td class="px-8 py-5 text-[13px] text-gray-500 font-medium max-w-md truncate" @click="handleNotificationClick(n)">
                {{ n.message }}
              </td>
              <td class="px-8 py-5" @click="handleNotificationClick(n)">
                <span 
                  class="px-2.5 py-1 rounded-lg text-sm font-bold uppercase tracking-tight"
                  :class="getCategoryClass(n.type)"
                >
                  {{ n.type }}
                </span>
              </td>
              <td class="px-8 py-5 text-[12px] text-gray-400 font-bold uppercase tracking-tighter" @click="handleNotificationClick(n)">
                {{ formatDateTime(n.createdAt) }}
              </td>
              <td class="px-8 py-5 text-right">
                <button @click.stop="confirmArchive(n)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-gray-50 shadow-sm">
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  Bell, 
  CheckCheck, 
  MessageSquare, 
  Wallet, 
  Users, 
  Info, 
  HelpCircle,
  Trash2
} from 'lucide-vue-next'

definePageMeta({
  layout: 'default'
})

const { 
  notifications, 
  unreadCount, 
} = useNotificationState()

const { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } = useFetchNotifications()
const { confirm } = useConfirmDialog()
const loading = ref(false)

const getIcon = (type: string) => {
  switch (type) {
    case 'chat': return MessageSquare
    case 'withdrawal': return Wallet
    case 'user': return Users
    case 'info': return Info
    default: return HelpCircle
  }
}

const getCategoryClass = (type: string) => {
  switch (type) {
    case 'chat': return 'bg-emerald-50 text-emerald-600'
    case 'withdrawal': return 'bg-amber-50 text-amber-600'
    case 'user': return 'bg-indigo-50 text-indigo-600'
    case 'info': return 'bg-blue-50 text-blue-600'
    default: return 'bg-gray-50 text-gray-500'
  }
}

const formatDateTime = (date: string) => {
  const d = new Date(date)
  return `${d.toLocaleDateString()} • ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

const handleNotificationClick = async (n: any) => {
  if (!n.isRead) {
    await markAsRead(n._id)
  }
}

const confirmArchive = async (n: any) => {
  const confirmed = await confirm({
    title: 'Archive Notification',
    message: 'Are you sure you want to remove this notification from your history?',
    variant: 'danger',
    confirmText: 'Yes, archive'
  })

  if (confirmed) {
    await deleteNotification(n._id)
    await fetchNotifications()
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await fetchNotifications()
  } finally {
    loading.value = false
  }
})
</script>
