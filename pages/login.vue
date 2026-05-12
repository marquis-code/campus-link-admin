<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-['Inter',sans-serif]">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center space-y-3">
        <div class="w-16 h-16 bg-primary-600 rounded-2xl mx-auto flex items-center justify-center">
          <ShieldCheck class="text-white w-8 h-8" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">CampusLink</h1>
        <p class="text-gray-500 font-medium text-sm">Administrative access only</p>
      </div>

      <div class="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-gray-500 ml-1">Email address</label>
              <input 
                v-model="form.email" 
                type="email" 
                required 
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-sm" 
                placeholder="admin@campuslink.com" 
              />
            </div>
            <div class="space-y-1.5 relative">
              <label class="text-xs font-semibold text-gray-500 ml-1">Password</label>
              <div class="relative">
                <input 
                  v-model="form.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  required 
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-sm pr-12" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword" 
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Eye v-if="!showPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            :disabled="loading" 
            class="w-full bg-primary-600 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-primary-700 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
          >
            <Loader2 v-if="loading" class="animate-spin w-5 h-5" />
            <template v-else>Access dashboard</template>
          </button>
        </form>
      </div>
      
      <p class="text-center text-gray-400 text-xs font-medium italic">Security monitored session • Unauthorized access is prohibited</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ShieldCheck, Loader2, Eye, EyeOff } from 'lucide-vue-next'

definePageMeta({ layout: false })

const loading = ref(false)
const showPassword = ref(false)
const form = reactive({ email: '', password: '' })

const { login } = useAuth()
const { showToast } = useCustomToast()

const handleLogin = async () => {
  loading.value = true
  try {
    const res = await login(form)
    if (res.user.role !== 'admin') {
      showToast({
        title: 'Unauthorized',
        message: 'This account does not have administrative privileges.',
        toastType: 'error'
      })
      useAuth().logout()
      return
    }
    showToast({
      title: 'Welcome back',
      message: `Signed in as ${res.user.name}`,
      toastType: 'success'
    })
    navigateTo('/dashboard')
  } catch (e: any) {
    showToast({
      title: 'Login failed',
      message: e?.data?.message || 'Invalid credentials. Please check your email and password.',
      toastType: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>
