<template>
  <div class="space-y-10">
    <header>
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Platform Insights</h1>
      <p class="text-gray-500 font-medium text-sm md:text-base">Real-time overview of the CampusLink ecosystem.</p>
    </header>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UiSkeleton v-for="i in 4" :key="i" height="128px" rounded="3xl" />
    </div>

    <div v-else-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="s in quickStats" :key="s.label" class="bg-white border border-gray-100 rounded-[32px] p-6 flex flex-col justify-between hover:border-primary-100 transition-all shadow-sm">
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center" :class="s.color">
            <component :is="s.icon" class="w-5 h-5" />
          </div>
        </div>
        <div class="mt-4">
          <p class="text-xs font-semibold text-gray-400 tracking-wide">{{ s.label }}</p>
          <h3 class="text-2xl font-bold text-gray-900 mt-0.5">{{ s.value }}</h3>
        </div>
      </div>
    </div>

    <!-- Charts / Details -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white border border-gray-100 rounded-[40px] p-8 space-y-6 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900">User distribution</h3>
        <div class="space-y-6">
           <div class="space-y-2">
              <div class="flex items-center justify-between text-sm font-semibold">
                 <span class="text-gray-600">Students (Promoters)</span>
                 <span class="text-primary-600">{{ stats?.users?.students || 0 }}</span>
              </div>
              <div class="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                 <div class="h-full bg-primary-500" :style="`width: ${(stats?.users?.students / stats?.users?.total) * 100}%` "></div>
              </div>
           </div>
           <div class="space-y-2">
              <div class="flex items-center justify-between text-sm font-semibold">
                 <span class="text-gray-600">Sellers (Businesses)</span>
                 <span class="text-emerald-600">{{ stats?.users?.sellers || 0 }}</span>
              </div>
              <div class="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                 <div class="h-full bg-emerald-500" :style="`width: ${(stats?.users?.sellers / stats?.users?.total) * 100}%` "></div>
              </div>
           </div>
        </div>
      </div>

      <div class="bg-white border border-gray-100 rounded-[40px] p-8 space-y-6 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900">Revenue summary</h3>
        <div class="grid grid-cols-2 gap-x-8 gap-y-6">
           <div class="space-y-1">
              <p class="text-xs font-semibold text-gray-400 tracking-wide">Total sales</p>
              <p class="text-xl font-bold text-gray-900">₦{{ stats?.revenue?.totalSales?.toLocaleString() || 0 }}</p>
           </div>
           <div class="space-y-1">
              <p class="text-xs font-semibold text-gray-400 tracking-wide">Platform fees</p>
              <p class="text-xl font-bold text-primary-600">₦{{ (stats?.revenue?.totalSales * 0.1)?.toLocaleString() || 0 }}</p>
           </div>
           <div class="space-y-1">
              <p class="text-xs font-semibold text-gray-400 tracking-wide">Commissions paid</p>
              <p class="text-xl font-bold text-emerald-600">₦{{ stats?.revenue?.totalEarnings?.toLocaleString() || 0 }}</p>
           </div>
           <div class="space-y-1">
              <p class="text-xs font-semibold text-gray-400 tracking-wide">Pending payouts</p>
              <p class="text-xl font-bold text-amber-500">₦{{ (stats?.revenue?.totalEarnings - stats?.revenue?.totalWithdrawn)?.toLocaleString() || 0 }}</p>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { Users, Package, ShoppingCart, Wallet } from 'lucide-vue-next'

const { stats, loading, fetchStats } = useFetchStats()

const quickStats = computed(() => [
  { label: 'Total Users', value: stats.value?.users?.total || 0, icon: Users, color: 'text-primary-600' },
  { label: 'Total Products', value: stats.value?.products?.total || 0, icon: Package, color: 'text-indigo-600' },
  { label: 'Total Orders', value: stats.value?.orders?.total || 0, icon: ShoppingCart, color: 'text-emerald-600' },
  { label: 'Pending Payouts', value: stats.value?.withdrawals?.pending || 0, icon: Wallet, color: 'text-amber-500' },
])

onMounted(async () => {
  await fetchStats()
})
</script>
