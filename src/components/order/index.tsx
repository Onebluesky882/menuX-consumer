import QrCodeRender from "../QrCodeRender";

export const InsertSlip = ({ resetKey, handleScan }: any) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">แนบสลิปโอนเงิน</h2>
      <div className="border border-dashed gap-2  border-gray-300 rounded-xl p-4 flex justify-center items-center mb-4 bg-gray-50 wrap-normal">
        <QrCodeRender
          key={`qr-render-${resetKey}`} // Also reset QrCodeRender
          handleScan={handleScan}
        />
        <span className="text-[14px] text-gray-500">อัพโหลดสลิป</span>
      </div>
    </div>
  );
};

export const ScanQrTitle = ({ orderId }: { orderId: string }) => {
  return (
    <div className="text-center border-b pb-4">
      <h1 className="text-4xl font-bold tracking-wide text-blue-600">MenuX</h1>
      <p className="text-xl">ใบสรุปรายการอาหาร</p>
      <p className="text-gray-600 mt-1 text-base">Order ID: {orderId}</p>
    </div>
  );
};
