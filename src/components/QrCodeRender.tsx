"use client";

import { decodeQR } from "@/lib/scanQrcode";
import { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
const QrCodeRender = () => {
  const [numQrCode, setNumQrCode] = useState<string | null>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];

    if (!file) return;
    const code = await decodeQR(file);
    setNumQrCode(code);
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <div>
      <input
        hidden
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {numQrCode && <p>decode qr code : {numQrCode}</p>}
      <BsFillImageFill
        onClick={handleClick}
        size={40}
        className="text-gray-400"
      />
    </div>
  );
};

export default QrCodeRender;
