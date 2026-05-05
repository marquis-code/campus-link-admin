export const useUser = () => {
  const user = useState<any>("user", () => null);
  const token = useCookie("auth_token", { maxAge: 60 * 60 * 24 * 7 });

  const logOut = () => {
    user.value = null;
    token.value = null;
    navigateTo("/login");
  };

  return {
    user,
    token,
    logOut,
  };
};
