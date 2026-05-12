<template>
  <div class="space-y-8 relative">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Category Management</h1>
        <p class="text-gray-500 font-medium text-sm">Organize products across the platform.</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-sm"
      >
        <Plus class="w-4 h-4" />
        Add new category
      </button>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <UiSkeleton height="400px" rounded="3xl" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!categories?.length" class="py-12">
      <UiEmptyState 
        :icon="Tags"
        title="No categories found"
        description="Create categories to help users find products easily."
      >
        <template #action>
          <button @click="openCreateModal" class="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm">
            Create your first category
          </button>
        </template>
      </UiEmptyState>
    </div>

    <!-- Category Table -->
    <div v-else class="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100">
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide uppercase">Category</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide uppercase">Description</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide uppercase text-center">Products</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide uppercase">Status</th>
              <th class="px-8 py-4 text-xs font-semibold text-gray-400 tracking-wide uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="cat in categories" :key="cat._id" class="hover:bg-gray-50/30 transition-colors group">
              <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <component :is="getCategoryIcon(cat.name)" class="w-5 h-5" />
                  </div>
                  <span class="font-bold text-gray-900 text-sm">{{ cat.name }}</span>
                </div>
              </td>
              <td class="px-8 py-5 text-[13px] text-gray-500 font-medium max-w-xs truncate">
                {{ cat.description || 'Global product category' }}
              </td>
              <td class="px-8 py-5 text-center">
                <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold bg-indigo-50 text-indigo-600 uppercase tracking-tight">
                  {{ cat.productsCount || 0 }} Items
                </span>
              </td>
              <td class="px-8 py-5">
                <div class="flex items-center gap-1.5">
                   <div class="w-1.5 h-1.5 rounded-full" :class="cat.isActive ? 'bg-emerald-500' : 'bg-gray-300'"></div>
                   <span class="text-sm font-bold uppercase tracking-wide" :class="cat.isActive ? 'text-emerald-600' : 'text-gray-400'">{{ cat.isActive ? 'Active' : 'Inactive' }}</span>
                </div>
              </td>
              <td class="px-8 py-5 text-right">
                <div class="flex justify-end gap-2 transition-opacity">
                  <button @click="openEditModal(cat)" class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all border border-gray-50 shadow-sm">
                    <PencilLine class="w-4 h-4" />
                  </button>
                  <button @click="confirmDelete(cat)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-gray-50 shadow-sm">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Category Form Modal -->
    <UiModal 
      :is-open="isModalOpen" 
      :title="isEditing ? 'Edit category' : 'Add new category'" 
      @close="isModalOpen = false"
    >
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-gray-500 ml-1">Category Name</label>
          <input 
            v-model="form.name" 
            required 
            class="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none text-sm font-medium"
            placeholder="e.g. Fashion & Apparel"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold text-gray-500 ml-1">Description (Optional)</label>
          <textarea 
            v-model="form.description" 
            rows="3"
            class="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none text-sm font-medium resize-none"
            placeholder="Brief description of products in this category..."
          ></textarea>
        </div>

        <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
           <input type="checkbox" v-model="form.isActive" class="w-5 h-5 rounded-lg text-indigo-600 border-gray-300 focus:ring-indigo-500" />
           <label class="text-sm font-bold text-gray-700">Set as active category</label>
        </div>

        <div class="flex gap-3 pt-4">
          <button type="button" @click="isModalOpen = false" class="flex-1 py-3 border border-gray-100 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button type="submit" :disabled="formLoading" class="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50">
            {{ isEditing ? 'Save changes' : 'Create category' }}
          </button>
        </div>
      </form>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { Plus, Tags, Package, PencilLine, Trash2, Smartphone, Watch, Laptop, Coffee, Shirt, Utensils, Zap } from 'lucide-vue-next'

const { 
  categories, 
  loading, 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = useCategoryManagement()

const { confirm } = useConfirmDialog()

// Modal State
const isModalOpen = ref(false)
const isEditing = ref(false)
const formLoading = ref(false)
const selectedId = ref(null)

const form = reactive({
  name: '',
  description: '',
  isActive: true
})

const openCreateModal = () => {
  isEditing.value = false
  form.name = ''
  form.description = ''
  form.isActive = true
  isModalOpen.value = true
}

const openEditModal = (cat) => {
  isEditing.value = true
  selectedId.value = cat._id
  form.name = cat.name
  form.description = cat.description
  form.isActive = cat.isActive
  isModalOpen.value = true
}

const handleSubmit = async () => {
  formLoading.value = true
  try {
    if (isEditing.value) {
      await updateCategory(selectedId.value, form)
    } else {
      await createCategory(form)
    }
    isModalOpen.value = false
  } finally {
    formLoading.value = false
  }
}

const confirmDelete = async (cat) => {
  const confirmed = await confirm({
    title: 'Delete Category',
    message: `Are you sure you want to remove ${cat.name}? Products in this category might be affected.`,
    variant: 'danger',
    confirmText: 'Yes, delete category'
  })

  if (confirmed) {
    await deleteCategory(cat._id)
  }
}

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('phone') || n.includes('mobile')) return Smartphone
  if (n.includes('laptop') || n.includes('comp')) return Laptop
  if (n.includes('watch') || n.includes('wear')) return Watch
  if (n.includes('food') || n.includes('meal')) return Utensils
  if (n.includes('drink') || n.includes('coffee')) return Coffee
  if (n.includes('fashion') || n.includes('cloth') || n.includes('shirt')) return Shirt
  if (n.includes('electro') || n.includes('gadget')) return Zap
  return Package
}

onMounted(fetchCategories)
</script>
