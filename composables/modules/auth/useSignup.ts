import { auth_api } from "@/api_factory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";
import { useLoader } from "@/composables/core/useLoader";
import { useUser } from "./user";

export const useSignup = () => {
  const loading = ref(false);
  const { startLoading, stopLoading } = useLoader();
  const { user, token } = useUser();

  const signup = async (formData: any) => {
    loading.value = true;
    startLoading("Creating account...");
    try {
      const res: any = await auth_api.signup(formData);
      if (res.type !== "ERROR") {
        const payload = res?.data?.data || res?.data || res;
        if (payload.user) {
          user.value = payload.user;
        }
        if (payload.token) {
          token.value = payload.token;
        }
        return payload;
      }
    } finally {
      loading.value = false;
      stopLoading();
    }
  };

  return { loading, signup };
};
