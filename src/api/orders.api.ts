import { axiosInstance } from ".";
import { OrderPayload } from "../types/menuOrder.type";

export const ordersApi = {
  create: (payload: OrderPayload) => axiosInstance.post("/orders", payload),
  getOrderById: (orderId: string) =>
    axiosInstance.get(`order-items/${orderId}`),

  getOrderPurchase: (orderId: string) =>
    axiosInstance.get(`orders/purchase/${orderId}`),
  updateOrderPurchase: (orderId: string) =>
    axiosInstance.patch(`/orders/${orderId}`),
};
