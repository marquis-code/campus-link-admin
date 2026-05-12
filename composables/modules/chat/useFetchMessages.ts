import { useChatState } from './useChatState'

export const useFetchMessages = () => {
  const { messages } = useChatState()
  const config = useRuntimeConfig()

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await $fetch(`${config.public.apiBase}/chat/conversations/${conversationId}/messages`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
      }) as any[]
      
      // Backend returns latest first (-createdAt), so we reverse for chat chronological order
      messages.value = [...response].reverse()
    } catch (e) {
      console.error('Failed to fetch messages', e)
      messages.value = []
    }
  }

  return { fetchMessages }
}
