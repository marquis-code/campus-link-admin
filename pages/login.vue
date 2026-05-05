<template>
  <div class="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6">
    <div class="w-full max-w-md space-y-10">
      <div class="text-center space-y-2">
        <h1 class="text-5xl font-black text-primary-500 tracking-tighter">CAMPUSLINK</h1>
        <p class="text-dark-400 font-bold uppercase tracking-[0.2em] text-[10px]">Master Administrative Portal</p>
      </div>

      <div class="admin-card p-10 space-y-8 bg-dark-900 border-2 border-dark-800">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-black text-dark-500 uppercase tracking-widest ml-1 mb-2">Admin Credentials</label>
              <input v-model="form.email" type="email" required class="input-field py-4 border-2 border-dark-800 bg-dark-950 focus:border-primary-500 transition-colors" placeholder="Email" />
            </div>
            <input v-model="form.password" type="password" required class="input-field py-4 border-2 border-dark-800 bg-dark-950 focus:border-primary-500 transition-colors" placeholder="Password" />
          </div>
          
          <button type="submit" :disabled="loading" class="w-full bg-primary-600 text-white py-5 text-lg font-black uppercase tracking-widest hover:bg-primary-700 transition-all border-b-4 border-primary-900 active:border-b-0 active:translate-y-1 flex justify-center">
            <template v-if="loading"><Icon name="ph:spinner-bold" class="animate-spin text-2xl" /></template>
            <template v-else>Access Dashboard</template>
          </button>

          <div class="relative py-2">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-dark-800"></div></div>
            <div class="relative flex justify-center text-[10px] uppercase tracking-widest"><span class="bg-dark-900 px-2 text-dark-500 font-black">Secure Social Auth</span></div>
          </div>

          <button @click="handleGoogleLogin" type="button" class="w-full flex items-center justify-center gap-3 py-4 border border-dark-800 rounded-xl font-bold text-dark-400 hover:bg-dark-800 transition-all">
            <Icon name="logos:google-icon" class="text-lg" />
            Admin Google Access
          </button>
        </form>
      </div>
      
      <p class="text-center text-dark-600 text-[10px] font-black uppercase tracking-widest">Authorized Access Only • CampusLink Security</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })
const { login, socialLogin } = useAuth()
const { loginWithGoogle } = useFirebase()
const loading = ref(false)
const form = reactive({ email: '', password: '' })

const handleLogin = async () => {
  loading.value = true
  try {
    const res = await login(form)
    if (res.user.role !== 'admin') {
      alert('Unauthorized access attempt.')
      useAuth().logout()
      return
    }
    navigateTo('/')
  } catch (e) {
    alert('Access denied. Check your credentials.')
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  try {
    const idToken = await loginWithGoogle()
    const res = await socialLogin(idToken)
    if (res.user.role !== 'admin') {
      alert('Unauthorized access attempt.')
      useAuth().logout()
      return
    }
    navigateTo('/')
  } catch (e) {
    alert('Google login failed')
  }
}
</script>
