import { create } from "zustand";
import { ordersApi } from "../api/orders.api";
import { CartItem, MenuItem, OrderPayload } from "../types/menuOrder.type";

type CartStore = {
  cartItems: CartItem[];
  addCart: (item: CartItem) => void;
  clearCart: () => void;
  getTotalOrderPrice: () => number;
  getTotalOrderItems: () => number;
  addMenuOptionToCart: (optionId: string, menusOption: MenuItem[]) => void;
  submitCart: (shopId: string) => Promise<void>;
  increaseQuantity: (optionId: string) => void;
  decreaseQuantity: (optionId: string) => void;
};

export const useCart = create<CartStore>((set, get) => ({
  cartItems: [],

  addCart: item =>
    set(state => ({
      cartItems: [...state.cartItems, item],
    })),

  clearCart: () => set({ cartItems: [] }),

  getTotalOrderPrice: () => {
    const items = get().cartItems;
    return items.reduce((total, item) => {
      return total + Number(item.selectedOption.price) * item.quantity;
    }, 0);
  },

  getTotalOrderItems: () => {
    const items = get().cartItems;
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  submitCart: async shopId => {
    const currentCart = get().cartItems;
    const payload: OrderPayload = {
      shopId,
      items: currentCart.map(menu => ({
        menuId: menu.menuId,
        quantity: menu.quantity,
        priceEach: menu.basePrice,
        totalPrice: menu.totalPrice,
        optionId: menu.optionId,
      })),
    };
    try {
      const res = await ordersApi.create(payload);
      return res.data.data.id;
    } catch (error) {
      console.error("submitCart failed", error);
    }
  },

  addMenuOptionToCart: (optionId, menusOption) => {
    const cartItems = get().cartItems;
    const addCart = get().addCart;

    const menu = menusOption.find(menu =>
      menu.menuOptions.some(option => option.id === optionId)
    );
    if (!menu) return;

    const selectedOption = menu.menuOptions.find(
      option => option.id === optionId
    );
    if (!selectedOption) return;

    const price = Number(selectedOption.price);
    const existing = cartItems.find(
      item =>
        item.menuId === menu.id &&
        item.optionId === optionId &&
        item.selectedOption.label === selectedOption.label
    );
    if (existing) {
      // เพิ่ม quantity ถ้ามีอยู่แล้ว
      set(state => ({
        cartItems: state.cartItems.map(item =>
          item.menuId === existing.menuId &&
          item.optionId === optionId &&
          item.selectedOption.label === selectedOption.label
            ? {
                ...item,
                quantity: item.quantity + 1,
                totalPrice: price * (item.quantity + 1),
              }
            : item
        ),
      }));
    } else {
      // เพิ่ม item ใหม่ ถ้ายังไม่มี
      const newItem: CartItem = {
        menuId: menu.id,
        basePrice: price,
        menuName: menu.name,
        selectedOption,
        quantity: 1,
        totalPrice: price,
        optionId,
      };
      addCart(newItem);
    }
  },

  increaseQuantity: optionId => {
    let priceMap: Record<string, number> = {};
    get().cartItems.forEach(item => {
      priceMap[item.optionId] = Number(item.selectedOption.price);
    });

    set(state => ({
      cartItems: state.cartItems.map(item => {
        if (item.optionId === optionId) {
          const newQuantity = item.quantity + 1;
          const newTotalPrice = newQuantity * priceMap[optionId];
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: newTotalPrice,
          };
        }
        return item;
      }),
    }));
  },

  decreaseQuantity: optionId => {
    let priceMap: Record<string, number> = {};
    get().cartItems.forEach(item => {
      priceMap[item.optionId] = Number(item.selectedOption.price);
    });

    set(state => ({
      cartItems: state.cartItems
        .map(item => {
          if (item.optionId === optionId) {
            const quantity = item.quantity - 1;
            if (quantity <= 0) return null;
            const newTotalPrice = quantity * priceMap[optionId];
            return {
              ...item,
              quantity,
              totalPrice: newTotalPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[],
    }));
  },
}));
