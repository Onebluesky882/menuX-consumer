"use client";

import { CartIconPreview, CartPreview } from "@/components/menu/CartPreview";
import { MenuItem } from "@/types/menuOrder.type";
import { Shop } from "@/types/shop.type";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { menuApi } from "../api/menu.api";
import { shopApi } from "../api/shop.api";
import { TotalCard } from "../components/menu/TotalCard";
import ShopCard from "../components/shop/ShopCard";
import { useCart } from "../hooks/useCart";

const ShopMenus = ({ shopId }: { shopId: string }) => {
  const [shop, setShop] = useState<Shop>();
  const [menusOption, setMenusOption] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewCart, setPreviewCart] = useState(false);

  const {
    cartItems,
    submitCart,
    clearCart,
    getTotalOrderPrice,
    getTotalOrderItems,
    addMenuOptionToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const router = useRouter();
  useEffect(() => {
    setLoading(true);
    const shop = async () => {
      const res = await shopApi.getShopBtId(shopId);
      setShop(res.data.data);
      setLoading(false);
    };
    const getMenuOption = async () => {
      const res = await menuApi.getMenuWithOption(shopId);
      setMenusOption(res.data);
    };

    getMenuOption();
    shop();
  }, [shopId]);

  console.log("shop", shop);

  const handlePreviewCart = () => {
    try {
      setPreviewCart(prev => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStoreOrders = async () => {
    if (!shop) return;
    const orderId = await submitCart(shop.id);
    router.push(`/order/${orderId}`);
    clearCart();
  };

  const handleIncrease = (optionId: string) => {
    increaseQuantity(optionId);
  };
  const handleDecrease = (optionId: string) => {
    decreaseQuantity(optionId);
  };
  console.log("cart", cartItems);
  return (
    <>
      {loading ? (
        <div>loading...</div>
      ) : (
        <div>
          <TotalCard
            cart={cartItems}
            getTotalOrderPrice={getTotalOrderPrice}
            getTotalOrderItems={getTotalOrderItems}
          />
          <ShopCard
            menusOption={menusOption}
            addMenuOptionToCart={addMenuOptionToCart}
          />
        </div>
      )}

      <div className="sticky bottom-0">
        {cartItems.length > 0 && !previewCart && (
          <CartIconPreview
            getTotalOrderItems={getTotalOrderItems}
            setPreviewCart={handlePreviewCart}
          />
        )}
      </div>

      {previewCart && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-xs transition-all"
            onClick={() => setPreviewCart(false)}
          />

          <CartPreview
            open={previewCart}
            onOpenChange={setPreviewCart}
            cart={cartItems}
            totalOrdersPrice={getTotalOrderPrice}
            handleStoreOrders={handleStoreOrders}
            shopId={shop?.id ?? ""}
            increaseQuantity={handleIncrease}
            decreaseQuantity={handleDecrease}
          />
        </>
      )}
    </>
  );
};
export default ShopMenus;
