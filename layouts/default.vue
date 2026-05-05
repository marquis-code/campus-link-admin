<template>
  <div class="min-h-screen bg-dark-950 flex text-dark-100">
    <!-- Sidebar -->
    <aside class="w-72 bg-dark-900 border-r border-dark-800 flex flex-col h-screen sticky top-0">
      <div class="p-8">
        <h1 class="text-2xl font-black text-primary-500 tracking-tight">CAMPUSLINK</h1>
        <p class="text-[10px] font-black text-dark-400 uppercase tracking-widest mt-1">Admin Control Panel</p>
      </div>

      <nav class="flex-1 px-4 space-y-2">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all" :class="route.path === item.to ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-dark-400 hover:bg-dark-800 hover:text-white'">
          <Icon :name="item.icon" class="text-2xl" />
          {{ item.name }}
        </NuxtLink>
      </nav>

      <div class="p-6 border-t border-dark-800">
        <button @click="logout" class="w-full flex items-center gap-4 px-4 py-3 text-red-400 font-bold hover:bg-red-500/10 rounded-xl transition-all">
          <Icon name="ph:power-bold" class="text-xl" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 p-10 overflow-x-hidden">
      <div class="max-w-7xl mx-auto">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
const route = useRoute()
const { logOut: logout } = useUser()
const navItems = [
  { name: 'Dashboard', to: '/dashboard', icon: 'ph:chart-line-up-duotone' },
  { name: 'User Management', to: '/dashboard/users', icon: 'ph:users-three-duotone' },
  { name: 'Withdrawal Requests', to: '/dashboard/withdrawals', icon: 'ph:hand-coins-duotone' },
  { name: 'Campuses', to: '/dashboard/campuses', icon: 'ph:buildings-duotone' },
  { name: 'Categories', to: '/dashboard/categories', icon: 'ph:tag-duotone' },
  { name: 'Support Chat', to: '/dashboard/chat', icon: 'ph:chat-teardrop-text-duotone' },
]
</script>
