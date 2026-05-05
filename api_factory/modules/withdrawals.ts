import { GATEWAY_ENDPOINT_WITH_AUTH } from "../axios.config";

export const withdrawals_api = {
  getWithdrawals: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get("/withdrawals");
  },
  updateStatus: (id: string, data: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/withdrawals/${id}/status`, data);
  },
};
