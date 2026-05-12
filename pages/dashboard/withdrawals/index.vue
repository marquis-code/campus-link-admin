<template>
  <div class="space-y-8 relative">
    <header>
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Withdrawal Requests</h1>
      <p class="text-gray-500 font-medium text-sm">Review and process student payout requests.</p>
    </header>

    <div v-if="loading" class="space-y-4">
      <UiSkeleton v-for="i in 5" :key="i" height="96px" rounded="2xl" />
    </div>

    <div v-else-if="withdrawals && !!withdrawals.length" class="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100">
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide">Student</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide">Amount</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide">Bank details</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide">Status</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="w in withdrawals" :key="w._id" class="hover:bg-gray-50/30 transition-colors">
              <td class="px-8 py-4">
                <div class="font-bold text-gray-900 text-sm">{{ w.user?.name }}</div>
                <div class="text-xs text-gray-400 font-medium">{{ w.user?.email }}</div>
              </td>
              <td class="px-8 py-4 font-bold text-primary-600 text-lg">₦{{ w.amount?.toLocaleString() }}</td>
              <td class="px-8 py-4">
                <div class="text-[13px] text-gray-700 font-bold">{{ w.bankName }}</div>
                <div class="text-[11px] text-gray-400 font-medium">{{ w.bankAccountNumber }} • {{ w.bankAccountName }}</div>
              </td>
              <td class="px-8 py-4">
                <span class="px-2.5 py-1 rounded-lg text-sm font-bold tracking-tight" :class="statusClass(w.status)">
                  {{ w.status }}
                </span>
              </td>
              <td class="px-8 py-4 text-right">
                <div v-if="w.status === 'pending'" class="flex justify-end gap-2">
                  <button 
                    @click="confirmUpdateStatus(w._id, 'approved')" 
                    class="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                  >
                    <Check class="w-4 h-4" />
                  </button>
                  <button 
                    @click="confirmUpdateStatus(w._id, 'rejected')" 
                    class="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>
                <div v-else class="text-[11px] text-gray-400 font-bold italic pr-2">Processed</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="py-12">
       <UiEmptyState 
         :icon="Wallet"
         title="No requests found"
         description="All payout requests have been processed or none have been submitted yet."
       />
    </div>

    <!-- Modals -->
    <UiPromptModal 
      :is-open="showPromptModal"
      title="Process withdrawal"
      :message="`Provide an optional note for marking this request as ${selectedAction}.`"
      :confirm-text="selectedAction === 'approved' ? 'Approve request' : 'Reject request'"
      placeholder="e.g. Transaction Reference #12345"
      @confirm="executeUpdateStatus"
      @cancel="showPromptModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Check, X, Wallet } from 'lucide-vue-next'

const { withdrawals, loading, fetchWithdrawals, updateStatus: patchStatus } = useWithdrawals()

const fetchData = async () => {
  await fetchWithdrawals()
}

const showPromptModal = ref(false)
const selectedId = ref(null)
const selectedAction = ref('')

const confirmUpdateStatus = (id, action) => {
  selectedId.value = id
  selectedAction.value = action
  showPromptModal.value = true
}

const { showToast } = useCustomToast()

const executeUpdateStatus = async (note) => {
  if (!selectedId.value) return
  showPromptModal.value = false
  try {
    await patchStatus(selectedId.value, { status: selectedAction.value, adminNote: note })
    showToast({
      title: 'Status updated',
      message: `Withdrawal ${selectedAction.value} successfully.`,
      toastType: 'success'
    })
    fetchData()
  } catch (e) { 
    showToast({
      title: 'Action failed',
      message: 'Failed to update withdrawal status. Please try again.',
      toastType: 'error'
    })
  }
}

const statusClass = (status) => {
  const classes = {
    pending: 'bg-amber-50 text-amber-600',
    approved: 'bg-emerald-50 text-emerald-600',
    rejected: 'bg-red-50 text-red-600',
    completed: 'bg-blue-50 text-blue-600'
  }
  return classes[status] || 'bg-gray-100 text-gray-600'
}

onMounted(fetchData)
</script>
