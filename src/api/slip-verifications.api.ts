import { axiosInstance } from ".";

export type SlipVerify = {
  amount: string;
  qrcode_data: string;
  orderId: string;
};
export const checkSlipApi = {
  postSlip: (data: SlipVerify) =>
    axiosInstance.post("slip-verifications", data),
};
