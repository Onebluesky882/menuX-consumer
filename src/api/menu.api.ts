import { axiosInstance } from ".";

export const menuApi = {
  getMenuByShopId: (shopId: string) =>
    axiosInstance.get(`/menus`, { params: { shopId } }),
  getMenuWithOption: (shopId: string) =>
    axiosInstance.get(`menus/options/${shopId}`),
};
