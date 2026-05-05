<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
    <!-- Chat Window -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-4 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100 scale-100"
      leave-to-class="translate-y-4 opacity-0 scale-95"
    >
      <div v-if="isOpen" class="mb-4 w-[380px] h-[550px] bg-white rounded-2xl border-2 border-dark-900 overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="bg-dark-900 text-white p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border-2 border-white/20">
              <Icon name="ph:user-circle-bold" class="text-2xl" />
            </div>
            <div>
              <h3 class="font-bold text-sm">CampusLink Support</h3>
              <p class="text-[10px] text-primary-200 flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <button @click="isOpen = false" class="hover:bg-white/10 p-1 rounded-lg transition-colors">
            <Icon name="ph:x-bold" />
          </button>
        </div>

        <!-- Messages -->
        <div ref="messageContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-50/30">
          <div v-for="msg in messages" :key="msg._id" 
            :class="['flex', msg.sender._id === user?._id ? 'justify-end' : 'justify-start']"
          >
            <div :class="[
              'max-w-[80%] p-3 rounded-2xl text-sm border-2',
              msg.sender._id === user?._id 
                ? 'bg-primary-600 text-white border-primary-700 rounded-tr-none' 
                : 'bg-white text-dark-900 border-dark-900 rounded-tl-none'
            ]">
              <p v-if="msg.type === 'text'">{{ msg.content }}</p>
              <img v-if="msg.type === 'image'" :src="msg.mediaUrl" class="rounded-lg mb-1" />
              <audio v-if="msg.type === 'voice'" :src="msg.mediaUrl" controls class="max-w-full h-8" />
              <video v-if="msg.type === 'video'" :src="msg.mediaUrl" controls class="rounded-lg max-w-full" />
              <div class="text-[10px] mt-1 opacity-70 text-right">
                {{ formatTime(msg.createdAt) }}
              </div>
            </div>
          </div>
          <div v-if="isTyping" class="text-[10px] text-dark-400 italic">Support is typing...</div>
        </div>

        <!-- Input Area -->
        <div class="p-4 bg-white border-t-2 border-dark-900">
          <div class="flex items-center gap-2">
            <button @click="triggerFileUpload" class="p-2 hover:bg-dark-50 rounded-lg border-2 border-transparent hover:border-dark-900 transition-all">
              <Icon name="ph:paperclip-bold" />
            </button>
            <input 
              v-model="newMessage" 
              @keydown.enter="handleSendMessage"
              @input="handleTyping"
              type="text" 
              placeholder="Type a message..." 
              class="flex-1 px-4 py-2 bg-dark-50 border-2 border-dark-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button 
              @click="handleSendMessage"
              :disabled="!newMessage.trim()"
              class="p-2 bg-primary-600 text-white rounded-xl border-2 border-primary-700 hover:bg-primary-700 disabled:opacity-50 transition-all"
            >
              <Icon name="ph:paper-plane-right-fill" />
            </button>
          </div>
          <!-- Hidden Inputs for Media -->
          <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" accept="image/*,video/*,.pdf" />
        </div>
      </div>
    </transition>

    <!-- Floating Bubble -->
    <button 
      @click="toggleChat"
      :class="[
        'w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none',
        isOpen ? 'bg-dark-900 text-white border-white' : 'bg-primary-600 text-white border-dark-900'
      ]"
    >
      <Icon :name="isOpen ? 'ph:x-bold' : 'ph:chat-teardrop-dots-fill'" class="text-3xl" />
      <span v-if="!isOpen && unreadChatCount > 0" class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full border-2 border-dark-900 flex items-center justify-center font-bold">
        {{ unreadChatCount }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useChatState } from '@/composables/modules/chat/useChatState'
import { useSendMessage } from '@/composables/modules/chat/useSendMessage'
import { useFetchConversations } from '@/composables/modules/chat/useFetchConversations'
import { useFetchMessages } from '@/composables/modules/chat/useFetchMessages'
import { useUser } from '@/composables/modules/auth/user'

const { user } = useUser()
const { 
  initSocket, 
  messages, 
  isTyping, 
  conversations,
  socket
} = useChatState()

const { sendMessage, sendTyping } = useSendMessage()
const { fetchConversations } = useFetchConversations()
const { fetchMessages } = useFetchMessages()

const joinConversation = (conversationId: string) => {
  socket?.emit('join_room', conversationId)
}

const isOpen = ref(false)
const newMessage = ref('')
const unreadChatCount = ref(0)
const messageContainer = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const toggleChat = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await ensureSupportConversation()
    scrollToBottom()
  }
}

const ensureSupportConversation = async () => {
  // Find or create support conversation
  let supportConv = conversations.value.find(c => c.isSupport)
  if (!supportConv) {
    // Call API to create support conversation
    const config = useRuntimeConfig()
    try {
      const response = await $fetch(`${config.public.apiBase}/chat/conversations`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: { participantId: 'ADMIN', isSupport: true, subject: 'Customer Support' }
      }) as any
      supportConv = response
      conversations.value.push(supportConv)
    } catch (e) {
      console.error('Failed to create support chat', e)
    }
  }
  
  if (supportConv) {
    joinConversation(supportConv._id)
    await fetchMessages(supportConv._id)
  }
}

const handleSendMessage = () => {
  if (!newMessage.value.trim()) return
  
  const supportConv = conversations.value.find(c => c.isSupport)
  if (supportConv) {
    sendMessage({
      conversationId: supportConv._id,
      type: 'text',
      content: newMessage.value
    })
    newMessage.value = ''
    scrollToBottom()
  }
}

const handleTyping = () => {
  const supportConv = conversations.value.find(c => c.isSupport)
  if (supportConv) {
    sendTyping(supportConv._id, true)
    // Debounce typing indicator
    setTimeout(() => sendTyping(supportConv._id, false), 3000)
  }
}

const triggerFileUpload = () => fileInput.value?.click()

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return
  
  const file = target.files[0]
  // Upload to cloudinary via our upload module
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const config = useRuntimeConfig()
    const response = await $fetch(`${config.public.apiBase}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData
    }) as any
    
    const supportConv = conversations.value.find(c => c.isSupport)
    if (supportConv) {
      sendMessage({
        conversationId: supportConv._id,
        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file',
        mediaUrl: response.url
      })
    }
  } catch (e) {
    console.error('Upload failed', e)
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  initSocket()
  fetchConversations()
})
</script>
