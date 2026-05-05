<template>
  <div class="space-y-8">
    <header class="flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-black text-white tracking-tight">User Management</h1>
        <p class="text-dark-400 font-medium">Manage and moderate all platform users.</p>
      </div>
      <div class="flex gap-2 bg-dark-900 p-1 rounded-xl border border-dark-800">
        <button v-for="r in roles" :key="r.value" @click="activeRole = r.value" class="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all" :class="activeRole === r.value ? 'bg-primary-600 text-white' : 'text-dark-500 hover:text-dark-200'">
          {{ r.label }}
        </button>
      </div>
    </header>

    <div v-if="loading" class="h-96 bg-dark-900 rounded-3xl animate-pulse"></div>

    <div v-else class="admin-card overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-dark-800/50 border-b border-dark-700">
            <th class="px-8 py-5 text-xs font-black text-dark-400 uppercase tracking-widest">User</th>
            <th class="px-8 py-5 text-xs font-black text-dark-400 uppercase tracking-widest">Role</th>
            <th class="px-8 py-5 text-xs font-black text-dark-400 uppercase tracking-widest">Campus</th>
            <th class="px-8 py-5 text-xs font-black text-dark-400 uppercase tracking-widest">Joined</th>
            <th class="px-8 py-5 text-xs font-black text-dark-400 uppercase tracking-widest">Status</th>
            <th class="px-8 py-5 text-xs font-black text-dark-400 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-dark-800">
          <tr v-for="u in users" :key="u._id" class="hover:bg-dark-800/30 transition-colors">
            <td class="px-8 py-6 flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-dark-700 overflow-hidden">
                <img :src="u.avatar || 'https://via.placeholder.com/100'" class="w-full h-full object-cover" />
              </div>
              <div>
                <div class="font-bold text-white">{{ u.name }}</div>
                <div class="text-xs text-dark-500">{{ u.email }}</div>
              </div>
            </td>
            <td class="px-8 py-6">
              <span class="px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter" :class="u.role === 'seller' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary-500/10 text-primary-500'">
                {{ u.role }}
              </span>
            </td>
            <td class="px-8 py-6 text-sm text-dark-300 font-bold">{{ u.campus?.name }}</td>
            <td class="px-8 py-6 text-xs text-dark-500">{{ new Date(u.createdAt).toLocaleDateString() }}</td>
            <td class="px-8 py-6">
              <span class="w-2.5 h-2.5 rounded-full inline-block mr-2" :class="u.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'"></span>
              <span class="text-xs font-bold" :class="u.isActive ? 'text-emerald-500' : 'text-red-500'">{{ u.isActive ? 'Active' : 'Suspended' }}</span>
            </td>
            <td class="px-8 py-6">
              <button @click="toggleStatus(u)" class="p-2 rounded-lg transition-all" :class="u.isActive ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'">
                <Icon :name="u.isActive ? 'ph:user-minus-bold' : 'ph:user-plus-bold'" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const { users, loading, fetchUsers, toggleUserStatus } = useAdmin()
const activeRole = ref('')

const roles = [
  { label: 'All Users', value: '' },
  { label: 'Students', value: 'student' },
  { label: 'Sellers', value: 'seller' },
]

const fetchData = async () => {
  await fetchUsers({ role: activeRole.value })
}

const toggleStatus = async (user) => {
  if (!confirm(`Are you sure you want to ${user.isActive ? 'suspend' : 'activate'} this user?`)) return
  try {
    await toggleUserStatus(user._id, !user.isActive)
    fetchData()
  } catch (e) { alert('Operation failed') }
}

watch(activeRole, fetchData)
onMounted(fetchData)
</script>
