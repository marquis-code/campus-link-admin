<template>
  <div class="h-screen flex bg-white overflow-hidden relative">
    <!-- Sidebar / Conversation List -->
    <div 
      class="absolute lg:relative inset-0 lg:inset-auto z-40 lg:z-0 w-full lg:w-[400px] border-r border-gray-100 flex flex-col bg-white transition-transform duration-300 ease-in-out"
      :class="[!activeConversation || showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']"
    >
      <div class="p-6 border-b border-gray-100 space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
             <NuxtLink to="/dashboard" class="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-gray-900 rounded-xl transition-all">
               <Home class="w-5 h-5" />
             </NuxtLink>
             <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Support</h1>
          </div>
          <button class="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-gray-900 transition-all">
            <Plus class="w-5 h-5" />
          </button>
        </div>
        <!-- Search -->
        <div class="relative group">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            class="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl border-transparent focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50 outline-none text-sm font-medium transition-all"
          />
        </div>
      </div>
      
      <!-- List -->
      <div class="flex-1 overflow-y-auto divide-y divide-gray-50">
        <div v-if="loadingConversations && conversations.length === 0" class="p-6 space-y-4">
          <UiSkeleton v-for="i in 6" :key="i" height="72px" rounded="2xl" />
        </div>
        
        <button 
          v-for="conv in conversations" 
          :key="conv._id"
          @click="selectConversation(conv)"
          :class="[
            'w-full px-6 py-5 flex items-center gap-4 text-left transition-all relative overflow-hidden',
            activeConversation?._id === conv._id 
              ? 'bg-primary-50/50' 
              : 'hover:bg-gray-50'
          ]"
        >
          <!-- Active Indicator Bar -->
          <div v-if="activeConversation?._id === conv._id" class="absolute left-0 top-0 bottom-0 w-1 bg-primary-600"></div>

          <div class="relative shrink-0">
            <div class="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-100 overflow-hidden">
              <img v-if="getParticipant(conv)?.avatar" :src="getParticipant(conv)?.avatar" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold text-lg">
                {{ getParticipant(conv)?.name?.charAt(0) }}
              </div>
            </div>
            <!-- Online Status Dot -->
            <div 
              v-if="onlineUsers.has(getParticipant(conv)?._id)"
              class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"
            ></div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start mb-1">
              <h4 class="font-bold text-sm text-gray-900 truncate">{{ getParticipant(conv)?.name }}</h4>
              <span class="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{{ formatTime(conv.updatedAt) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-[13px] truncate text-gray-500 font-medium pr-4">
                {{ conv.lastMessage?.content || 'New conversation started' }}
              </p>
               <div v-if="conv.unreadCount > 0" class="px-1.5 py-0.5 bg-primary-600 text-white rounded-lg text-[10px] font-black min-w-[20px] text-center shadow-sm">
                {{ conv.unreadCount }}
              </div>
            </div>
          </div>
        </button>

        <div v-if="!loadingConversations && conversations.length === 0" class="p-12 text-center space-y-4">
           <div class="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto text-gray-200">
              <MessageSquare class="w-8 h-8" />
           </div>
           <div>
             <p class="text-sm font-bold text-gray-900">No conversations</p>
             <p class="text-xs text-gray-400 font-medium mt-1">Incoming support tickets will appear here.</p>
           </div>
        </div>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col bg-[#efe7de] relative">
      <!-- WhatsApp Pattern Overlay -->
      <div class="absolute inset-0 opacity-[0.06] pointer-events-none custom-chat-bg"></div>

      <template v-if="activeConversation">
        <!-- Chat Header -->
        <div class="px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-30 sticky top-0">
          <div class="flex items-center gap-4">
            <!-- Mobile Back Button -->
            <button @click="closeConversation" class="lg:hidden p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-all">
              <ArrowLeft class="w-6 h-6" />
            </button>

            <div class="w-10 h-10 rounded-xl bg-gray-100 border border-gray-100 overflow-hidden shrink-0">
              <img v-if="getParticipant(activeConversation)?.avatar" :src="getParticipant(activeConversation)?.avatar" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold text-sm">
                {{ getParticipant(activeConversation)?.name?.charAt(0) }}
              </div>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-sm tracking-tight leading-tight">{{ getParticipant(activeConversation)?.name }}</h3>
              <p v-if="isTyping" class="text-[10px] text-emerald-500 font-black uppercase tracking-widest animate-pulse mt-0.5">typing...</p>
              <p v-else class="text-[10px] font-bold mt-0.5 tracking-wide flex items-center gap-1.5" :class="onlineUsers.has(getParticipant(activeConversation)?._id) ? 'text-emerald-500' : 'text-gray-400'">
                <span class="w-1.5 h-1.5 rounded-full" :class="onlineUsers.has(getParticipant(activeConversation)?._id) ? 'bg-emerald-500' : 'bg-gray-300'"></span>
                {{ onlineUsers.has(getParticipant(activeConversation)?._id) ? 'Online' : 'Offline' }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
              <Phone class="w-4 h-4" />
            </button>
            <button class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
              <Video class="w-4 h-4" />
            </button>
            <div class="w-px h-6 bg-gray-100 mx-1"></div>
            <button class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
              <MoreVertical class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Messages Content -->
        <div ref="messageContainer" class="flex-1 overflow-y-auto px-6 py-8 space-y-4 relative z-10 scroll-smooth">
          <div v-for="msg in messages" :key="msg._id" 
            :class="['flex w-full', msg.sender?._id === user?._id ? 'justify-end' : 'justify-start']"
          >
            <!-- Message Bubble -->
            <div 
              :class="[
                'max-w-[85%] lg:max-w-[65%] px-4 py-2 rounded-2xl relative shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] transition-all',
                msg.sender?._id === user?._id 
                  ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none' 
                  : 'bg-white text-gray-900 rounded-tl-none'
              ]"
            >
              <!-- WhatsApp Tails -->
              <div v-if="msg.sender?._id === user?._id" class="absolute top-0 -right-2 w-3 h-3 bg-[#d9fdd3] clip-path-tail-right"></div>
              <div v-else class="absolute top-0 -left-2 w-3 h-3 bg-white clip-path-tail-left"></div>

              <div class="flex flex-col gap-1">
                <p v-if="msg.type === 'text'" class="text-[14.5px] leading-relaxed font-medium whitespace-pre-wrap">{{ msg.content }}</p>
                <div v-if="msg.type === 'image'" class="rounded-xl overflow-hidden mb-1 border border-black/5">
                  <img :src="msg.mediaUrl" class="max-w-full h-auto cursor-pointer" @click="previewMedia(msg.mediaUrl)" />
                </div>
                
                <div class="flex items-center justify-end gap-1.5 min-w-[60px] -mt-1 ml-4 self-end">
                  <span class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter opacity-70">{{ formatFullTime(msg.createdAt) }}</span>
                  <div v-if="msg.sender?._id === user?._id" class="flex items-center">
                    <CheckCheck class="w-4 h-4" :class="msg.isRead ? 'text-[#53bdeb]' : 'text-gray-400'" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="anchor" class="h-1 w-full"></div>
        </div>

        <!-- Chat Input -->
        <div class="p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 z-30">
          <div class="flex items-end gap-3 max-w-6xl mx-auto">
            <div class="flex gap-1">
              <button @click="triggerFileUpload" class="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all">
                <Paperclip class="w-5 h-5" />
              </button>
              <button class="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-2xl transition-all">
                <Smile class="w-5 h-5" />
              </button>
            </div>
            
            <div class="flex-1 bg-gray-50 rounded-[22px] border border-transparent px-5 py-1.5 flex items-end transition-all focus-within:bg-white focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-50">
              <textarea 
                v-model="newMessage" 
                @input="handleTyping"
                @keydown.enter.prevent="handleSendMessage"
                placeholder="Type your message..."
                rows="1"
                ref="textareaInput"
                class="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2.5 resize-none outline-none font-medium text-gray-900 min-h-[44px] max-h-32"
              ></textarea>
            </div>

            <button 
              v-if="newMessage.trim()"
              @click="handleSendMessage"
               class="w-11 h-11 shrink-0 flex items-center justify-center bg-primary-600 text-white rounded-2xl hover:bg-primary-700 active:scale-95 transition-all shadow-md shadow-primary-100"
            >
              <Send class="w-5 h-5 ml-0.5" />
            </button>
            <button 
              v-else
              class="w-11 h-11 shrink-0 flex items-center justify-center bg-gray-100 text-gray-400 rounded-2xl hover:bg-gray-200 transition-all"
            >
              <Mic class="w-5 h-5" />
            </button>
          </div>
          <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" accept="image/*,video/*" />
        </div>
      </template>

      <!-- Empty Chat Selection -->
      <div v-else class="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white">
        <div class="max-w-md space-y-8">
           <div class="relative">
              <div class="w-32 h-32 bg-primary-50 rounded-[48px] flex items-center justify-center mx-auto text-primary-600 shadow-inner">
                <MessageSquare class="w-12 h-12" />
              </div>
              <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-white shadow-lg rounded-2xl flex items-center justify-center text-emerald-500 animate-bounce">
                <CheckCheck class="w-5 h-5" />
              </div>
           </div>
           <div class="space-y-3">
             <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Select a conversation</h2>
             <p class="text-gray-500 font-medium leading-relaxed">Choose a customer support ticket from the sidebar to start providing real-time assistance.</p>
           </div>
           <button @click="showSidebar = true" class="lg:hidden px-8 py-3 bg-primary-600 text-white rounded-2xl font-bold shadow-md shadow-primary-100">View Tickets</button>
        </div>
      </div>
    </div>

    <!-- Notification Sound -->
    <audio ref="notificationSound" preload="auto">
      <source src="https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { 
  Plus, 
  MessageSquare, 
  MoreVertical, 
  Search, 
  CheckCheck, 
  Smile, 
  Send,
  ArrowLeft,
  Phone,
  Video,
  Paperclip,
  Mic,
  Home
} from 'lucide-vue-next'

definePageMeta({
  layout: 'full-screen'
})

const { user } = useUser()
const { 
  initSocket, 
  conversations, 
  activeConversation, 
  messages, 
  isTyping,
  socket,
  onlineUsers
} = useChatState()

const { sendMessage, sendTyping } = useSendMessage()
const { fetchConversations } = useFetchConversations()
const { fetchMessages } = useFetchMessages()

const newMessage = ref('')
const messageContainer = ref<HTMLElement | null>(null)
const textareaInput = ref<HTMLTextAreaElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const notificationSound = ref<HTMLAudioElement | null>(null)
const showSidebar = ref(true)
const loadingConversations = ref(false)

// Auto-expand textarea
watch(newMessage, () => {
  nextTick(() => {
    if (textareaInput.value) {
      textareaInput.value.style.height = 'auto'
      textareaInput.value.style.height = `${textareaInput.value.scrollHeight}px`
    }
  })
})

// Sound Notification Logic
watch(() => messages.value.length, (newLen, oldLen) => {
  if (newLen > oldLen && messages.value[newLen - 1].sender?._id !== user.value?._id) {
    if (notificationSound.value) {
      notificationSound.value.play().catch(() => {})
    }
    scrollToBottom()
  }
})

const closeConversation = () => {
  if (activeConversation.value) {
    socket.value?.emit('leave_conversation', { conversationId: activeConversation.value._id })
  }
  activeConversation.value = null
  showSidebar.value = true
}

const selectConversation = async (conv: any) => {
  if (activeConversation.value) {
    socket.value?.emit('leave_conversation', { conversationId: activeConversation.value._id })
  }
  activeConversation.value = conv
  conv.unreadCount = 0 // Reset locally
  showSidebar.value = false
  socket.value?.emit('join_conversation', { conversationId: conv._id })
  await fetchMessages(conv._id)
  scrollToBottom()
}

const handleSendMessage = () => {
  if (!newMessage.value.trim() || !activeConversation.value) return
  
  sendMessage({
    conversationId: activeConversation.value._id,
    type: 'text',
    content: newMessage.value.trim()
  })
  newMessage.value = ''
  if (textareaInput.value) textareaInput.value.style.height = 'auto'
  scrollToBottom()
}

const handleTyping = () => {
  if (activeConversation.value) {
    sendTyping(activeConversation.value._id, true)
    // Debounce typing status
    clearTimeout((window as any).typingTimer)
    ;(window as any).typingTimer = setTimeout(() => {
      if (activeConversation.value) {
        sendTyping(activeConversation.value._id, false)
      }
    }, 2000)
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
    const response = await $fetch(`${config.public.apiBase}/upload/single`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
      body: formData
    }) as any
    
    sendMessage({
      conversationId: activeConversation.value._id,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      mediaUrl: response.url || response.data?.url
    })
  } catch (e) {
    console.error('Upload failed', e)
  }
}

const getParticipant = (conv: any) => {
  if (conv.guestInfo) {
    return {
      _id: `guest_${conv._id}`,
      name: conv.guestInfo.name,
      avatar: null,
      email: conv.guestInfo.email,
      phone: conv.guestInfo.phone
    }
  }
  return conv.participants?.find((p: any) => p._id !== user.value?._id) || conv.participants?.[0]
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
    // Backup: use anchor
    const anchor = document.getElementById('anchor')
    if (anchor) anchor.scrollIntoView({ behavior: 'smooth' })
  })
}

const formatTime = (date: string) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const formatFullTime = (date: string) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const previewMedia = (url: string) => {
  window.open(url, '_blank')
}

onMounted(async () => {
  initSocket()
  loadingConversations.value = true
  try {
    await fetchConversations(true) // isAdmin = true for support chat
  } finally {
    loadingConversations.value = false
  }
})
</script>

<style scoped>
.custom-chat-bg {
  background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
  background-repeat: repeat;
}

.clip-path-tail-right {
  clip-path: polygon(0 0, 0 100%, 100% 0);
}

.clip-path-tail-left {
  clip-path: polygon(100% 0, 100% 100%, 0 0);
}

::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 10px;
}
</style>
