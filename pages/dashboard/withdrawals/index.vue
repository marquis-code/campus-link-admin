<template>
  <div class="space-y-8">
    <header>
      <h1 class="text-3xl font-black text-white tracking-tight">Withdrawal Requests</h1>
      <p class="text-dark-400 font-medium">Review and process student payout requests.</p>
    </header>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="h-24 bg-dark-900 rounded-2xl animate-pulse"></div>
    </div>

    <div v-else-if="withdrawals.length > 0" class="admin-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-dark-800/50 border-b border-dark-700">
              <th class="px-8 py-5 text-xs font-black text-dark-400 uppercase tracking-widest">Student</th>
              <th class="px-8 py-5 text-xs font-black text-dark-400 uppercase tracking-widest">Amount</th>
              <th class="px-8 py-5 text-xs font-black text-dark-400 uppercase tracking-widest">Bank Details</th>
              <th class="px-8 py-5 text-xs font-black text-dark-400 uppercase tracking-widest">Status</th>
              <th class="px-8 py-5 text-xs font-black text-dark-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-dark-800">
            <tr v-for="w in withdrawals" :key="w._id" class="hover:bg-dark-800/30 transition-colors">
              <td class="px-8 py-6">
                <div class="font-bold text-white">{{ w.user?.name }}</div>
                <div class="text-xs text-dark-500 font-medium">{{ w.user?.email }}</div>
              </td>
              <td class="px-8 py-6 font-black text-primary-400 text-lg">₦{{ w.amount?.toLocaleString() }}</td>
              <td class="px-8 py-6">
                <div class="text-sm text-dark-200 font-bold">{{ w.bankName }}</div>
                <div class="text-xs text-dark-500">{{ w.bankAccountNumber }} • {{ w.bankAccountName }}</div>
              </td>
              <td class="px-8 py-6">
                <span class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest" :class="statusClass(w.status)">
                  {{ w.status }}
                </span>
              </td>
              <td class="px-8 py-6">
                <div v-if="w.status === 'pending'" class="flex gap-2">
                  <button @click="updateStatus(w._id, 'approved')" class="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all">
                    <Icon name="ph:check-bold" />
                  </button>
                  <button @click="updateStatus(w._id, 'rejected')" class="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                    <Icon name="ph:x-bold" />
                  </button>
                </div>
                <div v-else class="text-xs text-dark-500 font-bold italic">Processed</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="text-center py-20 admin-card border-dashed">
       <Icon name="ph:hand-coins-duotone" class="text-5xl text-dark-700 mb-4 mx-auto" />
       <h3 class="text-xl font-bold text-white">No requests found</h3>
       <p class="text-dark-400">All payout requests have been processed.</p>
    </div>
  </div>
</template>

<script setup>
const { withdrawals, loading, fetchWithdrawals, updateStatus: patchStatus } = useWithdrawals()

const fetchData = async () => {
  await fetchWithdrawals()
}

const updateStatus = async (id, status) => {
  const note = prompt(`Enter ${status} note (optional):`)
  if (note === null) return
  
  try {
    await patchStatus(id, { status, adminNote: note })
    fetchData()
    alert(`Withdrawal ${status} successfully!`)
  } catch (e) { alert('Operation failed') }
}

const statusClass = (status) => {
  const classes = {
    pending: 'bg-amber-500/10 text-amber-500',
    approved: 'bg-emerald-500/10 text-emerald-500',
    rejected: 'bg-red-500/10 text-red-500',
    completed: 'bg-blue-500/10 text-blue-500'
  }
  return classes[status] || 'bg-dark-700 text-dark-300'
}

onMounted(fetchData)
</script>
