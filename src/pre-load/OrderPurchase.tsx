"use client";
import { ClockIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ordersApi } from "../api/orders.api";
import OrderPurchaseCard from "../components/orderPurchase/OrderPurchaseCard";
import {
  GroupedMenuItem,
  OrderItem,
  orderPurchasePurchase,
} from "../types/order/orderPurchase.type";

export default function OrderPurchaseWaiting({ orderId }: { orderId: string }) {
  const [orderPurchase, setOrderPurchase] =
    useState<orderPurchasePurchase | null>(null);

  useEffect(() => {
    const getOrderPurchase = async () => {
      const res = await ordersApi.getOrderPurchase(orderId);
      setOrderPurchase(res.data.data[0]);
    };
    getOrderPurchase();
  }, [orderId]);
  const groupMenu = (items: OrderItem[]) => {
    const grouped: Record<string, GroupedMenuItem> = {};

    items.forEach(item => {
      const name = item.menu.name;
      if (!grouped[name]) {
        grouped[name] = {
          name,
          quantity: 0,
          totalPrice: 0,
          statuses: new Set(),
          menu: {
            name: item.menu.name,
            price: item.menu.price,
          },
          menuOption: {
            label: item.menuOption.label,
            price: item.menu.price,
          },
        };
      }

      grouped[name].quantity += parseFloat(item.quantity || "0");
      grouped[name].totalPrice += parseFloat(item.totalPrice || "0");
      grouped[name].statuses.add(item.status);
    });
    return Object.values(grouped);
  };

  if (!orderPurchase) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-xl rounded-xl space-y-4">
      <h2 className="text-xl font-semibold text-center">
        รออาหารจาก{" "}
        <span className="text-primary">{orderPurchase.shop.name}</span>
      </h2>

      <div className="flex items-center justify-center space-x-2 text-yellow-500">
        <ClockIcon className="w-5 h-5 animate-pulse" />
        <p className="font-medium">กำลังเตรียมอาหารของคุณ...</p>
      </div>
      {/* group  */}
      <OrderPurchaseCard groupedItems={groupMenu(orderPurchase.orderItems)} />

      <div className="border-t pt-4 text-right">
        <p className="text-gray-600">รวมทั้งหมด</p>
        <p className="text-lg font-bold text-primary">
          ฿{orderPurchase.totalPrice}
        </p>
      </div>
    </div>
  );
}
