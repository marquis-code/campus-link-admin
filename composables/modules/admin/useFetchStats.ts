import { admin_api } from "@/api_factory/modules/admin";
import { ref } from "vue";

export const useFetchStats = () => {
  const stats = useState<any>("admin_stats", () => ({
    totalUsers: 0,
    totalOrders: 0,
    totalEarnings: 0,
    activeSellers: 0
  }));
  const loading = ref(false);

  const fetchStats = async () => {
    loading.value = true;
    try {
      const res: any = await admin_api.getStats();
      if (res.type !== "ERROR") {
        stats.value = res.data || stats.value;
      }
    } catch (e) {
      console.error('Failed to fetch stats', e)
    } finally {
      loading.value = false;
    }
  };

  return { stats, loading, fetchStats };
};
