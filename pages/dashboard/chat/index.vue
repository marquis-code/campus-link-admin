<template>
  <div class="h-[calc(100vh-120px)] flex bg-white border-2 border-dark-900 rounded-3xl overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
    <!-- Sidebar -->
    <div class="w-80 border-r-2 border-dark-900 flex flex-col bg-dark-50/30">
      <div class="p-6 border-b-2 border-dark-900 bg-white">
        <h1 class="text-xl font-black text-dark-900">Support Center</h1>
        <p class="text-xs text-dark-400 mt-1">Manage customer conversations</p>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <button 
          v-for="conv in conversations" 
          :key="conv._id"
          @click="selectConversation(conv)"
          :class="[
            'w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left',
            activeConversation?._id === conv._id 
              ? 'bg-primary-600 border-primary-700 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
              : 'bg-white border-dark-900 text-dark-900 hover:bg-dark-50'
          ]"
        >
          <div class="w-12 h-12 rounded-full bg-dark-100 flex-shrink-0 border-2 border-dark-900 overflow-hidden">
            <img v-if="getParticipant(conv)?.avatar" :src="getParticipant(conv)?.avatar" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold">
              {{ getParticipant(conv)?.name?.charAt(0) }}
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <h4 class="font-bold text-sm truncate">{{ getParticipant(conv)?.name }}</h4>
              <span class="text-[10px] opacity-60">{{ formatTime(conv.updatedAt) }}</span>
            </div>
            <p class="text-xs truncate opacity-70 mt-0.5">
              {{ conv.lastMessage?.content || 'New conversation' }}
            </p>
          </div>
        </button>
      </div>
    </div>

    <!-- Chat Area -->
    <div class="flex-1 flex flex-col bg-white">
      <template v-if="activeConversation">
        <!-- Header -->
        <div class="p-6 border-b-2 border-dark-900 flex items-center justify-between bg-white">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-dark-100 border-2 border-dark-900 overflow-hidden">
              <img v-if="getParticipant(activeConversation)?.avatar" :src="getParticipant(activeConversation)?.avatar" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold">
                {{ getParticipant(activeConversation)?.name?.charAt(0) }}
              </div>
            </div>
            <div>
              <h3 class="font-bold text-dark-900">{{ getParticipant(activeConversation)?.name }}</h3>
              <p class="text-xs text-dark-400">{{ getParticipant(activeConversation)?.email }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold border border-green-200">ACTIVE TICKET</span>
            <button class="p-2 hover:bg-dark-50 rounded-xl border-2 border-transparent hover:border-dark-900 transition-all">
              <Icon name="ph:dots-three-outline-vertical-fill" />
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div ref="messageContainer" class="flex-1 overflow-y-auto p-8 space-y-6 bg-dark-50/20">
          <div v-for="msg in messages" :key="msg._id" 
            :class="['flex', msg.sender._id === user?._id ? 'justify-end' : 'justify-start']"
          >
            <div :class="[
              'max-w-[60%] p-4 rounded-3xl border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
              msg.sender._id === user?._id 
                ? 'bg-primary-600 text-white border-primary-700 rounded-tr-none' 
                : 'bg-white text-dark-900 border-dark-900 rounded-tl-none'
            ]">
              <p v-if="msg.type === 'text'" class="text-sm leading-relaxed">{{ msg.content }}</p>
              <img v-if="msg.type === 'image'" :src="msg.mediaUrl" class="rounded-2xl mb-2 border-2 border-dark-900" />
              <audio v-if="msg.type === 'voice'" :src="msg.mediaUrl" controls class="max-w-full" />
              <video v-if="msg.type === 'video'" :src="msg.mediaUrl" controls class="rounded-2xl max-w-full border-2 border-dark-900" />
              <div class="text-[10px] mt-2 opacity-60 flex items-center justify-end gap-1">
                {{ formatFullTime(msg.createdAt) }}
                <Icon v-if="msg.sender._id === user?._id" name="ph:check-circle-fill" />
              </div>
            </div>
          </div>
          <div v-if="isTyping" class="flex items-center gap-2 text-xs text-dark-400">
            <span class="flex gap-1">
              <span class="w-1.5 h-1.5 bg-dark-300 rounded-full animate-bounce"></span>
              <span class="w-1.5 h-1.5 bg-dark-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span class="w-1.5 h-1.5 bg-dark-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </span>
            User is typing...
          </div>
        </div>

        <!-- Input -->
        <div class="p-6 border-t-2 border-dark-900 bg-white">
          <div class="flex items-end gap-4 max-w-4xl mx-auto">
            <div class="flex-1 bg-dark-50 rounded-3xl border-2 border-dark-900 p-2 focus-within:ring-4 focus-within:ring-primary-500/20 transition-all">
              <textarea 
                v-model="newMessage" 
                @input="handleTyping"
                placeholder="Write your response..."
                rows="2"
                class="w-full bg-transparent border-none focus:ring-0 text-sm p-3 resize-none"
              ></textarea>
              <div class="flex items-center justify-between px-2 pb-1">
                <div class="flex items-center gap-1">
                  <button @click="triggerFileUpload" class="p-2 hover:bg-dark-100 rounded-full text-dark-600 transition-colors">
                    <Icon name="ph:image-bold" />
                  </button>
                  <button class="p-2 hover:bg-dark-100 rounded-full text-dark-600 transition-colors">
                    <Icon name="ph:microphone-bold" />
                  </button>
                  <button class="p-2 hover:bg-dark-100 rounded-full text-dark-600 transition-colors">
                    <Icon name="ph:paperclip-bold" />
                  </button>
                </div>
                <button 
                  @click="handleSendMessage"
                  :disabled="!newMessage.trim()"
                  class="bg-primary-600 text-white px-6 py-2 rounded-2xl font-bold border-2 border-primary-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
          <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" accept="image/*,video/*" />
        </div>
      </template>

      <!-- Empty State -->
      <div v-else class="flex-1 flex flex-col items-center justify-center p-12 text-center bg-dark-50/10">
        <EmptyState 
          icon="ph:chat-teardrop-text-bold" 
          title="No Chat Selected" 
          description="Choose a customer conversation from the list to start responding to support tickets." 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useChatState } from '@/composables/modules/chat/useChatState'
import { useSendMessage } from '@/composables/modules/chat/useSendMessage'
import { useFetchConversations } from '@/composables/modules/chat/useFetchConversations'
import { useFetchMessages } from '@/composables/modules/chat/useFetchMessages'
import { useUser } from '@/composables/modules/auth/user'

definePageMeta({
  layout: 'admin'
})

const { user } = useUser()
const { 
  initSocket, 
  conversations, 
  activeConversation, 
  messages, 
  isTyping,
  socket
} = useChatState()

const { sendMessage, sendTyping } = useSendMessage()
const { fetchConversations } = useFetchConversations()
const { fetchMessages } = useFetchMessages()

const joinConversation = (conversationId: string) => {
  socket?.emit('join_room', conversationId)
}

const leaveConversation = (conversationId: string) => {
  socket?.emit('leave_room', conversationId)
}

const newMessage = ref('')
const messageContainer = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const selectConversation = async (conv: any) => {
  if (activeConversation.value) {
    leaveConversation(activeConversation.value._id)
  }
  activeConversation.value = conv
  joinConversation(conv._id)
  await fetchMessages(conv._id)
  scrollToBottom()
}

const handleSendMessage = () => {
  if (!newMessage.value.trim() || !activeConversation.value) return
  
  sendMessage({
    conversationId: activeConversation.value._id,
    type: 'text',
    content: newMessage.value
  })
  newMessage.value = ''
  scrollToBottom()
}

const handleTyping = () => {
  if (activeConversation.value) {
    sendTyping(activeConversation.value._id, true)
    setTimeout(() => sendTyping(activeConversation.value?._id, false), 3000)
  }
}

const triggerFileUpload = () => fileInput.value?.click()

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files?.length || !activeConversation.value) return
  
  const file = target.files[0]
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const config = useRuntimeConfig()
    const response = await $fetch(`${config.public.apiBase}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData
    }) as any
    
    sendMessage({
      conversationId: activeConversation.value._id,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      mediaUrl: response.url
    })
  } catch (e) {
    console.error('Upload failed', e)
  }
}

const getParticipant = (conv: any) => {
  return conv.participants.find((p: any) => p._id !== user.value?._id)
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

const formatFullTime = (date: string) => {
  return new Date(date).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
}

onMounted(() => {
  initSocket()
  fetchConversations()
})
</script>
