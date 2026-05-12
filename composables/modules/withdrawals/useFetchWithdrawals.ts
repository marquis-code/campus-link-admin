import { withdrawals_api } from "@/api_factory/modules/withdrawals";
import { ref } from "vue";

export const useFetchWithdrawals = () => {
  const withdrawals = useState<any[]>("admin_withdrawals", () => []);
  const loading = ref(false);

  const fetchWithdrawals = async () => {
    loading.value = true;
    try {
      const res: any = await withdrawals_api.getWithdrawals();

      if (res.type !== "ERROR") {
        withdrawals.value = res.data?.withdrawals || [];
      } else {
        withdrawals.value = [];
      }
    } catch (e) {
      withdrawals.value = [];
    } finally {
      loading.value = false;
    }
  };

  return { withdrawals, loading, fetchWithdrawals };
};
