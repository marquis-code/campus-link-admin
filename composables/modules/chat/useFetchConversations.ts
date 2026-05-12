import { useChatState } from './useChatState'
import { useUser } from '@/composables/modules/auth/user'

export const useFetchConversations = () => {
  const { conversations } = useChatState()
  const { token } = useUser()
  const config = useRuntimeConfig()

  const fetchConversations = async (isAdmin = false) => {
    const endpoint = isAdmin ? '/chat/support/conversations' : '/chat/conversations'
    try {
      const response = await $fetch(`${config.public.apiBase}${endpoint}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
      }) as any
      conversations.value = response
    } catch (e) {
      console.error('Failed to fetch conversations', e)
    }
  }

  return { fetchConversations }
}
