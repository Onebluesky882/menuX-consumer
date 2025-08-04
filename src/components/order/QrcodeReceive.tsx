import Image from "next/image";
export const QrcodeReceive = () => {
  return (
    <div className="text-center bg-gray-50 rounded-xl p-5 border">
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">
        แสกนเพื่อชำระเงิน
      </h2>

      <p className="text-xl text-gray-700 mb-2">
        บัญชี: <strong>mademyday วันของฉัน</strong>
      </p>
      <Image
        src="/IMG_1198.JPG"
        alt="QR Code"
        width={200}
        height={200}
        className="mx-auto rounded-md border"
        priority
      />
    </div>
  );
};
