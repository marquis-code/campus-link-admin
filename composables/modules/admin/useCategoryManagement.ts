import { ref } from 'vue'

export const useCategoryManagement = () => {
  const categories = ref([])
  const loading = ref(false)
  const config = useRuntimeConfig()
  const { showToast } = useCustomToast()

  const fetchCategories = async () => {
    loading.value = true
    try {
      const res = await $fetch(`${config.public.apiBase}/categories/admin/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      categories.value = Array.isArray(res) ? res : []
    } catch (e: any) {
      categories.value = []
      if (e.status === 401) {
        showToast({
          title: 'Unauthorized',
          message: 'Your session has expired. Please log in again.',
          toastType: 'error'
        })
      }
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (data: any) => {
    try {
      await $fetch(`${config.public.apiBase}/categories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: data
      })
      showToast({
        title: 'Success',
        message: 'Category created successfully',
        toastType: 'success'
      })
      await fetchCategories()
    } catch (e) {
      showToast({
        title: 'Error',
        message: 'Failed to create category',
        toastType: 'error'
      })
      throw e
    }
  }

  const updateCategory = async (id: string, data: any) => {
    try {
      await $fetch(`${config.public.apiBase}/categories/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: data
      })
      showToast({
        title: 'Success',
        message: 'Category updated successfully',
        toastType: 'success'
      })
      await fetchCategories()
    } catch (e) {
      showToast({
        title: 'Error',
        message: 'Failed to update category',
        toastType: 'error'
      })
      throw e
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      await $fetch(`${config.public.apiBase}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      showToast({
        title: 'Success',
        message: 'Category deleted successfully',
        toastType: 'success'
      })
      await fetchCategories()
    } catch (e) {
      showToast({
        title: 'Error',
        message: 'Failed to delete category',
        toastType: 'error'
      })
    }
  }

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
