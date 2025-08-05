"use client";

import { ordersApi } from "@/api/orders.api";
import { checkSlipApi, SlipVerify } from "@/api/slip-verifications.api";
import { QrcodeReceive } from "@/components/order/QrcodeReceive";
import { slipVerifySchema } from "@/schema/slipVerifySchema";
import { GroupedData, RawOrderItem } from "@/types/menuOrder.type";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { InsertSlip } from "../components/order/insertSlip";
import { Webcam } from "../components/order/Webcam";
import QrCodeRender from "../components/QrCodeRender";

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
    } catch (error) {
      console.error("❌ Failed to fetch order:", error);
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
      setTimeout(() => {
        resetQrCode();
      }, 3000);
    } finally {
      setLoading(false);
    }
  }, [qrcode, totalPrice, orderId, isReset, router, resetQrCode]);

  // Effects
  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  useEffect(() => {
    verifySlip();
  }, [verifySlip]);

  const renderOrderItems = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">รายการอาหาร</h2>
      {Object.entries(grouped).map(([menuName, prices], index) => (
        <div key={`${menuName}-${index}`} className="mb-4">
          <h3 className="font-bold text-xl text-gray-700 mb-1">{menuName}</h3>
          <ul className="ml-4 space-y-1 text-lg">
            {Object.entries(prices).map(([price, summary], i) => (
              <li key={`${price}-${i}`} className="flex justify-between py-1">
                <span>
                  {summary.optionLabel} × {summary.totalQuantity}
                </span>
                <span>{summary.totalPrice.toFixed(2)} ฿</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="border-t pt-4 mt-4 text-right text-2xl font-bold">
        รวมทั้งสิ้น: <span className="text-green-600">{totalPrice} ฿</span>
      </div>
    </div>
  );

  const renderQrCodeData = () => {
    const hasQrData = qrcode.some(item => item.qrcode_data?.trim());
    if (hasQrData) {
      return (
        <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-800 break-words">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">QR Code slip:</h3>
            <button
              onClick={resetQrCode}
              className="text-xs text-red-600 hover:text-red-800 underline"
            >
              Reset
            </button>
          </div>
          <div className="space-y-1">
            {qrcode.map((item, index) => (
              <div key={`qr-${index}`} className="font-mono text-xs">
                {item.qrcode_data.substring(0, 50)}...
              </div>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-2 text-center">
              <div className="inline-flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                กำลังตรวจสอบสลิป...
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
              <div className="mt-1 text-gray-600">
                จะรีเซ็ตอัตโนมัติใน 3 วินาที...
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (!orderId) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <p className="text-red-600">Order ID is required</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-lg border text-gray-800 space-y-6 text-xl font-medium leading-relaxed">
      {/* Header / ร้าน */}
      <div className="text-center border-b pb-4">
        <h1 className="text-4xl font-bold tracking-wide text-blue-600">
          MenuX
        </h1>
        <p className="text-xl">ใบสรุปรายการอาหาร</p>
        <p className="text-gray-600 mt-1 text-base">Order ID: {orderId}</p>
      </div>

      {/* Order Items */}
      {renderOrderItems()}

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
        {renderQrCodeData()}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 max-w-xl mx-auto">
        <InsertSlip>
          <QrCodeRender
            key={`qr-render-${resetKey}`} // Also reset QrCodeRender
            handleScan={handleScan}
          />
        </InsertSlip>
      </div>
    </div>
  );
};

export default OrderSummary;
