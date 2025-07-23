"use client";

import { useEffect, useState } from "react";
import { shopApi } from "../api/shop.api";
import Image from "next/image";
import { menuApi } from "../api/menu.api";
import { MenuItem } from "../../types/menuOrder.type";
import { CartIconPreview, CartPreview } from "@/components/menu/CartPreview";
import { TotalCard } from "@/components/menu/TotalCard";
import { useRouter } from "next/navigation";
import { useCart } from "../hooks/useCart";
import { Shop } from "../../types/shop.type";

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
      setPreviewCart((prev) => !prev);
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
        <div className="">
          <div className="">
            <h2 className="text-center text-3xl p-2 m-2">{shop?.name}</h2>
            <div className="bg-amber-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {menusOption.map((menu) => (
                <div
                  key={menu.id}
                  className="bg-white  rounded-2xl shadow-md overflow-hidden touch-manipulation"
                >
                  <div>
                    {menu.images[0] && (
                      <Image
                        src={menu.images[0].imageUrl}
                        alt={menu.name}
                        width={500}
                        height={500}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h2 className="text-xl  font-semibold text-gray-800">
                      {menu.name}
                    </h2>

                    <div className="mt-2 space-y-1">
                      {menu.menuOptions.map((option) => (
                        <button
                          onClick={() =>
                            addMenuOptionToCart(option.id, menusOption)
                          }
                          key={option.id}
                          className="w-full flex justify-between items-center bg-green-50 hover:bg-green-200 active:bg-green-300 rounded-xl px-4 py-4 text-xl font-medium text-gray-800 shadow-md transition-all duration-150"
                        >
                          <span>{option.label}</span>
                          <span className="text-green-700">
                            {option.price} บาท
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <TotalCard
              cart={cartItems}
              getTotalOrderPrice={getTotalOrderPrice}
              getTotalOrderItems={getTotalOrderItems}
            />
          </div>
        </div>
      )}
      <div className=" sticky   bottom-0 ">
        {cartItems.length > 0 && !previewCart && (
          <CartIconPreview
            getTotalOrderItems={getTotalOrderItems}
            setPreviewCart={handlePreviewCart}
          />
        )}
      </div>

      <div>
        {previewCart && (
          <div>
            {/* 🔹 GLASS BACKDROP OVERLAY */}
            <div
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-xs transition-all"
              onClick={() => setPreviewCart(false)}
            />

            {/* 🔹 CART PREVIEW */}
            <CartPreview
              open={previewCart}
              onOpenChange={setPreviewCart}
              cart={cartItems}
              totalOrdersPrice={getTotalOrderPrice}
              handleStoreOrders={handleStoreOrders}
              shopId={""}
              increaseQuantity={handleIncrease}
              decreaseQuantity={handleDecrease}
            />
          </div>
        )}
      </div>
    </>
  );
};
export default ShopMenus;
