import { computed } from "vue";

export const useAuth = () => {
  const { user, token, logOut } = useUser();
  const { login, loading: loginLoading } = useLogin();
  const { signup, loading: signupLoading } = useSignup();
  const { socialLogin, loading: socialLoading } = useSocialLogin();
  const { fetchUser } = useFetchUser();

  return {
    user,
    token,
    login,
    signup,
    socialLogin,
    fetchUser,
    logout: logOut,
    loading: computed(() => loginLoading.value || signupLoading.value || socialLoading.value),
  };
};
