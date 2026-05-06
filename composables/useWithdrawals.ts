import { computed } from "vue";

export const useWithdrawals = () => {
  const { withdrawals, fetchWithdrawals, loading: fetchLoading } = useFetchWithdrawals();
  const { updateStatus, loading: updateLoading } = useUpdateWithdrawalStatus();

  return {
    withdrawals,
    fetchWithdrawals,
    updateStatus,
    loading: computed(() => fetchLoading.value || updateLoading.value),
  };
};
