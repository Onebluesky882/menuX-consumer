"use client";

import { ordersApi } from "@/api/orders.api";
import { checkSlipApi, SlipVerify } from "@/api/slip-verifications.api";
import { QrcodeReceive } from "@/components/order/QrcodeReceive";
import { slipVerifySchema } from "@/schema/slipVerifySchema";
import { GroupedData, RawOrderItem } from "@/types/menuOrder.type";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { InsertSlip, ScanQrTitle } from "../components/order";
import RenderOrderItems from "../components/order/RenderOrderItems";
import RenderQrCodeData from "../components/order/RenderQrcode";
import { Webcam } from "../components/order/Webcam";

const OrderSummary = ({ orderId }: { orderId: string }) => {
  const router = useRouter();
  const [orders, setOrders] = useState<RawOrderItem[]>([]);
  const [openCamera, setOpenCamera] = useState(false);
  const [qrcode, setQrcode] = useState<SlipVerify[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReset, setIsReset] = useState(false);

  const totalPrice = useMemo(() => {
    return orders?.reduce(
      (sum, i) => sum + Number(i.quantity) * Number(i.priceEach),
      0
    );
  }, [orders]);

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

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      const res = await ordersApi.getOrderById(orderId);
      setOrders(res.data.data);
    } catch (error: any) {
      let errorMessage = "เกิดข้อผิดพลาดในการตรวจสอบสลิป";
      console.error("❌ Failed to fetch order:", error);
      if (error.response?.status === 400) {
        errorMessage = "ข้อมูล QR Code ไม่ถูกต้อง กรุณาสแกนใหม่";
      } else if (error.response?.status === 404) {
        errorMessage = "ไม่พบข้อมูลสลิป";
      } else if (error.response?.status === 422) {
        errorMessage = "จำนวนเงินไม่ตรงกับสลิป";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    }
  }, [orderId]);

  const resetQrCode = useCallback(() => {
    setQrcode([]);
    setError(null);
    setIsReset(true);
    setResetKey(prev => prev + 1);
    console.log("🔄 QR Code reset triggered");
  }, []);

  // Updated verifySlip with reset mechanism
  const verifySlip = useCallback(async () => {
    if (qrcode.length === 0 || isReset) return;

    try {
      const prepareData: SlipVerify = {
        amount: String(totalPrice),
        qrcode_data: qrcode[0].qrcode_data,
        orderId: orderId,
      };

      setLoading(true);
      setError(null);

      const parsed = slipVerifySchema.safeParse(prepareData);
      if (!parsed.success) {
        throw new Error("Invalid slip data format");
      }

      const slipRes = await checkSlipApi.postSlip(parsed.data);

      if (slipRes && slipRes.data) {
        console.log("✅ Slip verification successful:", slipRes.data);

        // Update order status
        const orderRes = await ordersApi.updateOrderPurchase(orderId);
        console.log("✅ Order updated:", orderRes.data);

        if (orderRes.data.length !== 0) {
          router.push(`purchase/${orderId}`);
        }
      } else {
        throw new Error("No data received from slip verification");
      }
    } catch (error: any) {
      console.error("❌ Slip verification failed:", error);

      let errorMessage = "เกิดข้อผิดพลาดในการตรวจสอบสลิป";

      if (error.response?.status === 400) {
        errorMessage = "ข้อมูล QR Code ไม่ถูกต้อง กรุณาสแกนใหม่";
      } else if (error.response?.status === 404) {
        errorMessage = "ไม่พบข้อมูลสลิป";
      } else if (error.response?.status === 422) {
        errorMessage = "จำนวนเงินไม่ตรงกับสลิป";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);

      // Auto reset after 3 seconds
    }
  }, [qrcode, totalPrice, orderId, isReset, router]);

  // ใส่ใน component OrderSummary
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        resetQrCode();
      }, 5000); // 5 วินาที

      return () => clearTimeout(timer);
    }
  }, [error, resetQrCode]);

  // Effects
  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  useEffect(() => {
    verifySlip();
  }, [verifySlip]);

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
      // insert slip
      <InsertSlip />
    </div>
  );
};

export default OrderSummary;
