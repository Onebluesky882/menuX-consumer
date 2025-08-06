import { SlipVerify } from "../../api/slip-verifications.api";

type RenderQrCodeDataProps = {
  qrcode: SlipVerify[];
  resetQrCode: () => void;
  loading: boolean;
  error: string | null;
};
const RenderQrCodeData = ({
  qrcode,
  resetQrCode,
  loading,
  error,
}: RenderQrCodeDataProps) => {
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
          <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
            <div className="mt-1 text-gray-600 text-xs">
              จะรีเซ็ตอัตโนมัติใน 5 วินาที...
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default RenderQrCodeData;
