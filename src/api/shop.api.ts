import { axiosInstance } from ".";

export const shopApi = {
  getAllShop: () => axiosInstance.get("/shops/consumer"),
  getShopBtId: (id: string) => axiosInstance.get(`/shops/${id}`),
};
