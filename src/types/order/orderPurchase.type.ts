export type orderPurchasePurchase = {
  id: string;
  status: string;
  quantity: string;
  totalPrice: string;
  createdAt: string;
  shop: {
    name: string;
  };
  orderItems: OrderItem[];
};

export type OrderItem = {
  id?: string;
  quantity?: string;
  priceEach?: string;
  totalPrice?: string;
  status: string;
  menu: {
    name: string;
    price: string;
  };
  menuOption: {
    label: string;
    price: string;
  };
};

export type GroupedMenuItem = {
  name: string;
  quantity: number;
  totalPrice: number;
  statuses: Set<string>;
  menu: {
    name: string;
    price: string;
  };
  menuOption: {
    label: string;
    price: string;
  };
};
