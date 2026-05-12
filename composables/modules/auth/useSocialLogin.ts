import { auth_api } from "@/api_factory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";
import { useLoader } from "@/composables/core/useLoader";
import { useUser } from "./user";

export const useSocialLogin = () => {
  const loading = ref(false);
  const { startLoading, stopLoading } = useLoader();
  const { user, token } = useUser();

  const socialLogin = async (idToken: string) => {
    loading.value = true;
    startLoading("Connecting social account...");
    try {
      const res: any = await auth_api.firebaseLogin(idToken);
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

  return { loading, socialLogin };
};
