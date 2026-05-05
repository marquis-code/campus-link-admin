<template>
  <div class="space-y-10">
    <header>
      <h1 class="text-4xl font-black text-white tracking-tight">Platform Insights</h1>
      <p class="text-dark-400 font-medium">Real-time overview of the CampusLink ecosystem.</p>
    </header>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Skeleton v-for="i in 4" :key="i" height="160px" rounded="2xl" />
    </div>

    <div v-else-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="s in quickStats" :key="s.label" class="admin-card p-6 flex flex-col justify-between hover:border-primary-500/50 transition-colors">
        <div class="flex items-center justify-between">
          <div class="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center text-2xl" :class="s.color">
            <Icon :name="s.icon" />
          </div>
        </div>
        <div class="mt-4">
          <p class="text-xs font-black text-dark-400 uppercase tracking-widest">{{ s.label }}</p>
          <h3 class="text-3xl font-black text-white mt-1">{{ s.value }}</h3>
        </div>
      </div>
    </div>

    <!-- More detailed stats can go here -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="admin-card p-8 space-y-6">
        <h3 class="text-xl font-bold text-white">User Distribution</h3>
        <div class="space-y-4">
           <div class="flex items-center justify-between">
              <span class="text-dark-400 font-bold">Students (Promoters)</span>
              <span class="font-black text-primary-400">{{ stats?.users?.students || 0 }}</span>
           </div>
           <div class="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
              <div class="h-full bg-primary-500" :style="`width: ${(stats?.users?.students / stats?.users?.total) * 100}%` "></div>
           </div>
           <div class="flex items-center justify-between">
              <span class="text-dark-400 font-bold">Sellers (Businesses)</span>
              <span class="font-black text-emerald-400">{{ stats?.users?.sellers || 0 }}</span>
           </div>
           <div class="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500" :style="`width: ${(stats?.users?.sellers / stats?.users?.total) * 100}%` "></div>
           </div>
        </div>
      </div>

      <div class="admin-card p-8 space-y-6">
        <h3 class="text-xl font-bold text-white">Revenue Overview</h3>
        <div class="grid grid-cols-2 gap-6">
           <div>
              <p class="text-xs font-bold text-dark-400 uppercase">Total Sales</p>
              <p class="text-2xl font-black text-white">₦{{ stats?.revenue?.totalSales?.toLocaleString() || 0 }}</p>
           </div>
           <div>
              <p class="text-xs font-bold text-dark-400 uppercase">Platform Fees</p>
              <p class="text-2xl font-black text-primary-400">₦{{ (stats?.revenue?.totalSales * 0.1)?.toLocaleString() || 0 }}</p>
           </div>
           <div>
              <p class="text-xs font-bold text-dark-400 uppercase">Commissions Paid</p>
              <p class="text-2xl font-black text-emerald-400">₦{{ stats?.revenue?.totalEarnings?.toLocaleString() || 0 }}</p>
           </div>
           <div>
              <p class="text-xs font-bold text-dark-400 uppercase">Pending Payouts</p>
              <p class="text-2xl font-black text-amber-400">₦{{ stats?.revenue?.totalEarnings - stats?.revenue?.totalWithdrawn || 0 }}</p>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { stats, loading, fetchStats } = useFetchStats()

const quickStats = computed(() => [
  { label: 'Total Users', value: stats.value?.users?.total || 0, icon: 'ph:users-duotone', color: 'text-primary-400' },
  { label: 'Total Products', value: stats.value?.products?.total || 0, icon: 'ph:package-duotone', color: 'text-indigo-400' },
  { label: 'Total Orders', value: stats.value?.orders?.total || 0, icon: 'ph:shopping-cart-duotone', color: 'text-emerald-400' },
  { label: 'Pending Payouts', value: stats.value?.withdrawals?.pending || 0, icon: 'ph:hand-coins-duotone', color: 'text-amber-400' },
])

onMounted(async () => {
  await fetchStats()
})
</script>
