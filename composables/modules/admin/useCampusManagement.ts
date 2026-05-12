import { ref } from 'vue'

export const useCampusManagement = () => {
  const campuses = ref([])
  const loading = ref(false)
  const config = useRuntimeConfig()
  const { showToast } = useCustomToast()

  const fetchCampuses = async () => {
    loading.value = true
    try {
      const res = await $fetch(`${config.public.apiBase}/campuses/admin/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      campuses.value = Array.isArray(res) ? res : []
    } catch (e: any) {
      campuses.value = []
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

  const createCampus = async (data: any) => {
    try {
      await $fetch(`${config.public.apiBase}/campuses`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: data
      })
      showToast({
        title: 'Success',
        message: 'Campus created successfully',
        toastType: 'success'
      })
      await fetchCampuses()
    } catch (e) {
      showToast({
        title: 'Error',
        message: 'Failed to create campus',
        toastType: 'error'
      })
      throw e
    }
  }

  const updateCampus = async (id: string, data: any) => {
    try {
      await $fetch(`${config.public.apiBase}/campuses/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: data
      })
      showToast({
        title: 'Success',
        message: 'Campus updated successfully',
        toastType: 'success'
      })
      await fetchCampuses()
    } catch (e) {
      showToast({
        title: 'Error',
        message: 'Failed to update campus',
        toastType: 'error'
      })
      throw e
    }
  }

  const deleteCampus = async (id: string) => {
    try {
      await $fetch(`${config.public.apiBase}/campuses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      showToast({
        title: 'Success',
        message: 'Campus deleted successfully',
        toastType: 'success'
      })
      await fetchCampuses()
    } catch (e) {
      showToast({
        title: 'Error',
        message: 'Failed to delete campus',
        toastType: 'error'
      })
    }
  }

  return {
    campuses,
    loading,
    fetchCampuses,
    createCampus,
    updateCampus,
    deleteCampus
  }
}
