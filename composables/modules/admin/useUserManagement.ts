import { admin_api } from "@/api_factory/modules/admin";
import { useLoader } from "@/composables/core/useLoader";
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useUserManagement = () => {
  const loading = ref(false);
  const { startLoading, stopLoading } = useLoader();
  const { showToast } = useCustomToast();

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    loading.value = true;
    startLoading("Updating user...");
    try {
      const res: any = await admin_api.updateUserStatus(userId, { 
        status: newStatus 
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (res.type !== "ERROR") {
        showToast(`User ${newStatus}`, "success");
        return res.data;
      }
    } finally {
      loading.value = false;
      stopLoading();
    }
  };

  return { loading, toggleUserStatus };
};
