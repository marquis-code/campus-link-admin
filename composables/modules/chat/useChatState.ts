import { ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import { useUser } from '@/composables/modules/auth/user'

const conversations = ref<any[]>([])
const activeConversation = ref<any>(null)
const messages = ref<any[]>([])
const isTyping = ref(false)
const onlineUsers = ref<Set<string>>(new Set())
const socket = ref<Socket | null>(null)

export const useChatState = () => {
  const { token } = useUser()
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase.replace('/api', '')

  const initSocket = () => {
    if (socket.value || !token.value) return

    socket.value = io(`${baseUrl}/chat`, {
      auth: { token: localStorage.getItem('auth_token') },
    })

    socket.value.on('connect', () => {
      console.log('💬 Chat socket connected')
    })

    socket.value.on('new_message', (message) => {
      if (activeConversation.value?._id === message.conversation) {
        messages.value.push(message)
        socket.value?.emit('mark_read', { conversationId: message.conversation, messageId: message._id })
      }
      
      const conv = conversations.value.find(c => c._id === message.conversation)
      if (conv) {
        conv.lastMessage = message
        conv.updatedAt = new Date().toISOString()
        
        // Update unread count if conversation is not active
        if (activeConversation.value?._id !== message.conversation) {
          conv.unreadCount = (conv.unreadCount || 0) + 1
        }
      }
    })

    socket.value.on('user_typing', (data) => {
      if (activeConversation.value?._id === data.conversationId) {
        isTyping.value = data.isTyping
      }
    })

    socket.value.on('presence', (data) => {
      if (data.online) {
        onlineUsers.value.add(data.userId)
      } else {
        onlineUsers.value.delete(data.userId)
      }
    })

    socket.value.on('message_read', (data) => {
      const msg = messages.value.find(m => m._id === data.messageId)
      if (msg) {
        msg.isRead = true
        msg.readBy = msg.readBy || []
        if (!msg.readBy.includes(data.readBy)) {
          msg.readBy.push(data.readBy)
        }
      }
    })
  }

  return {
    socket,
    conversations,
    activeConversation,
    messages,
    isTyping,
    onlineUsers,
    initSocket
  }
}
