import { auth_api } from "@/api_factory/modules/auth";
import { useUser } from "./user";

export const useFetchUser = () => {
  const { user, token } = useUser();

  const fetchUser = async () => {
    if (token.value && !user.value) {
      try {
        const res: any = await auth_api.me();
        if (res.type !== "ERROR") {
          user.value = res.data;
        }
      } catch (e) {
        token.value = null;
      }
    }
  };

  return { fetchUser };
};
