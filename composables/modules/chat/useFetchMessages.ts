import { useChatState } from './useChatState'

export const useFetchMessages = () => {
  const { messages, messagesMap } = useChatState()
  const config = useRuntimeConfig()

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await $fetch(`${config.public.apiBase}/chat/conversations/${conversationId}/messages`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
      }) as any[]
      
      // Backend returns latest first (-createdAt), so we reverse for chat chronological order
      const fetchedMessages = [...response].reverse()
      
      // Merge with existing real-time messages to avoid duplicates
      const current = messagesMap.value[conversationId] || []
      const merged = [...fetchedMessages]
      
      current.forEach(msg => {
        if (!merged.some(m => m._id === msg._id)) {
          merged.push(msg)
        }
      })

      messagesMap.value[conversationId] = merged.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    } catch (e) {
      console.error('Failed to fetch messages', e)
    }
  }

  return { fetchMessages }
}
