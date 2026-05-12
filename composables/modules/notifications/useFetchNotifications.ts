import { useNotificationState } from './useNotificationState'
import { useUser } from '@/composables/modules/auth/user'

export const useFetchNotifications = () => {
  const { notifications, unreadCount } = useNotificationState()
  const { token } = useUser()
  const config = useRuntimeConfig()

  const fetchNotifications = async () => {
    try {
        const response = await $fetch(`${config.public.apiBase}/notifications`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
        }) as any
        notifications.value = response.notifications || response || []
        unreadCount.value = response.unreadCount || 0
    } catch (e) {
        console.error('Failed to fetch notifications', e)
        notifications.value = []
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await $fetch(`${config.public.apiBase}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
      })
      await fetchNotifications()
    } catch (e) {
      console.error('Failed to mark notification as read', e)
    }
  }

  const markAllAsRead = async () => {
    try {
      await $fetch(`${config.public.apiBase}/notifications/read-all`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
      })
      await fetchNotifications()
    } catch (e) {
      console.error('Failed to mark all notifications as read', e)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await $fetch(`${config.public.apiBase}/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
      })
      await fetchNotifications()
    } catch (e) {
      console.error('Failed to delete notification', e)
    }
  }

  return { 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  }
}
