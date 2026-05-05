import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from "../axios.config";

export const auth_api = {
  login: (credentials: any) => {
    return GATEWAY_ENDPOINT.post("/auth/login", credentials);
  },
  signup: (formData: any) => {
    return GATEWAY_ENDPOINT.post("/auth/signup", formData);
  },
  me: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get("/auth/me");
  },
  firebaseLogin: (idToken: string) => {
    return GATEWAY_ENDPOINT.post("/auth/firebase-login", { idToken });
  },
  updateProfile: (data: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch("/auth/profile", data);
  },
};
