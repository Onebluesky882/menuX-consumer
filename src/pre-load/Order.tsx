"use client";

import { SlipVerify } from "@/api/slip-verifications.api";
import { QrcodeReceive } from "@/components/order/QrcodeReceive";
import { GroupedData } from "@/types/menuOrder.type";
import { useCallback, useEffect, useMemo, useState } from "react";
import { InsertSlip, ScanQrTitle } from "../components/order";
import RenderOrderItems from "../components/order/RenderOrderItems";
import RenderQrCodeData from "../components/order/RenderQrcode";
import { Webcam } from "../components/order/Webcam";
import useOrders from "../hooks/useOrders";
import useSlipVerify from "../hooks/useSlipVerify";

const OrderSummary = ({ orderId }: { orderId: string }) => {
  const [openCamera, setOpenCamera] = useState(false);
  const [qrcode, setQrcode] = useState<SlipVerify[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReset, setIsReset] = useState(false);

  // useOrders
  const { orders, fetchOrder, getTotalPrice } = useOrders();

  // useSlipVerify
  const { verifySlip } = useSlipVerify();
  const totalPrice = useMemo(() => getTotalPrice(), [orders]);
  const verifySlipWithLoading = useCallback(
    async (qrcodeData: string, orderId: string, amount: string) => {
      setLoading(true);
      try {
        await verifySlip(qrcodeData, orderId, amount);
      } finally {
        setLoading(false);
      }
    },
    [verifySlip]
  );
  const grouped = useMemo(() => {
    const result: GroupedData = {};
    orders?.forEach(item => {
      const menu = item.menuName;
      const price = parseFloat(item.priceEach).toFixed(2);
      const qty = parseFloat(item.quantity);
      const label = item.optionLabel;

      if (!result[menu]) result[menu] = {};
      if (!result[menu][price]) {
        result[menu][price] = {
          totalQuantity: qty,
          optionLabel: label,
          totalPrice: qty * parseFloat(price),
        };
      } else {
        result[menu][price].totalQuantity += qty;
        result[menu][price].totalPrice += qty * parseFloat(price);
      }
    });
    return result;
  }, [orders]);

  const handleScan = useCallback(
    (qrcode_data: string) => {
      const data: SlipVerify = {
        amount: totalPrice.toString(),
        qrcode_data,
        orderId,
      };
      setQrcode([data]);
      setOpenCamera(false);
      setIsReset(false); // Reset the reset flag when new QR code is scanned
      setError(null); // Clear any previous errors
    },
    [totalPrice, orderId]
  );

  const handleCamera = useCallback(() => {
    setOpenCamera(prev => !prev);
  }, []);

  useEffect(() => {
    fetchOrder(orderId);
  }, [orderId]);

  const resetQrCode = useCallback(() => {
    setQrcode([]);
    setError(null);
    setIsReset(true);
    setResetKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        resetQrCode();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, resetQrCode]);

  useEffect(() => {
    if (qrcode.length === 0) return;
    verifySlipWithLoading(
      qrcode[0].qrcode_data,
      orderId,
      totalPrice.toString()
    );
  }, [qrcode, orderId, totalPrice, verifySlip]);

  if (!orderId) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <p className="text-red-600">Order ID is required</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-lg border text-gray-800 space-y-6 text-xl font-medium leading-relaxed">
      <ScanQrTitle orderId={orderId} />
      {/* Order Items */}
      <RenderOrderItems grouped={grouped} totalPrice={totalPrice} />
      {/* QR Code receive*/}
      {!openCamera && <QrcodeReceive />}
      {/* Camera section */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 max-w-xl mx-auto">
        <Webcam
          key={`webcam-${resetKey}`} // Force remount when resetKey changes
          openCamera={openCamera}
          handleCamera={handleCamera}
          handleScan={handleScan}
        />

        {/* QR Code Data Display */}
        <RenderQrCodeData
          qrcode={qrcode}
          resetQrCode={resetQrCode}
          loading={loading}
          error={error}
        />
      </div>

      <InsertSlip />
    </div>
  );
};

export default OrderSummary;
