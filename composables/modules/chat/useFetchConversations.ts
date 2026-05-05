import { useChatState } from './useChatState'
import { useUser } from '@/composables/modules/auth/user'

export const useFetchConversations = () => {
  const { conversations } = useChatState()
  const { token } = useUser()
  const config = useRuntimeConfig()

  const fetchConversations = async () => {
    const response = await $fetch(`${config.public.apiBase}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token.value}` }
    }) as any
    conversations.value = response
  }

  return { fetchConversations }
}
