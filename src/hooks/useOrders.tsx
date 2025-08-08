import { create } from "zustand";
import { ordersApi } from "../api/orders.api";
import { RawOrderItem } from "../types/menuOrder.type";

type OrderStore = {
  orders: RawOrderItem[];
  setOrders: (order: RawOrderItem[]) => void;
  addOrder: (order: RawOrderItem) => void;
  totalPrice: number;
  fetchOrder: (orderId: string) => void;
  getTotalPrice: () => number;
};
const useOrders = create<OrderStore>((set, get) => ({
  orders: [],
  totalPrice: 0,

  setOrders: orders => set({ orders }),
  addOrder: order => set(state => ({ orders: [...state.orders, order] })),
  fetchOrder: async orderId => {
    try {
      const res = await ordersApi.getOrderById(orderId);
      set({ orders: res.data.data });
    } catch (error) {
      console.error("❌ Failed to fetch order:", error);
    }
  },

  getTotalPrice: () => {
    let total = 0;
    get().orders.forEach(order => {
      total += Number(order.priceEach);
    });
    return total;
  },
}));

export default useOrders;
