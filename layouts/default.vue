<template>
  <div class="min-h-screen bg-gray-50 flex text-gray-900 font-['Inter',sans-serif]">
    <!-- Desktop Sidebar -->
    <aside class="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col h-screen sticky top-0 shadow-sm shrink-0">
      <div class="p-6">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <ShieldCheck class="text-white w-5 h-5" />
          </div>
          <h1 class="text-xl font-bold text-gray-900 tracking-tight">CampusLink</h1>
        </div>
        <p class="text-[10px] font-semibold text-gray-400 tracking-wider ml-10">Admin Hub</p>
      </div>

      <nav class="flex-1 px-3 space-y-1 mt-4">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.to" 
          :to="item.to" 
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all group" 
          :class="route.path === item.to ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
        >
          <component :is="item.icon" class="w-5 h-5" />
          {{ item.name }}
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-gray-100">
        <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 font-semibold text-sm hover:bg-red-50 rounded-xl transition-all">
          <LogOut class="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>

    <!-- Content Area -->
    <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
      <!-- Top Header -->
      <header class="h-16 lg:h-20 bg-white border-b border-gray-100 px-6 lg:px-10 flex items-center justify-between z-40 shrink-0">
        <div class="flex items-center gap-4">
          <button @click="showMobileMenu = true" class="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600">
            <Menu class="w-5 h-5" />
          </button>
          <div class="hidden lg:block">
             <h2 class="text-sm font-bold text-gray-400 uppercase tracking-widest">{{ activePageName }}</h2>
          </div>
        </div>

        <div class="flex items-center gap-3 md:gap-6">
          <UiNotificationDropdown />
          <div class="h-8 w-px bg-gray-100"></div>
          <div class="flex items-center gap-3">
             <div class="text-right hidden sm:block">
                <p class="text-[13px] font-bold text-gray-900">{{ user?.name || 'Administrator' }}</p>
                <p class="text-[10px] font-bold text-primary-600 uppercase tracking-tighter">Super admin</p>
             </div>
             <div class="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary-100 border-2 border-primary-50 overflow-hidden shrink-0">
                <img v-if="user?.avatar" :src="user.avatar" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-primary-600 font-black text-sm uppercase">
                   {{ user?.name?.charAt(0) || 'A' }}
                </div>
             </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-6 lg:p-10 bg-gray-50/50">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>

    <!-- Mobile Sidebar (Custom Transition) -->
    <Transition 
      enter-active-class="transition duration-300 ease-out" 
      enter-from-class="opacity-0" 
      enter-to-class="opacity-100" 
      leave-active-class="transition duration-200 ease-in" 
      leave-from-class="opacity-100" 
      leave-to-class="opacity-0"
    >
      <div v-if="showMobileMenu" class="fixed inset-0 z-[100] lg:hidden">
        <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="showMobileMenu = false"></div>
        <Transition 
          enter-active-class="transition duration-300 ease-out" 
          enter-from-class="-translate-x-full" 
          enter-to-class="translate-x-0" 
          leave-active-class="transition duration-200 ease-in" 
          leave-from-class="translate-x-0" 
          leave-to-class="-translate-x-full"
        >
          <div v-if="showMobileMenu" class="absolute inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl flex flex-col">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <ShieldCheck class="text-white w-5 h-5" />
                </div>
                <h1 class="text-xl font-bold text-gray-900 tracking-tight">CampusLink</h1>
              </div>
              <button @click="showMobileMenu = false" class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                <X class="w-5 h-5" />
              </button>
            </div>

            <nav class="flex-1 px-4 space-y-2">
              <NuxtLink 
                v-for="item in navItems" 
                :key="item.to" 
                :to="item.to" 
                @click="showMobileMenu = false"
                class="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-base transition-all" 
                :class="route.path === item.to ? 'bg-primary-50 text-primary-600' : 'text-gray-500'"
              >
                <component :is="item.icon" class="w-6 h-6" />
                {{ item.name }}
              </NuxtLink>
            </nav>

            <div class="p-6">
               <button @click="handleLogout" class="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 bg-red-50">
                <LogOut class="w-6 h-6" />
                Sign out
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  Wallet, 
  MapPin, 
  Tags, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X,
  Bell
} from 'lucide-vue-next'

const route = useRoute()
const { user, logOut } = useUser()
const { confirm } = useConfirmDialog()
const showMobileMenu = ref(false)

const navItems = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', to: '/dashboard/users', icon: Users },
  { name: 'Withdrawals', to: '/dashboard/withdrawals', icon: Wallet },
  { name: 'Campuses', to: '/dashboard/campuses', icon: MapPin },
  { name: 'Categories', to: '/dashboard/categories', icon: Tags },
  { name: 'Support', to: '/dashboard/chat', icon: MessageSquare },
  { name: 'Notifications', to: '/dashboard/notifications', icon: Bell },
]

const activePageName = computed(() => {
  const item = navItems.find(i => route.path === i.to)
  return item ? item.name : 'Admin'
})

const handleLogout = async () => {
  showMobileMenu.value = false
  const confirmed = await confirm({
    title: 'Sign out',
    message: 'Are you sure you want to log out of the admin panel?',
    confirmText: 'Yes, sign out',
    variant: 'danger'
  })

  if (confirmed) {
    logOut()
  }
}
</script>
