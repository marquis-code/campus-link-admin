import { ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import { useUser } from '@/composables/modules/auth/user'

const notifications = ref<any[]>([])
const unreadCount = ref(0)
let socket: Socket | null = null

export const useNotificationState = () => {
  const { token } = useUser()
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase.replace('/api', '')

  const initSocket = () => {
    if (socket || !token.value) return

    // Connect to /notifications namespace
    socket = io(`${baseUrl}/notifications`, {
      auth: { token: token.value },
    })

    socket.on('connect', () => {
      console.log('🔔 Notifications socket connected')
    })

    socket.on('notification', (notification) => {
      notifications.value.unshift(notification)
      // Sound is handled in the UI component by watching unreadCount
      unreadCount.value++
    })

    socket.on('unread_count', (data) => {
      unreadCount.value = data.count
    })

    socket.on('system_alert', (alert) => {
      notifications.value.unshift({
        _id: Date.now().toString(),
        title: alert.title,
        message: alert.message,
        type: 'info',
        createdAt: new Date().toISOString(),
        isRead: false
      })
      unreadCount.value++
    })
  }

  return {
    socket,
    notifications,
    unreadCount,
    initSocket
  }
}
