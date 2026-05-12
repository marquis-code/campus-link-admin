<template>
  <div class="space-y-8 relative">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
        <p class="text-gray-500 font-medium text-sm">Manage and moderate all platform users.</p>
      </div>
      <div class="flex gap-1 bg-white p-1 rounded-xl border border-gray-100 shadow-sm self-start md:self-auto">
        <button 
          v-for="r in roles" 
          :key="r.value" 
          @click="activeRole = r.value" 
          class="px-4 py-2 rounded-lg text-xs font-bold transition-all" 
          :class="activeRole === r.value ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-900'"
        >
          {{ r.label }}
        </button>
      </div>
    </header>

    <div v-if="loading" class="space-y-4">
      <UiSkeleton height="400px" rounded="3xl" />
    </div>

    <div v-else-if="!users?.length" class="py-12">
      <UiEmptyState 
        :icon="Users"
        title="No users found"
        description="There are no users matching your current filter criteria."
      />  
    </div>

    <div v-else class="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100">
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide">User</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide">Role</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide">Campus</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide">Joined</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide">Status</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="u in users" :key="u._id" class="hover:bg-gray-50/30 transition-colors">
              <td class="px-8 py-4 flex items-center gap-4">
                <div class="w-9 h-9 rounded-xl bg-gray-100 border border-gray-100 overflow-hidden shrink-0">
                  <img :src="u.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + u.name" class="w-full h-full object-cover" />
                </div>
                <div>
                  <div class="font-bold text-gray-900 text-sm">{{ u.name }}</div>
                  <div class="text-xs text-gray-400 font-medium">{{ u.email }}</div>
                </div>
              </td>
              <td class="px-8 py-4">
                <span class="px-2.5 py-1 rounded-lg text-sm font-bold tracking-tight" :class="u.role === 'seller' ? 'bg-emerald-50 text-emerald-600' : 'bg-primary-50 text-primary-600'">
                  {{ u.role }}
                </span>
              </td>
              <td class="px-8 py-4 text-xs text-gray-600 font-semibold">{{ u.campus?.name || '-' }}</td>
              <td class="px-8 py-4 text-[11px] text-gray-400 font-medium">{{ new Date(u.createdAt).toLocaleDateString() }}</td>
              <td class="px-8 py-4">
                <div class="flex items-center gap-1.5">
                  <div class="w-1.5 h-1.5 rounded-full" :class="u.isActive ? 'bg-emerald-500' : 'bg-red-500'"></div>
                  <span class="text-xs font-bold" :class="u.isActive ? 'text-emerald-600' : 'text-red-600'">{{ u.isActive ? 'Active' : 'Suspended' }}</span>
                </div>
              </td>
              <td class="px-8 py-4 text-right">
                <button 
                  @click="confirmToggle(u)" 
                  class="p-2 rounded-xl transition-all shadow-sm border border-gray-100"
                  :class="u.isActive ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'"
                >
                  <component :is="u.isActive ? UserX : UserCheck" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { UserCheck, UserX } from 'lucide-vue-next'

const { users, loading, fetchUsers, toggleUserStatus } = useAdmin()
const activeRole = ref('')

const roles = [
  { label: 'All users', value: '' },
  { label: 'Students', value: 'student' },
  { label: 'Sellers', value: 'seller' },
]

const fetchData = async () => {
  await fetchUsers({ role: activeRole.value })
}

const { showToast } = useCustomToast()
const { confirm } = useConfirmDialog()

const confirmToggle = async (user) => {
  const confirmed = await confirm({
    title: user.isActive ? 'Suspend user' : 'Activate user',
    message: `Are you sure you want to ${user.isActive ? 'suspend' : 'activate'} ${user.name}?`,
    variant: user.isActive ? 'danger' : 'info',
    confirmText: user.isActive ? 'Yes, suspend' : 'Yes, activate'
  })

  if (confirmed) {
    try {
      await toggleUserStatus(user._id, !user.isActive)
      showToast({
        title: 'Status updated',
        message: `User ${user.isActive ? 'suspended' : 'activated'} successfully.`,
        toastType: 'success'
      })
      fetchData()
    } catch (e) { 
      showToast({
        title: 'Action failed',
        message: 'Failed to update user status.',
        toastType: 'error'
      })
    }
  }
}

watch(activeRole, fetchData)
onMounted(fetchData)
</script>
