"use client";

import { decodeQR } from "@/lib/scanQrcode";
import { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";

type Props = {
  handleScan: (qrcode: string) => void;
};

const QrCodeRender = ({ handleScan }: Props) => {
  const [numQrCode, setNumQrCode] = useState<string | null>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];

    if (!file) return;
    const code = await decodeQR(file);
    if (code) {
      setNumQrCode(code);
      handleScan(code);
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col">
      <input
        hidden
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <BsFillImageFill
        onClick={handleClick}
        size={40}
        className="text-gray-400"
      />
    </div>
  );
};

export default QrCodeRender;
