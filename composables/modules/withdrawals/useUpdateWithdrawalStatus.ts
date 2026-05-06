import { withdrawals_api } from "@/api_factory/modules/withdrawals";
import { useLoader } from "@/composables/core/useLoader";
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useUpdateWithdrawalStatus = () => {
  const loading = ref(false);
  const { startLoading, stopLoading } = useLoader();
  const { showToast } = useCustomToast();

  const updateStatus = async (id: string, data: { status: string; adminNote?: string }) => {
    loading.value = true;
    startLoading("Updating status...");
    try {
      const res: any = await withdrawals_api.updateStatus(id, data);
      if (res.type !== "ERROR") {
        showToast("Withdrawal status updated", "success");
        return res.data;
      }
    } finally {
      loading.value = false;
      stopLoading();
    }
  };

  return { loading, updateStatus };
};
