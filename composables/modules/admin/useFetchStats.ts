import { admin_api } from "@/api_factory/modules/admin";
import { useLoader } from "@/composables/core/useLoader";

export const useFetchStats = () => {
  const loading = ref(false);
  const stats = ref(null);
  const { startLoading, stopLoading } = useLoader();

  const fetchStats = async () => {
    loading.value = true;
    startLoading("Fetching platform stats...");
    try {
      const res: any = await admin_api.getStats();
      if (res.type !== "ERROR") {
        stats.value = res.data;
        return res.data;
      }
    } finally {
      loading.value = false;
      stopLoading();
    }
  };

  return { loading, stats, fetchStats };
};
