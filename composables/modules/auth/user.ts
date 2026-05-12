import { watch } from 'vue'

const userState = () => useState<any>("user_data", () => {
  if (import.meta.client) {
    const stored = localStorage.getItem("user_data");
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
  return null;
});

const tokenState = () => useState<string | null>("auth_token", () => {
  if (import.meta.client) {
    return localStorage.getItem("auth_token") || null;
  }
  return null;
});

let watchersInitialized = false;

export const useUser = () => {
  const user = userState();
  const token = tokenState();

  if (import.meta.client && !watchersInitialized) {
    watchersInitialized = true;
    
    watch(user, (val) => {
      if (val) {
        localStorage.setItem("user_data", JSON.stringify(val));
      } else {
        localStorage.removeItem("user_data");
      }
    }, { deep: true });

    watch(token, (val) => {
      if (val) {
        localStorage.setItem("auth_token", val);
      } else {
        localStorage.removeItem("auth_token");
      }
    });
  }

  const logOut = () => {
    user.value = null;
    token.value = null;
    if (import.meta.client) {
      localStorage.removeItem("user_data");
      localStorage.removeItem("auth_token");
    }
    navigateTo("/login");
  };

  return {
    user,
    token,
    logOut,
  };
};
