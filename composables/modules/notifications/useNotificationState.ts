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

    socket = io(baseUrl, {
      auth: { token: token.value },
    })

    socket.on('connect', () => {
      socket?.emit('join_user_room')
    })

    socket.on('notification', (notification) => {
      notifications.value.unshift(notification)
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
