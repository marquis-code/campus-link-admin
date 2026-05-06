import { withdrawals_api } from "@/api_factory/modules/withdrawals";

export const useFetchWithdrawals = () => {
  const withdrawals = useState<any[]>("admin_withdrawals", () => []);
  const loading = ref(false);

  const fetchWithdrawals = async (status?: string) => {
    loading.value = true;
    try {
      const res: any = await withdrawals_api.getWithdrawals();
      if (res.type !== "ERROR") {
        withdrawals.value = res.data.withdrawals;
      }
    } finally {
      loading.value = false;
    }
  };

  return { withdrawals, loading, fetchWithdrawals };
};
