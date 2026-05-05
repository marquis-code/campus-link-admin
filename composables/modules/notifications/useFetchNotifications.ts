import { useNotificationState } from './useNotificationState'
import { useUser } from '@/composables/modules/auth/user'

export const useFetchNotifications = () => {
  const { notifications, unreadCount } = useNotificationState()
  const { token } = useUser()
  const config = useRuntimeConfig()

  const fetchNotifications = async () => {
    try {
        const response = await $fetch(`${config.public.apiBase}/notifications`, {
            headers: { Authorization: `Bearer ${token.value}` }
        }) as any
        notifications.value = response.notifications
        unreadCount.value = response.unreadCount
    } catch (e) {
        console.error('Failed to fetch notifications', e)
    }
  }

  return { fetchNotifications }
}
