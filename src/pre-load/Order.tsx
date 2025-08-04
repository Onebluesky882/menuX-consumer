"use client";

import { ordersApi } from "@/api/orders.api";
import { checkSlipApi, SlipVerify } from "@/api/slip-verifications.api";
import { QrcodeReceive } from "@/components/order/QrcodeReceive";
import { slipVerifySchema } from "@/schema/slipVerifySchema";
import { GroupedData, RawOrderItem } from "@/types/menuOrder.type";
import { useCallback, useEffect, useMemo, useState } from "react";
import { InsertSlip } from "../components/order/insertSlip";
import { Webcam } from "../components/order/Webcam";
import QrCodeRender from "../components/QrCodeRender";

const OrderSummary = ({ orderId }: { orderId: string }) => {
  const [orders, setOrders] = useState<RawOrderItem[]>([]);
  const [openCamera, setOpenCamera] = useState(false);
  const [qrcode, setQrcode] = useState<SlipVerify[]>([]);

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

  const verifySlip = useCallback(async () => {
    if (qrcode.length === 0) return;
    try {
      const prepareData: SlipVerify = {
        amount: String(totalPrice),
        qrcode_data: qrcode[0].qrcode_data,
        orderId: orderId,
      };
      const parsed = slipVerifySchema.safeParse(prepareData);
      console.log("parsed", parsed);
      if (!parsed.success) {
        throw new Error();
      }
      await checkSlipApi.postSlip(parsed.data);
    } catch (error) {
      console.error("❌ Slip verification failed:", error);
    }
  }, [qrcode, totalPrice, orderId]);

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
          <h3 className="font-medium mb-1">QR Code slip:</h3>
          <div className="space-y-1">
            {qrcode.map((item, index) => (
              <div key={`qr-${index}`} className="font-mono text-xs">
                {item.qrcode_data}
              </div>
            ))}
          </div>
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
      {/* Qr Code  receive*/}
      {!openCamera && <QrcodeReceive />}
      {/* camera section */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 max-w-xl mx-auto">
        {!openCamera && (
          <Webcam
            openCamera={openCamera}
            handleCamera={handleCamera}
            handleScan={handleScan}
          />
        )}

        {/* QR Code Data Display */}
        {renderQrCodeData()}
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 max-w-xl mx-auto">
        <InsertSlip>
          <QrCodeRender handleScan={handleScan} />
        </InsertSlip>
      </div>{" "}
    </div>
  );
};

export default OrderSummary;
