import { auth_api } from "@/api_factory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";
import { useLoader } from "@/composables/core/useLoader";
import { useUser } from "./user";

export const useLogin = () => {
  const loading = ref(false);
  const { startLoading, stopLoading } = useLoader();
  const { user, token } = useUser();

  const login = async (credentials: any) => {
    loading.value = true;
    startLoading("Logging in...");
    try {
      const res: any = await auth_api.login(credentials);
      if (res.type !== "ERROR") {
        user.value = res.data.user;
        token.value = res.data.token;
        return res.data;
      }
    } finally {
      loading.value = false;
      stopLoading();
    }
  };

  return { loading, login };
};
