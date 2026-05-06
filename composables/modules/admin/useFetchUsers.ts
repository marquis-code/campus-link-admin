import { admin_api } from "@/api_factory/modules/admin";

export const useFetchUsers = () => {
  const users = useState<any[]>("admin_users", () => []);
  const loading = ref(false);

  const fetchUsers = async (params: any = {}) => {
    loading.value = true;
    try {
      const res: any = await admin_api.getUsers(params);
      if (res.type !== "ERROR") {
        users.value = res.data.users;
        return res.data;
      }
    } finally {
      loading.value = false;
    }
  };

  return { users, loading, fetchUsers };
};
