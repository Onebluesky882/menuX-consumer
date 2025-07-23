import { FC } from "react";
import CameraCapture from "../CameraCapture";
import { QrcodeLiveScan, TouchClick } from "../DotLottieReact";
import { Button } from "../ui/button";

type WebcamProps = {
  openCamera: boolean;
  handleCamera: () => void;
  handleScan: (data: string) => void;
};

export const Webcam = ({
  openCamera,
  handleCamera,
  handleScan,
}: WebcamProps) => {
  return (
    <div className="flex flex-col items-center gap-3 mb-4">
      <div className="relative">
        <Button
          onClick={handleCamera}
          className="z-100 bg-blue-600 text-white hover:bg-blue-700"
        >
          {openCamera ? "ปิดกล้อง" : "แสกนอัตโนมัติ"}
        </Button>
        {!openCamera && <TouchClick />}
      </div>
      {!openCamera && <QrcodeLiveScan />}
      {openCamera && (
        <div className="w-full max-w-sm border rounded-lg overflow-hidden">
          <CameraCapture onScan={handleScan} />
        </div>
      )}
    </div>
  );
};
type QrCodeRenderProp = {
  QrCodeRender: FC;
};

export const RequestCamera = ({ QrCodeRender }: QrCodeRenderProp) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">แนบสลิปโอนเงิน</h2>
      <div className="border border-dashed gap-2  border-gray-300 rounded-xl p-4 flex justify-center items-center mb-4 bg-gray-50">
        <QrCodeRender />
        <span className="text-[14px] text-gray-500">อัพโหลดสลิป</span>
      </div>
      <div className="flex items-center justify-center mb-4 text-sm text-gray-500">
        <span className="px-2">หรือ</span>
      </div>
    </div>
  );
};
