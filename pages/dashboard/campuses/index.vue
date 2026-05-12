<template>
  <div class="space-y-8 relative">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Campus Management</h1>
        <p class="text-gray-500 font-medium text-sm">Manage all supported Nigerian universities.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-all active:scale-95 shadow-sm"
      >
        <Plus class="w-4 h-4" />
        Add new campus
      </button>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <UiSkeleton height="400px" rounded="3xl" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!campuses?.length" class="py-12">
      <UiEmptyState 
        :icon="MapPin"
        title="No campuses found"
        description="Start by adding a Nigerian university to the platform."
      >
        <template #action>
          <button @click="openCreateModal" class="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm">
            Add your first campus
          </button>
        </template>
      </UiEmptyState>
    </div>

    <!-- Campus Table -->
    <div v-else class="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100">
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide uppercase">University</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide uppercase">Location</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide uppercase text-center">Ambassadors</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide uppercase">Status</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="campus in campuses" :key="campus._id" class="hover:bg-gray-50/30 transition-colors group">
              <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <School class="w-5 h-5" />
                  </div>
                  <span class="font-bold text-gray-900 text-sm">{{ campus.name }}</span>
                </div>
              </td>
              <td class="px-8 py-5 text-[13px] text-gray-500 font-medium">
                {{ campus.address || 'Nigerian Institution' }}
              </td>
              <td class="px-8 py-5 text-center">
                <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold bg-primary-50 text-primary-600 uppercase tracking-tight">
                  {{ campus.studentsCount || 0 }} Active
                </span>
              </td>
              <td class="px-8 py-5">
                <div class="flex items-center gap-1.5">
                   <div class="w-1.5 h-1.5 rounded-full" :class="campus.isActive ? 'bg-emerald-500' : 'bg-gray-300'"></div>
                   <span class="text-sm font-bold uppercase tracking-wide" :class="campus.isActive ? 'text-emerald-600' : 'text-gray-400'">{{ campus.isActive ? 'Active' : 'Inactive' }}</span>
                </div>
              </td>
              <td class="px-8 py-5 text-right">
                <div class="flex justify-end gap-2 transition-opacity">
                  <button @click="openEditModal(campus)" class="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all border border-gray-50 shadow-sm">
                    <PencilLine class="w-4 h-4" />
                  </button>
                  <button @click="confirmDelete(campus)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-gray-50 shadow-sm">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Campus Form Modal -->
    <UiModal 
      :is-open="isModalOpen" 
      :title="isEditing ? 'Edit campus' : 'Add new campus'" 
      @close="isModalOpen = false"
    >
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-gray-500 ml-1">Campus Name</label>
          <input 
            v-model="form.name" 
            required 
            class="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary-500 outline-none text-sm font-medium"
            placeholder="e.g. University of Lagos"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold text-gray-500 ml-1">Address / Location</label>
          <input 
            v-model="form.address" 
            required 
            class="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary-500 outline-none text-sm font-medium"
            placeholder="e.g. Akoka, Yaba"
          />
        </div>

        <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
           <input type="checkbox" v-model="form.isActive" class="w-5 h-5 rounded-lg text-primary-600 border-gray-300 focus:ring-primary-500" />
           <label class="text-sm font-bold text-gray-700">Set as active campus</label>
        </div>

        <div class="flex gap-3 pt-4">
          <button type="button" @click="isModalOpen = false" class="flex-1 py-3 border border-gray-100 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button type="submit" :disabled="formLoading" class="flex-1 py-3 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all disabled:opacity-50">
            {{ isEditing ? 'Save changes' : 'Create campus' }}
          </button>
        </div>
      </form>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { Plus, MapPin, School, PencilLine, Trash2 } from 'lucide-vue-next'

const { 
  campuses, 
  loading, 
  fetchCampuses, 
  createCampus, 
  updateCampus, 
  deleteCampus 
} = useCampusManagement()

const { confirm } = useConfirmDialog()

// Modal State
const isModalOpen = ref(false)
const isEditing = ref(false)
const formLoading = ref(false)
const selectedId = ref(null)

const form = reactive({
  name: '',
  address: '',
  isActive: true
})

const openCreateModal = () => {
  isEditing.value = false
  form.name = ''
  form.address = ''
  form.isActive = true
  isModalOpen.value = true
}

const openEditModal = (campus) => {
  isEditing.value = true
  selectedId.value = campus._id
  form.name = campus.name
  form.address = campus.address
  form.isActive = campus.isActive
  isModalOpen.value = true
}

const handleSubmit = async () => {
  formLoading.value = true
  try {
    if (isEditing.value) {
      await updateCampus(selectedId.value, form)
    } else {
      await createCampus(form)
    }
    isModalOpen.value = false
  } finally {
    formLoading.value = false
  }
}

const confirmDelete = async (campus) => {
  const confirmed = await confirm({
    title: 'Delete Campus',
    message: `Are you sure you want to remove ${campus.name}? This action cannot be undone.`,
    variant: 'danger',
    confirmText: 'Yes, delete campus'
  })

  if (confirmed) {
    await deleteCampus(campus._id)
  }
}

onMounted(fetchCampuses)
</script>
