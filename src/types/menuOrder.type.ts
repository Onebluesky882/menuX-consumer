export type MenuOption = {
  id: string;
  menuId: string;
  label: string;
  price: string;
  available: boolean;
};

export type MenuImage = {
  id: string;
  imageUrl: string;
  createdAt: string;
  type: string;
  shopId: string;
  menuId: string;
  userId: string;
};

export type MenuItem = {
  id: string;
  createdBy: string;
  name: string;
  price: string;
  available: boolean;
  createdAt: string;
  pageId: string | null;
  shopId: string;
  images: MenuImage[];
  menuOptions: MenuOption[];
};

export type CartItem = {
  menuId: string;
  menuName: string;
  basePrice: number;
  selectedOption: MenuOption;
  quantity: number;
  totalPrice: number;
  optionId: string;
};

export type OrderPayload = {
  shopId: string;
  items: {
    menuId: string;
    quantity: number;
    priceEach: number;
    totalPrice: number;
  }[];
};

export type OrderOption = {
  id: string;
  menuName: string;
  orderId: string;
  menuId: string;
  quantity: string;
  priceEach: string;
  totalPrice: string;
  createdAt: string;
  updatedAt: string;
  status: string;
};

export type RawOrderItem = {
  menuName: string;
  quantity: string;
  priceEach: string;
  optionLabel: string;
};

export type GroupedData = {
  [menuName: string]: {
    [price: string]: {
      totalQuantity: number;
      totalPrice: number;
      optionLabel: string;
    };
  };
};
