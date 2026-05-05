import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from "../axios.config";

export const admin_api = {
  getStats: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get("/admin/stats");
  },
  getUsers: (params: any = {}) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get("/admin/users", { params });
  },
  updateUserStatus: (userId: string, data: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/admin/users/${userId}/status`, data);
  },
  getCampuses: () => {
    return GATEWAY_ENDPOINT.get("/campuses");
  },
  getCategories: () => {
    return GATEWAY_ENDPOINT.get("/categories");
  },
};
