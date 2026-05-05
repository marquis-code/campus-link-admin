import { ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import { useUser } from '@/composables/modules/auth/user'

const conversations = ref<any[]>([])
const activeConversation = ref<any>(null)
const messages = ref<any[]>([])
const isTyping = ref(false)
let socket: Socket | null = null

export const useChatState = () => {
  const { token } = useUser()
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase.replace('/api', '')

  const initSocket = () => {
    if (socket || !token.value) return

    socket = io(baseUrl, {
      auth: { token: token.value },
    })

    socket.on('new_message', (message) => {
      if (activeConversation.value?._id === message.conversation) {
        messages.value.push(message)
      }
      const conv = conversations.value.find(c => c._id === message.conversation)
      if (conv) {
        conv.lastMessage = message
        conv.updatedAt = new Date()
      }
    })

    socket.on('user_typing', (data) => {
      if (activeConversation.value?._id === data.conversationId) {
        isTyping.value = data.isTyping
      }
    })
  }

  return {
    socket,
    conversations,
    activeConversation,
    messages,
    isTyping,
    initSocket
  }
}
