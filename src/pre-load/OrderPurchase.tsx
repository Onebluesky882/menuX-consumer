"use client";

import { useEffect, useState } from "react";
import { ordersApi } from "../api/orders.api";

const OrderPurchase = ({ orderId }: { orderId: string }) => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    async function getOrderPurchase() {
      const res = await ordersApi.getOrderPurchase(orderId);
      setOrders(res.data.data);
    }
    getOrderPurchase();
  }, []);

  return <div>{JSON.stringify(orders, null, 2)}</div>;
};
export default OrderPurchase;
