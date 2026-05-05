import { useChatState } from './useChatState'
import { useUser } from '@/composables/modules/auth/user'

export const useFetchMessages = () => {
  const { messages } = useChatState()
  const { token } = useUser()
  const config = useRuntimeConfig()

  const fetchMessages = async (conversationId: string) => {
    const response = await $fetch(`${config.public.apiBase}/chat/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token.value}` }
    }) as any
    messages.value = response.reverse()
  }

  return { fetchMessages }
}
