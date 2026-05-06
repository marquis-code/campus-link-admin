import { computed } from "vue";

export const useAdmin = () => {
  const { users, fetchUsers, loading: usersLoading } = useFetchUsers();
  const { toggleUserStatus, loading: managementLoading } = useUserManagement();
  const { stats, fetchStats, loading: statsLoading } = useFetchStats();

  return {
    users,
    stats,
    fetchUsers,
    toggleUserStatus,
    fetchStats,
    loading: computed(() => usersLoading.value || managementLoading.value || statsLoading.value),
  };
};
