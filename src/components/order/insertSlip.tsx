type QrCodeRenderProp = {
  children: React.ReactNode;
};

export const InsertSlip = ({ children }: QrCodeRenderProp) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">แนบสลิปโอนเงิน</h2>
      <div className="border border-dashed gap-2  border-gray-300 rounded-xl p-4 flex justify-center items-center mb-4 bg-gray-50 wrap-normal">
        {children}
        <span className="text-[14px] text-gray-500">อัพโหลดสลิป</span>
      </div>
    </div>
  );
};
